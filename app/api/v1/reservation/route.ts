import Reservation from "@/lib/mongodb/models/Reservation"
import ApiResponse from "@/utils/ApiResponse";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const deviceId = request.headers.get('ssid') || '';
    // Validate required fields
    const requiredFields = ["fullName", "phoneNumber", "numberOfPeople", "reservationDateTime"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Here you would typically save the reservation to your database
    // For this example, we'll just simulate a successful response

    // Simulate a slight delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const reservation = new Reservation({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      numberOfPeople: data.numberOfPeople,
      reservationDateTime: data.reservationDateTime,
      deviceId: deviceId
    })

    reservation.save()
    return NextResponse.json(
      new ApiResponse(201, { ...reservation }, 'Reservation created successfully'),
    );
  } catch (error) {
    console.error("Error processing reservation:", error)
    return NextResponse.json({ success: false, message: "Failed to process reservation" }, { status: 500 })
  }
}
