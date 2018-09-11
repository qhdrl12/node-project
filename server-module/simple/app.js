const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

let port = 5910;

const server = app.listen(port, () => {
    console.log(`app running on port ${port}`);
});