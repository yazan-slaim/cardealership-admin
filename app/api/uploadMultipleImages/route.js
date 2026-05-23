import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  let storageAccountName = "bestecommercestorage";
  let sasToken =
    "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-01T08:45:40Z&st=2024-09-05T00:45:40Z&spr=https&sig=cI90NjrTuIu6dMnyPTKoP9N7UL%2FuU4VYLUkfoXg43vU%3D";
  const data = await request.formData();
  const links = [];
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const ContainerClient = blobService.getContainerClient("files");
  await ContainerClient.createIfNotExists({
    access: "container",
  });
  const files = data.getAll("file");
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type;
    const parts = contentType.split("/");
    const extension = parts[parts.length - 1];
    const newFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const blobClient = ContainerClient.getBlockBlobClient(newFilename);
    await blobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });
    const link = `https://${storageAccountName}.blob.core.windows.net/files/${newFilename}`;
    links.push(link);
  }
  return NextResponse.json({ links });
}
