import { Schema, model } from 'mongoose';

const accountSchema = new Schema({
  username: { type: String, unique: true, required: true, lowercase: true, trim: true },
  email: { type: String, trim: true },
  manageToken: { type: String, required: true },
}, { timestamps: true });

const Account = model('Account', accountSchema);
export default Account;