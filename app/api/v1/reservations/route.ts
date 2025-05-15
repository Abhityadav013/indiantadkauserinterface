import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connect"
import Reservation, { IReservation } from "@/lib/mongodb/models/Reservation"
import ApiResponse from "@/utils/ApiResponse"
import { ReservationType } from "@/lib/types/reservation_type"

// In a real application, this would be fetched from a database
// For this example, we'll generate some mock data

export async function GET(
  request: NextRequest,
) {
  await connectToDatabase();
  const deviceId = request.headers.get('ssid') || '';
  const reservationInfo = await Reservation.find({ deviceId: deviceId })
    .select('-_id -deviceId -tid')
    .lean<IReservation[]>();

  if (!reservationInfo) {
    return NextResponse.json(new ApiResponse(404, {}, 'Reservation info not found.'));
  }
  const reservationResponse: ReservationType[] = reservationInfo.map((info) => {
    return {
      displayId: info.displayId,
      id: info.id,
      fullName: info.fullName,
      phoneNumber: info.phoneNumber,
      numberOfPeople: info.numberOfPeople,
      reservationDateTime: info.reservationDateTime,
    }
  })

  return NextResponse.json(
    new ApiResponse(200, [...reservationResponse], 'Reservation detail fetched successfully'),
  );
}
