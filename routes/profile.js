const express = require("express");
const router = express.Router();
let User = require("../models/user").User;
let Group = require("../models/group").Group;

router.get("/", async(request, response) => {
    let user = await User.findOne({ email: request.session.verifiedEmail });
    if (user) {
        let userGroups = await Group.find({ _id: { $in: user.groups } });
        response.send([user, userGroups]);
    }
});

module.exports = router;