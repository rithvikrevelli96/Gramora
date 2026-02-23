import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hashed password
    createdAt: { type: Date, default: Date.now }
});

// ✅ Prevent OverwriteModelError by reusing existing model if already compiled
export default mongoose.models.User || mongoose.model('User', userSchema);