import { NextResponse } from "next/server"
import { addDays } from "date-fns"

export async function GET() {
  try {
    // In a real application, you would fetch this data from your database
    // For this example, we'll generate some random dates

    const today = new Date()
    const disabledDates: Date[] = []

    // Add some random dates in the next 30 days
    for (let i = 0; i < 5; i++) {
      const randomDays = Math.floor(Math.random() * 30) + 1
      const disabledDate = addDays(today, randomDays)

      // Ensure we're not adding duplicate dates
      if (
        !disabledDates.some(
          (date) =>
            date.getFullYear() === disabledDate.getFullYear() &&
            date.getMonth() === disabledDate.getMonth() &&
            date.getDate() === disabledDate.getDate(),
        )
      ) {
        disabledDates.push(disabledDate)
      }
    }

    // Simulate a slight delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      dates: disabledDates.map((date) => date.toISOString()),
    })
  } catch (error) {
    console.error("Error fetching disabled dates:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch disabled dates" }, { status: 500 })
  }
}
