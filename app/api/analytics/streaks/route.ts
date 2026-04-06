import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import studySession from "@/app/models/studyRecord";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MINUTES_PER_HOUR = 60;
const DAYS_IN_WEEK = 7;

export async function GET() {
  try {
    await connectDb();

    const sessions = await studySession
      .find({}, { _id: 0, createdAt: 1, durationMinutes: 1 }) // ✅ exclude _id
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const mostRecent = uniqueDates[0];
    const studiedToday = mostRecent === today.getTime();
    const atRisk = !studiedToday && mostRecent === yesterday.getTime(); // ✅ properly computed

    const longestStreak = getLongest(uniqueDates);

    if (!studiedToday && !atRisk) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak,
        studiedToday: false,
        atRisk: false,
      });
    }

    let currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = uniqueDates[i - 1] - uniqueDates[i];
      if (diff === ONE_DAY_MS) {
        currentStreak++;
      } else {
        break;
      }
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const last7Days = sessions.filter(
      (s) => new Date(s.createdAt) >= sevenDaysAgo,
    );

    const totalDurationMinutes = last7Days.reduce(
      (accu, d) => accu + d.durationMinutes,
      0,
    );

    if (!Number.isFinite(totalDurationMinutes) || totalDurationMinutes < 0) {
      throw new RangeError(
        `Invalid totalDurationMinutes: ${totalDurationMinutes}`,
      );
    }

    const totalHours = totalDurationMinutes / MINUTES_PER_HOUR;

    const averageStudy = {
      sevenDaysHours: parseFloat(totalHours.toFixed(2)),
      sevenDaysAvg: parseFloat((totalHours / DAYS_IN_WEEK).toFixed(2)),
    };

    const last4DaysData = Array.from({ length: 4 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const minutesStudied = sessions
        .filter((s) => {
          const sessionDate = new Date(s.createdAt);
          return sessionDate >= day && sessionDate < nextDay;
        })
        .reduce((acc, s) => acc + s.durationMinutes, 0);

      return {
        date: day.toISOString().split("T")[0],
        hoursStudied: parseFloat(
          (minutesStudied / MINUTES_PER_HOUR).toFixed(2),
        ),
      };
    });

    return NextResponse.json({
      totalDurationMinutes: totalDurationMinutes ?? 0,
      averageStudy: {
        sevenDaysHours: averageStudy.sevenDaysHours ?? 0,
        sevenDaysAvg: averageStudy.sevenDaysAvg ?? 0,
      },
      currentStreak: currentStreak ?? 0,
      longestStreak: longestStreak ?? 0,
      last4Days: last4DaysData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function getLongest(sortedDates: number[]): number {
  if (sortedDates.length === 0) return 0;
  if (sortedDates.length === 1) return 1;
  let max = 1,
    current = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    if (sortedDates[i - 1] - sortedDates[i] === ONE_DAY_MS) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 1;
    }
  }
  return max;
}

// After your existing sessions fetch...
