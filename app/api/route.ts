import { connectDb } from "@/lib/db";

export async function GET() {
  await connectDb();
  return new Response("Connected to MongoDB");
}
