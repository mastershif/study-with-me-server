const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GroupPurpose = {
    EXAM: 1,
    REVISION: 2,
    FOCUS: 3,
    OTHER: 4,
};
Object.freeze(GroupPurpose);

const GroupType = {
    FRONTAL: 1,
    VIRTUAL: 2,
};
Object.freeze(GroupType);

const groupSchema = new Schema({
    id: Number,
    topic: String,
    purpose: GroupPurpose,
    description: String,
    sameInstituteOnly: Boolean,
    date: Date,
    startHour: Date,
    endHour: Date,
    maxSize: Number,
    frontalOrVirtual: GroupType,
    city: String,
    location: String,
    videoLink: String,
    calendar: Boolean,
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
