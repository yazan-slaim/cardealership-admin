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

  for (const onefile of data) {
    const file = data.get("file");
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type; // This is the correct MIME type
    const originalName = file.name;
    const extension = originalName?.split(".").pop() || "bin";
    const newFilename = `${Date.now()}.${extension}`;

    const blobClient = ContainerClient.getBlockBlobClient(newFilename);
    await blobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    const link = `https://${storageAccountName}.blob.core.windows.net/files/${newFilename}`;
    links.push(link);
  }

  return NextResponse.json({ links });
}