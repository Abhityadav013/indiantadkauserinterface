import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Counter from './Counter';

export const ContactUsSchemaName = 'ContactUs'; // Collection name

interface IContact extends Document {
  id: string;
  displayId: string;
  name: string;
  message: string;
  deviceId: string;
}

const ContactUsSchema = new Schema<IContact>(
  {
    id: {
      type: String, // GUID for Booking ID
      required: true,
      default: uuidv4, // Automatically generate a GUID if not provided
    },
    displayId: {
      type: String,
      unique: true, // Ensures the displayId is unique
    },
    name: {
      type: String,
      required: true, // Ensures the displayId is unique
    },
    message: {
      type: String,
      required: true, // Ensures the displayId is unique
    },
    deviceId: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Disable the "__v" version key
    collection: ContactUsSchemaName,
  },
);

ContactUsSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // Get the counter for 'order' type and increment the sequence
      const counter = await Counter.findOneAndUpdate(
        { _id: 'contact' }, // Find by the 'order' type
        { $inc: { seq: 1 } }, // Increment the sequence
        { new: true, upsert: true }, // Create if not found
      );

      // Generate the displayId (e.g., "O00000001")
      this.displayId = `C${String(counter.seq).padStart(8, '0')}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error generating displayId:', err);
      next(err);
    }
  }
  next();
});

// Create and export the Order model
const Contact =
  mongoose?.models?.ContactUs || mongoose.model('ContactUs', ContactUsSchema);

export default Contact;
