import mongoose from 'mongoose';

export const CounterSchemaName = "Counter"; 
// Counter schema with sequence type and number
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },  // The key to identify the type (e.g., 'orderId', 'paymentId')
    seq: { type: Number, default: 0 },      // The sequence number for this type
    type: { type: String, required: true },  // The type of sequence (e.g., 'orderId', 'paymentId')
  },
  {
    collection: CounterSchemaName,  // Collection name (this can be any name)
    versionKey: false,       // Disable version key (_v)
  }
);

// Check if the model already exists in mongoose.models to avoid overwriting
const Counter =  mongoose?.models?.Counter  || mongoose.model('Counter', counterSchema);

export default Counter;

