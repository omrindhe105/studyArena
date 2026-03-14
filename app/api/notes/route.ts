import { connectDb } from "@/lib/db";
import Note from "@/app/models/notes";
import { connect } from "http2";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDb();

  const body = await req.json();
  const data = body.notes;
  const date = new Date();
  const note = new Note({ notes: data, Date: date });
  console.log(note);
  await note.save();

  return new Response("Note saved", { status: 201 });
}

export async function GET(){
     connectDb();
     try{
        const notes = await Note.find()
        return NextResponse.json(notes, { status: 200 });
     }
     catch(error){
        console.error("Error fetching notes:", error);
        return new Response("Error fetching notes", { status: 500 });
     }

}


