import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    meetingCode: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

// Drop the unique index on meetingCode if it exists so multiple users can join the same meeting
Meeting.collection.dropIndex('meetingCode_1').catch(err => {
    // silently ignore if index doesn't exist
});

export default Meeting;