import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const DiscountCouponsSchemaName = "DiscountCoupons"; // Collection name

export interface ICoupon extends Document {
    id: string;
    label: string;
    discount:number;
    startAt:Date;
    endBy:Date;
}


const DiscountCouponsSchema = new Schema<ICoupon>(
    {
        id: {
            type: String,
            required: true,
            default: uuidv4, // Generate a UUID as the default value for the id field
        },
        label: {
            type: String,
            required: true, // Ensures the displayId is unique
        },
        discount: {
            type: Number,
            required: true,
        },
        startAt: {
            type: Date,
            required: true,
        },
        endBy: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
        collection: DiscountCouponsSchemaName, // Correctly reference UserSchemaName here
    }
);


// Create and export the Order model
const DiscountCoupons = mongoose?.models?.DiscountCoupons || mongoose.model('DiscountCoupons', DiscountCouponsSchema);


export default DiscountCoupons;
