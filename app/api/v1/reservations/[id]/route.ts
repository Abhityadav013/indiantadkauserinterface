import { connectToDatabase } from "@/lib/mongodb/connect";
import Reservation from "@/lib/mongodb/models/Reservation";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { params } = context;
    await connectToDatabase();
    const deviceId = request.headers.get('ssid') || '';
    const { id } = params
    // In a real application, you would delete the reservation from your database
    // For this example, we'll just simulate a successful response

    // Simulate a slight delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    const reservationInfo = await Reservation.deleteOne({ id, deviceId: deviceId })

    if (!reservationInfo) {
      return NextResponse.json(new ApiResponse(404, {}, 'Reservation info not found.'));
    }
    return NextResponse.json(new ApiResponse(201, {}, 'Reservation deleted successfully.'));
  } catch (error) {
    console.error("Error deleting reservation:", error)
    return NextResponse.json({ success: false, message: "Failed to delete reservation" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const deviceId = request.headers.get('ssid') || '';
    // Validate required fields
    const requiredFields = ["fullName", "phoneNumber", "numberOfPeople", "reservationDateTime"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // In a real application, you would update the reservation in your database
    // For this example, we'll just simulate a successful response

    // Simulate a slight delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedReservationPayload = {
      id,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      numberOfPeople: data.numberOfPeople,
      reservationDateTime: data.reservationDateTime,
      deviceId: deviceId
    }

    const updateReservationInfo = await Reservation.updateOne({
      id, deviceId: deviceId
    }, {
      $set: { ...updatedReservationPayload }
    })

    if (updateReservationInfo && Object.keys(updateReservationInfo).length > 0 && updateReservationInfo.modifiedCount > 0) {
      return NextResponse.json(
        new ApiResponse(201, { ...updatedReservationPayload }, 'Reservation updated successfully'),
      );
    }

  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ success: false, message: "Failed to update reservation" }, { status: 500 })
  }
}
