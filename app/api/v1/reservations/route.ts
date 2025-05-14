import { NextRequest, NextResponse } from "next/server"
import { addDays, addHours } from "date-fns"
import { connectToDatabase } from "@/lib/mongodb/connect"
import Reservation, { IReservation } from "@/lib/mongodb/models/Reservation"
import ApiResponse from "@/utils/ApiResponse"
import { ReservationType } from "@/lib/types/reservation_type"

// In a real application, this would be fetched from a database
// For this example, we'll generate some mock data
const generateMockReservations = () => {
  const reservations = []
  const today = new Date()

  const names = ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Williams", "James Davis"]

  const phoneNumbers = ["(123) 456-7890", "(234) 567-8901", "(345) 678-9012", "(456) 789-0123", "(567) 890-1234"]

  for (let i = 0; i < 5; i++) {
    const randomDays = Math.floor(Math.random() * 14) - 7 // Some past, some future
    const randomHours = Math.floor(Math.random() * 12) + 11 // Between 11 AM and 11 PM
    const randomMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]

    const reservationDate = addDays(today, randomDays)
    const reservationTime = addHours(new Date(reservationDate.setHours(randomHours, randomMinutes, 0, 0)), 0)

    reservations.push({
      id: Math.random().toString(36).substring(2, 9),
      fullName: names[Math.floor(Math.random() * names.length)],
      phoneNumber: phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
      numberOfPeople: String(Math.floor(Math.random() * 6) + 1),
      reservationDateTime: reservationTime.toISOString(),
    })
  }

  return reservations
}

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
