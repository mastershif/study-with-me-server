const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    _id: Schema.Types.ObjectId,
    groupTitle: String,
    groupPurpose: String,
    groupDescription: String,
    institution: String,
    date: Date,
    startHour: Date,
    endHour: Date,
    groupSize: Number,
    meetingType: String,
    city: String,
    place: String,
    link: String,
    communicationChannel: String,
    users: [{
        _id : Schema.Types.ObjectId,
        name : String,
        imageUrl: String,
    }],
    admin: Schema.Types.ObjectId,
    deleted: Boolean
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
