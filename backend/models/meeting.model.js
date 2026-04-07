import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    meetingCode: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;