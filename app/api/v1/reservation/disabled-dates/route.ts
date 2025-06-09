import { NextResponse } from "next/server";
import { addDays } from "date-fns";

export async function GET() {
  try {
    const today = new Date();
    const disabledDates: Date[] = [];

    // Check next 30 days for Mondays
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      if (date.getDay() === 1) { // 1 = Monday
        disabledDates.push(date);
      }
    }

    // Simulate a slight delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      dates: disabledDates.map((date) => date.toISOString()),
    });
  } catch (error) {
    console.error("Error fetching disabled dates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch disabled dates" },
      { status: 500 }
    );
  }
}
