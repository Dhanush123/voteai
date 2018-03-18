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
              photoAuth(requestBody,res);
//              var speech = "Your body is:"+JSON.stringify(requestBody)
//              return res.json({
//                  speech: speech,
//                  displayText: speech,
//                });
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

function photoAuth(body,clbk) {
    var imageUrl = body["originalRequest"]["data"]["message"]["attachments"][0]["payload"]["url"];
    console.log("url:",url);
    var options = { method: 'POST',
    url: 'https://api.clarifai.com/v2/models/SFHacks2018/outputs',
    headers: 
     { authorization: 'Key a55f155142f9481dbb369f5f34bc04e2',
       'content-type': 'application/json' },
    body: { inputs: [ { data: { image: { url: imageUrl } } } ] },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //--------------------------------
    var confidence = body["outputs"][0]["data"]["concepts"][0]["value"];
    console.log("photo match confidence:",confidence);
    var speech = confidence > 0.5 ? "Welcome to your voting portal Dhanush Patel." : "Unauthorized access attempt. This incident has been reported!"; 
    return clbk.json({
        speech: speech,
        displayText: speech,
      });
    });
}

server.listen((process.env.PORT || 8000), function () {
  console.log('Server listening');
});