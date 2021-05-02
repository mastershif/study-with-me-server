const express = require("express");
const router = express.Router();
let User = require("../models/user").User;

router.get("/:email", async(request, response) => {
    let email = request.params.email;
    let user = await User.findOne({ email: email });
    response.send(user);
});

module.exports = router;