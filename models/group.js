let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let groupSchema = new Schema({
    id: Number,
    topic: String,
    purpose: String,
    description: String,
    sameInstituteOnly: Boolean,
    date: String,
    startHour: String,
    endHour: String,
    maxSize: Number,
    frontalOrVirtual: String,
    city: String,
    location: String,
    videoLink: String,
});

let Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
