const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    id: Number,
    topic: String,
    purpose: String,
    description: String,
    sameInstituteOnly: Boolean,
    date: Date,
    startHour: Date,
    endHour: Date,
    maxSize: Number,
    frontalOrVirtual: String,
    city: String,
    location: String,
    videoLink: String,
    calendar: Boolean,
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
