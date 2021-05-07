const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const profileSettingsRouter = require("./routes/profileSettings");
const profilePageRouter = require("./routes/profile");
const groupRouter = require("./routes/group");
const port = 5000;

mongoose
    .connect(
        "mongodb+srv://StudyWithMe:studywithme@studywithme.v0fgu.mongodb.net/StudyWithMe?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Failed to connect to DB"));

app.use(express.json());
app.use(cors());
app.use("/profileSettings", profileSettingsRouter);
app.use("/profile", profilePageRouter);
app.use("/group", groupRouter);

app.listen(port, () => {
    console.log(`Study With Me server listening at http://localhost:${port}`);
});
