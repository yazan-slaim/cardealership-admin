// app/api/client/post-note/route.js

import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import { Client } from '@/models/Client';
import { Note } from '@/models/Note';

export async function POST(req) {
  try {
    await connectMongoDB();

    const { clientId, authorId, content, tags = [], taggedAgents = [] } = await req.json();

    if (!clientId || !authorId || !content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'clientId, authorId, and content are required' },
        { status: 400 }
      );
    }

    const newNote = new Note({
      author: authorId,
      client: clientId,
      content: content.trim(),
      taggedAgents,
      createdAt: new Date(),
    });

    await newNote.save();

    const client = await Client.findById(clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    client.notes.push(newNote._id);
    await client.save();

    return NextResponse.json({
      success: true,
      note: newNote,
      message: 'Note added successfully',
    });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
