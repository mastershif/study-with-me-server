const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;

router.delete("/:groupID", async(request, response) => {
    try {
        const groupID = request.params.groupID;
        await Group.deleteOne({ _id: groupID })
        response.status(200).json({ message: `Group ${groupID} was deleted successfully` });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error });
    }
});

module.exports = router;