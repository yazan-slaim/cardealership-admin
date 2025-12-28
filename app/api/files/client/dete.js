// /app/api/files/delete-file/route.js
import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { connectMongoDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
import { File } from '@/models/File';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

const account = process.env.AZURE_STORAGE_ACCOUNT;
const sas = process.env.AZURE_BLOB_SAS;
const containerName = process.env.AZURE_BLOB_CONTAINER || 'files';

function blobNameFromUrl(url) {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split('/').pop() || '');
  } catch { return ''; }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { fileId, clientId } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(fileId) || !mongoose.Types.ObjectId.isValid(clientId)) {
      return NextResponse.json({ success:false, message:'Invalid IDs' }, { status:400 });
    }

    const file = await File.findById(fileId);
    if (!file) return NextResponse.json({ success:false, message:'File not found' }, { status:404 });

    const bs = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);
    const container = bs.getContainerClient(containerName);
    const blobName = blobNameFromUrl(file.url);
    if (blobName) {
      const blob = container.getBlockBlobClient(blobName);
      await blob.deleteIfExists();
    }

    await File.deleteOne({ _id: fileId });
    await Client.updateOne({ _id: clientId }, { $pull: { files: fileId } });

    return NextResponse.json({ success:true }, { status:200 });
  } catch (err) {
    console.error('[DELETE FILE ERROR]', err);
    return NextResponse.json({ success:false, message:'Delete failed', error:String(err) }, { status:500 });
  }
}
