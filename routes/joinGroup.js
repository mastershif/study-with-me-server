const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;
const { User } = require("../models/user");

router.post("/joinGroup", async(request, response) => {
    try {
        const user = await User.findById(request.params.email).select('groups');
        const userGroups = await User.findById(request.params.email).select('groups');
        const groupId = await Group.findById(request.params.groupId);
        // add the new group to the user's groups
        User.findByIdAndUpdate(user, { groups: [...userGroups, groupId] });
        response.status(200).json({ message: `User ${user} asked to join group ${groupId}`});
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;
