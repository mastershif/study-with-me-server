const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let Group = require("../models/group").Group;
const { User } = require("../models/user");

router.put("/", async(request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (user === null) {
            return response.status(500).json({ message: 'user is noyt found' })
        }

        const group = await Group.findById(mongoose.Types.ObjectId(request.body.groupId));
        if (group === null) {
            return response.status(500).json({ message: 'group does not exist' })
        }

        await User.findByIdAndUpdate(user._id, { $pull: { groups: group._id } }, { new: true }); // filter & delete

        await Group.findByIdAndUpdate(group._id, { $pull: { users: { _id: user._id } } }, { new: true }); // filter & delete

        response.status(200).json("User Left Group!");

    } catch (error) {
        response.status(500).json({ message: error });
    }

});

module.exports = router;