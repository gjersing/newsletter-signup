const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

const mailListId = 'a9c97bdf51';

mailchimp.setConfig({
  apiKey: '78a81fd6188551469e2e788ed7504c5d-us14',
  server: 'us14',
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req,res) => {

  const subscribingUser = {
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email
  }

  //API call to mailchimp to add user to mailing list
  async function run() {
    const response = await mailchimp.lists.addListMember(mailListId, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    //On success
    res.sendFile(__dirname + '/success.html');
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
    );
  }

  //Runs the async function, catches errors and returns failure page.
  run().catch(e => res.sendFile(__dirname + '/failure.html'));
});

app.post('/failure', (req,res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server running on Port 3000');
});
