const express = require("express");
const router = express.Router();
const User = require("../models/user").User;

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let user = await User.findOne({ email: email });
    response.send(user);
});

router.put("/:email", async(request, response) => {
    let email = request.params.email;
    ///////////////////////////////////////////////////////////////////////////// ====> need to change after uniting the repositories
    let newUserImg = request.file.path
        .substring(request.file.path.indexOf("assets"), request.file.path.length)
        .replace(/\\/g, "/");
    /////////////////////////////////////////////////////////////////////////////
    await User.updateOne({ email: email }, { userImg: newUserImg });
    response.send("User Profile Picture Updated!");
});

router.put("/", async(request, response) => {
    let email = request.body.email;
    await User.updateOne({ email: email }, request.body);
    response.send("User Updated!");
});

module.exports = router;