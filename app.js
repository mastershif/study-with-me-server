require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const isAuthRouter = require("./routes/isAuth");
const profileSettingsRouter = require("./routes/profileSettings");
const profilePageRouter = require("./routes/profile");
const groupRouter = require("./routes/group");
const joinGroupRouter = require("./routes/joinGroup");
const deleteGroupRouter = require("./routes/deleteGroup");
const leaveGroupRouter = require("./routes/leaveGroup");
const signInRouter = require("./routes/signIn");
const signOutRouter = require("./routes/signOut");
const allGroupsRouter = require("./routes/allGroups")
const port = 5000;

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Failed to connect to DB"));

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) =>
        cb(null, "../study-with-me/src/assets/users-Images"),
    filename: (req, file, cb) => cb(null, file.originalname),
});

app.use(multer({ storage: imageStorage }).single("userImage"));
app.use(express.json());
app.use(cors({
    origin : 'http://localhost:3000', //TODO: changing after production.
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,       // TODO: need to think if we want to renew the session after each request.
    store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION }),
    cookie: {
        secure: false,      // TODO: need to change to false when moving to HTTPS.
        maxAge: 2592000000,     // TODO: right now it's one month need to think about it.
    },
}))
app.use("/isAuth", isAuthRouter);
app.use("/profileSettings", profileSettingsRouter);
app.use("/profile", profilePageRouter);
app.use("/joinGroup", joinGroupRouter);
app.use("/leaveGroup", leaveGroupRouter);
app.use("/deleteGroup", deleteGroupRouter);
app.use("/signIn", signInRouter);
app.use("/signOut", signOutRouter);
app.use("/group", groupRouter);
app.use("/allGroups", allGroupsRouter);

app.listen(port, () => {
    console.log(`Study With Me server listening at http://localhost:${port}`);
});