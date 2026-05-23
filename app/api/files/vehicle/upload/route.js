import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import crypto from 'node:crypto';
import { connectMongoDB } from '@/lib/mongodb';
import { Car } from '@/models/Car';
import { File } from '@/models/File';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

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
    const carId = form.get('carId');
    const uploadedBy = form.get('uploadedBy') || null;

    if (!file || !carId) {
      return NextResponse.json({ success:false, message:'file and carId are required' }, { status:400 });
    }

    // Azure upload
    const bs = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
    const container = bs.getContainerClient(containerName);
    await container.createIfNotExists({ access: 'container' });

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';
    const blobName = `vehicle-${Date.now()}-${crypto.randomUUID()}.${extOf(file.name)}`;
    const blob = container.getBlockBlobClient(blobName);
    await blob.uploadData(buffer, { blobHTTPHeaders: { blobContentType: mimeType } });

    const url = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;

    // Create File doc + link to car
    const car = await Car.findById(carId);
    if (!car) return NextResponse.json({ success:false, message:'Car not found' }, { status:404 });

    const fileDoc = await File.create({
      uploadedBy: uploadedBy && mongoose.Types.ObjectId.isValid(uploadedBy) ? uploadedBy : undefined,
      name,
      fileType,
      url,
      size: buffer.length,
      mimeType,
    });

    car.files.push(fileDoc._id);
    await car.save();

    return NextResponse.json({ success:true, file:fileDoc }, { status:201 });
  } catch (err) {
    console.error('[VEHICLE FILES UPLOAD ERROR]', err);
    return NextResponse.json({ success:false, message:'Upload failed', error:String(err) }, { status:500 });
  }
}
