const express = require("express");
const router = express.Router();
let User = require("../models/user").User;

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let user = await User.findOne({ email: email });
    response.send(user);
});

router.post("/", async(request, response) => {
    let reqBody = request.body;
    let newUser = new User({
        username: reqBody.username,
        email: reqBody.email,
        userImg: reqBody.userImg,
        institute: reqBody.institute,
        degree: reqBody.degree,
        calendarIntegration: reqBody.calendarIntegration,
        major: "",
        minor: "",
        groups: [],
    });
    await newUser.save();
    response.send("New User Created");
});

module.exports = router;