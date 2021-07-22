const express = require("express");
const router = express.Router();
let User = require("../models/user").User;
let Group = require("../models/group").Group;

router.get("/userInformation", async(request, response) => {
    let user = await User.findOne({ email: request.session.verifiedEmail });
    if (user) {
        response.send(user);
    }
});

router.get("/userGroups", async(request, response) => {
    let user = await User.findOne({ email: request.session.verifiedEmail });
    if (user) {
        let userGroups = await Group.find({ _id: { $in: user.groups } });
        response.send([user._id, userGroups]);
    }
});

module.exports = router;