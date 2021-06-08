const express = require("express");
const router = express.Router();
const User = require("../models/user").User;

router.get("/", async(request, response) => {
    let user = await User.findOne({ email: request.session.verifiedEmail });
    response.send(user);
});

router.put("/userImage", async(request, response) => {
    ///////////////////////////////////////////////////////////////////////////// ====> need to change after uniting the repositories
    let newUserImg = request.file.path
        .substring(request.file.path.indexOf("assets"), request.file.path.length)
        .replace(/\\/g, "/");
    /////////////////////////////////////////////////////////////////////////////
    await User.updateOne({ email: request.session.verifiedEmail }, { userImg: newUserImg });
    response.send("User Profile Picture Updated!");
});

router.put("/", async(request, response) => {
    await User.updateOne({ email: request.session.verifiedEmail }, request.body);
    response.send("User Updated!");
});

module.exports = router;