const express = require("express");
const router = express.Router();
let User = require("../models/user").User;
const Group = require("../models/group").Group;

router.delete("/:groupID", async(request, response) => {
    try {
        const groupID = request.params.groupID;
        const group = await Group.findOne({ _id: groupID })
        const groupUsers = await User.find({ _id: { $in: group.users } });
        for (i = 0; i < groupUsers.length; i++) {
            await User.updateOne({ _id: groupUsers[i]._id }, { $pull: { 'groups': groupID } });
        }
        await Group.deleteOne({ _id: groupID })
        response.status(200).json({ message: `Group ${groupID} was deleted successfully` });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;