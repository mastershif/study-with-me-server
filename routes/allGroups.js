const express = require("express");
const router = express.Router();
let Group = require("../models/group").Group;

router.get("/", async(request, response) => {
    Group.find({}, function(err, result) {
        if (err) {
            return response.status(500).json({ message: "An error occurred while getting the groups." });
        } else {
            response.send(result);
        }
    });
});

module.exports = router;
