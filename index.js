'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const server = express();
server.use(bodyParser.json());

server.post('/', function (req, res) {
  console.log('webhook request');
  try {
      if (req.body) {
          var requestBody = req.body;
          if (requestBody.result) {
            if (requestBody.result.action == 'photo_auth') {
              console.log("inside photo_auth intent");
              var speech = "Your body is:"+JSON.stringify(requestBody)
              return res.json({
                  speech: speech,
                  displayText: speech,
                });
            }
          }
      }
  }
  catch (err) {
    console.error('Cannot process request', err);
    return res.status(400).json({
        status: {
            code: 400,
            errorType: err.message
        }
    });
  }
});

server.listen((process.env.PORT || 8000), function () {
  console.log('Server listening');
});