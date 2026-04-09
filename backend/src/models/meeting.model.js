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
    duration: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

Meeting.collection.dropIndex('meetingCode_1').catch(err => {
    // Optionally log or ignore if index doesn't exist
});

export default Meeting;