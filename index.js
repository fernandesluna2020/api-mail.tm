const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const Mailjs = require("./Mailjs");
const mailjs = new Mailjs();
const jwt = require('jsonwebtoken');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/:email/register/', function (req, response) {
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
  })
  .get('/:email/last', function (req, response) {
    jwt.sign({ foo: 'bar' }, 'privateKey', { algorithm: 'RS256' }, function(err, token) {
      mailjs.getDomains()
     .then(res => {
        let email = req.params.email+"@"+res.data[0].domain;
        try {
          // mailjs.login(email, "password")
          // .then(
          //   mailjs.getMessages()
          //   .then(res => {
          //     try {
          //       mailjs.getMessage(res.data[0].id)
          //       .then(res => {
          //         response.json({code: 200, message:res});
          //       })
          //     } catch (error) {
          //       response.json({code: 201, message:'logged => '+email});
          //     }
          //   })
          // );
          mailjs.last(email, "password")
          .then(res => {
            response.json({code: 200, message:res});
          });
        } catch (error) {
          response.json('email not found');
        }
     });
   })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

