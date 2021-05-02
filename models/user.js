let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        min: 2,
    },
    email: {
        type: String,
        min: 5,
    },
    institute: String,
    degree: String,
    major: String,
    minor: String,
});

let User = mongoose.model("User", userSchema);

module.exports = { User };