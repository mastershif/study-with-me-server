const express = require("express");
const router = express.Router();
let User = require("../models/user").User;
let Group = require("../models/group").Group;

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let user = await User.findOne({ email: email });
    let userGroups = await Group.find({ _id: { $in: user.groups } });
    response.send([user, userGroups]);
});

module.exports = router;