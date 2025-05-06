import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Counter from "./Counter";

export const UserSessionSchemaName = "Session"; // Collection name

interface ISession extends Document {
    id: string;
    displayId:string
    guestId: string;
    latitude: string;
    longitude: string;
  }
  

const UserSessionSchema = new Schema<ISession>(
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
    guestId: {
      type: String,
      required: true,
    },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
  },
  {
    versionKey: false,
    collection: UserSessionSchemaName, // Correctly reference UserSchemaName here
  }
);

UserSessionSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Get the counter for 'order' type and increment the sequence
      const counter = await Counter.findOneAndUpdate(
        { _id: 'session' }, // Find by the 'order' type
        { $inc: { seq: 1 } }, // Increment the sequence
        { new: true, upsert: true }, // Create if not found
      );

      // Generate the displayId (e.g., "O00000001")
      this.displayId = `S${String(counter.seq).padStart(8, '0')}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error generating displayId:', err);
      next(err);
    }
  }
  next();
});

// Create and export the Order model
const UserSession =  mongoose?.models?.Session ||  mongoose.model('Session', UserSessionSchema);


export default UserSession;
