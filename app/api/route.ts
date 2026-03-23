import { connectDb } from "@/lib/db";
import StudySession from "@/app/models/studyRecord";

export async function GET() {
  await connectDb();
  return new Response("Connected to MongoDB");
}

export async function POST(req: Request) {
  await connectDb();
  const { durationMinutes, sessionType } = await req.json();
  const date = new Date();
  const studySession = new StudySession({
    durationMinutes,
    sessionType,
    createdAt: date,
  });

  await studySession.save();
  return new Response("Study session recorded", { status: 201 });
}


