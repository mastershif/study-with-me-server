const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
let Group = require("../models/group").Group;
const { User } = require("../models/user");

router.post("/", async(request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email }).select('groups');
        if (user === null) {
            return response.status(500).json({ message: `User with email ${request.body.email} was not found` });
        }
        const userGroups = await User.findOne({ email: request.body.email }).select('groups');
        if (userGroups === null) {
            return response.status(500).json({ message: `User with email ${request.body.email} doesn't have field 'groups'` });
        }
        const group = await Group.findById(mongoose.Types.ObjectId(request.body.groupId));
        // add the new group to the user's groups
        User.findByIdAndUpdate(user._id, { groups: [...userGroups.groups, group._id] }, { strict: false });
        Group.findByIdAndUpdate(group._id, { users: [...group.users, user._id] }, { strict: false });
        response.status(200).json({ message: `User ${request.body.email} has joined the group ${group.groupTitle}`});
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;
