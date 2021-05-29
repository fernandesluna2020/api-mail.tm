const Mailjs = require("./Mailjs");
const mailjs = new Mailjs();
const jwt = require('jsonwebtoken');

var express = require('express');
var app = express();

// app.get('/message/:id', function (req, res) {
//   jwt.sign({ foo: 'bar' }, 'privateKey', { algorithm: 'RS256' }, function(err, token) {
//     mailjs.getDomains()
//     .then(res => {
//       console.log("testezinho2805@"+res.data[0].domain)
//       mailjs.login("testezinho2805@"+res.data[0].domain, "password")
//       .then(
//         mailjs.getMessage(req.params.id)
//         .then(console.log)
//       );
//     });     
//   })
// });

app.get('/:email/register/', function (req, response) {
  jwt.sign({ foo: 'bar' }, 'privateKey', { algorithm: 'RS256' }, function(err, token) {
    mailjs.getDomains()
    .then(res => {
      let email = req.params.email+"@"+res.data[0].domain;
      mailjs.register(email, "password")
      .then(
        response.json({code: 200, message:'created => '+email})
      );
    });     
  })
});

app.get('/:email/last', function (req, response) {
  jwt.sign({ foo: 'bar' }, 'privateKey', { algorithm: 'RS256' }, function(err, token) {
    mailjs.getDomains()
   .then(res => {
      let email = req.params.email+"@"+res.data[0].domain;
      try {
        mailjs.login(email, "password")
        .then(
          mailjs.getMessages()
          .then(res => {
            try {
              mailjs.getMessage(res.data[0].id)
              .then(res => {
                response.json({code: 200, message:res});
              })
            } catch (error) {
              response.json({code: 201, message:'logged => '+email});
            }
          })
        );
      } catch (error) {
        response.json('email not found');
      }
   });
 })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});