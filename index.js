const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const multer  = require('multer');
const path = require('path')

const {routes} = require('./routes.js')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// const upload = multer({ dest: path.join(process.cwd(), 'tmp')});
// app.use(upload);

routes(app);

const port = process.env.PORT || 8081;
const server = app.listen(port, function () {
   const host = server.address().address;
   const port = server.address().port;

   console.log(`Example app listening at http://${host}:${port}`);
})