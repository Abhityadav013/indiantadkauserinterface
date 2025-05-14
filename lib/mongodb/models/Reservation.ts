import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Counter from "./Counter";

export const ReservationSchemaName = "Reservation"; // Collection name

export interface IReservation extends Document {
    id: string;
    displayId: string
    fullName: string;
    phoneNumber: string;
    numberOfPeople: string;
    reservationDateTime: Date,
    deviceId: string
}


const ReservationSchema = new Schema<IReservation>(
    {
        id: {
            type: String,
            required: true,
            default: uuidv4, // Generate a UUID as the default value for the id field
        },
        displayId: {
            type: String,
            unique: true, // Ensures the displayId is unique
        },
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        numberOfPeople: {
            type: String,
            required: true,
        },
        reservationDateTime: {
            type: Date,
            required: true
        },
        deviceId: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        collection: ReservationSchemaName, // Correctly reference UserSchemaName here
    }
);

ReservationSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Get the counter for 'order' type and increment the sequence
            const counter = await Counter.findOneAndUpdate(
                { _id: 'reservation' }, // Find by the 'order' type
                { $inc: { seq: 1 } }, // Increment the sequence
                { new: true, upsert: true }, // Create if not found
            );

            // Generate the displayId (e.g., "O00000001")
            this.displayId = `B${String(counter.seq).padStart(8, '0')}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error generating displayId:', err);
            next(err);
        }
    }
    next();
});

// Create and export the Order model
const Reservation = mongoose?.models?.Reservation || mongoose.model('Reservation', ReservationSchema);


export default Reservation;
