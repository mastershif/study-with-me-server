const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    _id: Schema.Types.ObjectId,
    groupTitle: String,
    groupPurpose: String,
    groupDescription: String,
    institution: Boolean,
    date: Date,
    startHour: Date,
    endHour: Date,
    groupSize: Number,
    meetingType: String,
    city: String,
    place: String,
    link: String,
    calendar: Boolean,
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
