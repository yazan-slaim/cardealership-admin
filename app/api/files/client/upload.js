import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import crypto from 'node:crypto';
import { connectMongoDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
import { File } from '@/models/File';
import '@/models/Employee'; // ensure model exists for refs
import mongoose from 'mongoose';

export const runtime = 'nodejs';

// HARD-CODED for now (you'll move these to env later)
const account = 'bestecommercestorage';
const sas = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-01T08:45:40Z&st=2024-09-05T00:45:40Z&spr=https&sig=cI90NjrTuIu6dMnyPTKoP9N7UL%2FuU4VYLUkfoXg43vU%3D';
const containerName = 'files';

function extOf(name = '') {
  const p = name.lastIndexOf('.');
  return p >= 0 ? name.slice(p + 1) : 'bin';
}

export async function POST(req) {
  try {
    await connectMongoDB();

    const form = await req.formData();
    const file = form.get('file');
    const name = form.get('name') || (file?.name ?? 'file');
    const fileType = form.get('fileType') || 'generic';
    const clientId = form.get('clientId');
    const uploadedBy = form.get('uploadedBy') || null;
    const description = form.get('description') || '';

    if (!file || !clientId) {
      return NextResponse.json({ success:false, message:'file and clientId are required' }, { status:400 });
    }
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json({ success:false, message:'Invalid clientId' }, { status:400 });
    }

    // Azure upload (hardcoded creds)
    const bs = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
    const container = bs.getContainerClient(containerName);
    await container.createIfNotExists({ access: 'container' });

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';
    const blobName = `${Date.now()}-${crypto.randomUUID()}.${extOf(file.name)}`;
    const blob = container.getBlockBlobClient(blobName);
    await blob.uploadData(buffer, { blobHTTPHeaders: { blobContentType: mimeType } });

    const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;

    // Create File doc + link to client
    const client = await Client.findById(clientId);
    if (!client) return NextResponse.json({ success:false, message:'Client not found' }, { status:404 });

    const fileDoc = await File.create({
      client: client._id,
      uploadedBy: uploadedBy && mongoose.Types.ObjectId.isValid(uploadedBy) ? uploadedBy : undefined,
      name,
      fileType,
      url,
      size: buffer.length,
      mimeType,
      description,
    });

    client.files.push(fileDoc._id);
    await client.save();

    return NextResponse.json({ success:true, file:fileDoc }, { status:201 });
  } catch (err) {
    console.error('[FILES UPLOAD ERROR]', err);
    return NextResponse.json({ success:false, message:'Upload failed', error:String(err) }, { status:500 });
  }
}
