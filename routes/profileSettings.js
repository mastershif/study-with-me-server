const express = require("express");
const router = express.Router();
let User = require("../models/user").User;

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let user = await User.findOne({ email: email });
    response.send(user);
});

router.put("/", async(request, response) => {
    let email = request.body.email;
    await User.updateOne({ email: email }, request.body);
    response.send("User Updated!");
});

module.exports = router;