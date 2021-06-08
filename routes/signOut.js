const express = require("express");
const router = express.Router();

router.get("/", async(request, response) => {
    request.session.destroy();
    return response.send("The user has disconnected and the session has destroyed.");
});

module.exports = router;
