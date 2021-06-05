require('dotenv').config();
const express = require("express");
const Session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const profileSettingsRouter = require("./routes/profileSettings");
const profilePageRouter = require("./routes/profile");
const groupRouter = require("./routes/group");
const joinGroupRouter = require("./routes/joinGroup");
const deleteGroupRouter = require("./routes/deleteGroup");
const leaveGroupRouter = require("./routes/leaveGroup");
const calendarSyncRouter = require("./routes/calendarSync");
const signInRouter = require("./routes/signIn");
const allGroupsRouter = require("./routes/allGroups")
const port = 5000;

mongoose
    .connect(
        "mongodb+srv://StudyWithMe:studywithme@studywithme.v0fgu.mongodb.net/StudyWithMe?retryWrites=true&w=majority"
    )
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Failed to connect to DB"));

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "../study-with-me/src/assets/users-Images"),
    filename: (req, file, cb) => cb(null, file.originalname),
});

app.use(multer({ storage: imageStorage }).single("userImage"));
app.use(express.json());
app.use(cors());
app.use("/profileSettings", profileSettingsRouter);
app.use("/profile", profilePageRouter);
app.use("/group", groupRouter);
app.use("/joinGroup", joinGroupRouter);
app.use("/leaveGroup", leaveGroupRouter);
app.use("/deleteGroup", deleteGroupRouter);
app.use("/leaveGroup", leaveGroupRouter);
app.use("/signIn", signInRouter);
app.use("/allGroups", allGroupsRouter);
app.use("/calendarSync", calendarSyncRouter);
app.use(Session({
    secret: 'raysources-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));

app.listen(port, () => {
    console.log(`Study With Me server listening at http://localhost:${port}`);
});