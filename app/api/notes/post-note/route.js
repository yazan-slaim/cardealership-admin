import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { Activity } from "@/models/Activity";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { clientId, authorId, content, taggedAgents = [] } = await req.json();

    if (!clientId || !authorId || !content?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(clientId) ||
      !mongoose.Types.ObjectId.isValid(authorId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 },
      );
    }

    // Create note
    const newNote = await Note.create({
      author: authorId,
      client: clientId,
      content: content.trim(),
      taggedAgents,
    });

    // Log activity
    await Activity.create({
      client: clientId,
      type: "note_added",
      metadata: {
        preview: content.trim().substring(0, 80),
        taggedCount: taggedAgents.length,
      },
      performedBy: authorId,
    });

    // Populate author + tagged agents before returning
    await newNote.populate([
      { path: "author", select: "fullName email role" },
      { path: "taggedAgents", select: "fullName email role" },
    ]);

    return NextResponse.json(
      {
        success: true,
        note: newNote,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding note:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
