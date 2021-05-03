const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;

router.get("/:groupId", async(request, response) => {
    let groupId = request.params.groupId;
    let group = await Group.findOne({ groupId: groupId });
    response.send(group);
});

router.put("/", async(request, response) => {
    const groupDetails = {
        topic: request.body.topic,
        purpose: request.body.purpose,
        description: request.body.description,
        sameInstituteOnly: request.body.sameInstituteOnly || false,
        date: request.body.date,
        startHour: request.body.startHour,
        endHour: request.body.endHour,
        maxSize: request.body.maxSize,
        frontalOrVirtual: request.body.frontalOrVirtual,
        city: request.body.city,
        location: request.body.location,
        videoLink: request.body.videoLink,
    };
    await Group.create(groupDetails);
    response.send("Created a group!");
});

module.exports = router;
