var express = require('express');
var router = express.Router();
var db = require('../connection.js');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const {
  wrap
} = require('co');
const {
  join
} = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const thunkify = require('thunkify');
const read = thunkify(require('fs').readFile);
const handlebars = require('handlebars');
var path = "../certificateddocs/";
const pdf_options = {
  format: 'A4',
  quality: 150,
  orientation: "landscape",
  zoomFactor: "0.5"
};
var Cryptr = require('cryptr'),
  cryptr = new Cryptr('myTotalySecretKey');

var hash;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var count = 0;


router.get('/getdebtor', function (err, res) {


  db.query('SELECT Debtor FROM ucc.Participants;', function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send(result);
  });

})


router.get('/getcollaterol', function (err, res) {

  db.query('SELECT Collaterol FROM ucc.Participants;', function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send(result);
  });

})

router.get('/getsecuredparties', function (err, res) {

  db.query('SELECT Seuredparty FROM ucc.Participants;', function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send(result);
  });

})

router.get('/getstates', function (err, res) {

  db.query('SELECT state FROM ucc.Drop_downs;', function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send(result);
  });

})

// router.get('/getjurisdiction',function(err,res){

//   db.query('SELECT jurisdiction FROM ucc.Participants;', function(err, result) {
//     if (err) throw err;
//     else
//     console.log(result);
//     res.send(result);
//   });

// })
// router.post('/getstates', jsonParser,function(req,res){

//   var data= req.body.country;
//   console.log(data);
//   db.query("SELECT state FROM ucc.Drop_downs where country =" + "'" + data + "'", function(err, result) {
//     if (err) throw err;
//     else
//     console.log(result);
//     res.send(result);
//   });

// })


router.post('/getjurisdictions', jsonParser, async (req, res) => {

  var data = req.body.state;
  console.log(data);
  db.query("SELECT jurisdiction FROM ucc.Drop_downs where state=" + "'" + data + "'", function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send(result);
  });

})


router.post('/submitdoc', jsonParser, async (req, res) => {

  // var data= req.body.state;
  // console.log(data);
  // db.query("SELECT jurisdiction FROM ucc.Drop_downs where state=" + "'" + data + "'", function(err, result) {
  //   if (err) throw err;
  //   else
  //   console.log(result);
  //   res.send(result);
  // });


  const generatePDF = wrap(function* () {

    const data = {

      student: {
        name: 'Mahesh',
        course: 'Mean Stack',
        date: '22nd June',
        year: '2016'
      },
      user: {
        New_Filling_State: req.body.New_Filling_State,

        New_Filling_Jurisdiction: req.body.New_Filling_Jurisdiction,

        Filling_Form_Type: req.body.Filling_Form_Type,

        Billing_ref_1: req.body.Billing_ref_1,


        Debtor_Type: req.body.Debtor_Type,

        Debtor_Party_type: req.body.Debtor_Party_type,

        Debtor_Organisation_Name: req.body.Debtor_Organisation_Name,

        Debtor_Mailing_Address: req.body.Debtor_Mailing_Address,

        Debtor_City: req.body.Debtor_City,

        Debtor_State: req.body.Debtor_State,

        Debtor_Postal_Code: req.body.Debtor_Postal_Code,


        Secured_Party_Type: req.body.Secured_Party_Type,

        Party_type: req.body.Party_type,

        Secured_Party_Organisation_Name: req.body.Secured_Party_Organisation_Name,

        Secured_Party_Mailing_Address: req.body.Secured_Party_Mailing_Address,

        Secured_Party_City: req.body.Secured_Party_City,

        Secured_Party_State: req.body.Secured_Party_State,

        Secured_Party_Postal_Code: req.body.Secured_Party_Postal_Code,



        Collateral_Type: req.body.Collateral_Type,

        Type_of_Attachment: req.body.Type_of_Attachment,

        Collateral_Is: req.body.Collateral_Is,
      }
    };

    const source = yield read(join(`${__dirname}/template1.html`), 'utf-8');
    const template = handlebars.compile(source);
    const html = template(data);
    const p = pdf.create(html, pdf_options);
    p.toFile = thunkify(p.toFile);
    var pa = '../certificateddocs/' + req.body.Debtor_Mailing_Address + 'document.pdf';
    console.log(pa);
    yield p.toFile(`${join(__dirname, '../certificateddocs/'+ req.body.Debtor_Mailing_Address +'document.pdf')}`);
    // res.send("Document submited successfully");

  });




  await generatePDF();

  var fs = require('fs');
  var sha256 = require('sha256');

  fs.readFile(`${join(__dirname, '../certificateddocs/' +req.body.Debtor_Mailing_Address +'document.pdf')}`, function (err, buf) {

    if (err) {
      console.log(err)
    } else {
      var filepath = '../certificateddocs/' + req.body.Debtor_Mailing_Address + 'document.pdf';
      hash = sha256(buf);

      count = count + 1;

      db.query("insert into ucc.Documents (id, PDF_Hash, Pdf_Path) VALUES(" + count + ",'" + hash + "','" + filepath + "')", function (err, result) {
        if (err) {
          console.log(err);
        } else
          console.log(result);
        res.send(hash);
      });
    }
  });
})


router.post('/postTransactionId', function (req, res) {

  var data = req.body.transactionId;
  console.log(data);
  console.log(hash);

  db.query("update ucc.Documents SET Transaction_ID =" + "'" + data + "' where PDF_Hash = '" + hash + "'", function (err, result) {
    if (err) throw err;
    else
      console.log(result);
    res.send('Transaction ID Succesfully Saved in DB');
  });
});




module.exports = router;