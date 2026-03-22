import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import studySession from "@/app/models/studyRecord";

export async function GET() {
  await connectDb();
  try {
    const sessions = await studySession
      .find({}, { createdAt: 1 }) 
      .sort({ createdAt: -1 }); 

    const uniqueDates = [
      ...new Set(
        sessions.map((s) => {
          const d = new Date(s.createdAt); 
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      ),
    ].sort((a, b) => b - a);

    const oneDay = 24 * 60 * 60 * 1000;
    console.log("oneDay", oneDay);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = uniqueDates[0];
    const studiedToday = mostRecent === today.getTime();

    // Streak is dead if last study was 2+ days ago
    if (mostRecent !== today.getTime() && mostRecent !== yesterday.getTime()) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: getLongest(uniqueDates),
        studiedToday: false,
        atRisk: false,
      });
    }

    // Count consecutive days
    let currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = uniqueDates[i - 1] - uniqueDates[i];
      if (diff === oneDay) {
        currentStreak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      currentStreak,
      longestStreak: getLongest(uniqueDates),
      studiedToday,
      atRisk: !studiedToday,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function getLongest(sortedDates: number[]): number {
  if (!sortedDates.length) return 0;
  const oneDay = 24 * 60 * 60 * 1000;
  let max = 1,
    current = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    if (sortedDates[i - 1] - sortedDates[i] === oneDay) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }
  return max;
}
