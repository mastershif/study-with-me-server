const express = require('express');
const app = express();
const port = 5000;

app.get('/', (request, response) => {
    response.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
