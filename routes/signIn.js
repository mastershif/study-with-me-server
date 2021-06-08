const express = require("express");
const verifyToken = require("../auth/verifyToken");
const router = express.Router();
let User = require("../models/user").User;

router.get("/", verifyToken,
    async(request, response) => {
        let user = await User.findOne({email: request.session.verifiedEmail});
        if (user) {
            return response.status(200).send(user);
        }
        return response.status(500).send("Can't find the user in the DB.");
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
    await newUser.save()
        .then((document) => {
            if (document) {
                return response.status(200).send("New User Created.");
            }
            return response.status(500).send("Can't save the user to the DB.");
        })
        .catch();
});

module.exports = router;