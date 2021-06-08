const express = require("express");
const router = express.Router();


router.get('/', async(request, response) => {
    if (request.session.verifiedEmail) {
        response.send(true);
    }
    else {
        response.send(false);
    }
})

module.exports = router;
