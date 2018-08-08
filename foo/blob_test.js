var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
var fs = require('fs');
var hash;
var db = require('./connection.js');
var sha256 = require('sha256');

fs.readFile(__dirname + '/certificateddocs/demodocument.pdf', function(err, buf) {
    //console.log("in");
      if(err){
          console.log(err)
      }        
      else{
        hash = sha256(buf);
        var s = hash.toString();
        console.log(buf);
        console.log(hash);
        var pa = "fsdz/certificateddocs/Assetdocument.pdf";
      //  var data = ;
        db.query("insert into ucc.Documents VALUES(7,'"+hash+"','"+pa +"')", function(err, result) {
            if (err) {
              console.log(err);
            }
            else
            console.log(result);
           // res.send(result);
          });
  
      }

    });



// var e = sha256('helgdvshjfakdlks;khvfdalsnbawvbabdvbadsvblasbdvkjbask;jdvbkjsadbvkjbasdkjvbkjsadvbjksadmx cjksbdajvbjasbdkjvbjadbvjabvkjajdsbkvbkljdvsblo');
// console.log(e);