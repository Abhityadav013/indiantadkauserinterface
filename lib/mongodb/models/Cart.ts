import { generateBasketId } from '@/utils/generateBasketId';
import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const UserCartSchemaName = 'Cart'; // Collection name

interface CartItem {
  itemId: string;
  itemName: string;
  quantity: number;
  addons?: string[];
}

export interface ICart extends Document {
  id: string;
  deviceId: string;
  userId?: string;
  cartItems: CartItem[];
  basketId?:string
}

const CartItemSchema = new Schema<CartItem>(
  {
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    addons: { type: [String], default: [] },
  },
  { _id: false }
);

const UserCartSchema = new Schema<ICart>(
  {
    id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    deviceId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    basketId: {
      type: String,
      required: false,
    },
    cartItems: [CartItemSchema],
  },
  {
    versionKey: false,
    collection: UserCartSchemaName,
    timestamps: true, // Optional: if you want createdAt and updatedAt
  }
);

UserCartSchema.pre('validate', async function (next) {
  if (this.isNew) {
    // Ensure custom ID is generated
    if (!this.id) {
      this.id = uuidv4();
    }

    try {
      // Now that ID is present, generate the basket ID
      this.basketId = await generateBasketId(this.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error generating basketId:', err);
      return next(err);
    }
  }

  next();
});

// Optional: Clean cart item _id when serializing
UserCartSchema.set('toJSON', {
  transform: (_doc, ret) => {
    if (ret.cartItems) {
      ret.cartItems.forEach((item: { _id?: string }) => {
        delete item._id;
      });
    }
    return ret;
  },
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', UserCartSchema);

export default Cart;
