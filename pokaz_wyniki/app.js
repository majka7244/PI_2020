var express=require("express"); 
var bodyParser=require("body-parser"); 
const crypto = require('crypto');
  
const mongoose = require('mongoose'); 
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express() 
app.use(express.static(__dirname));

  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
app.post('/sign_up', function(req,res){ 
    var secrete_id = req.body.secrete_id; 
    var user_password = req.body.user_password; 

var query = {"secrete_id": String(secrete_id)};
db.collection('details').find(query).toArray(function(err,result) {
    if (err) throw err;
    var result_os=result[0]["osname"]               // wybrana odpowiedz z bazy 
    var result_hash=result[0]["hashed_secret"]      // hash z bazy 
     // hash z odpowiedzi z bazy oraz podanego przez uzytkownika hasla 
    var check_hash = crypto.createHash("sha256")    
        .update(result_os+user_password)
        .digest("hex");
    // let s=if(costam) - jezeli hash jest rowny z tym na bazie to zwroc stringa ze jest ok a jak nie to ze nie jest ok .
    if(check_hash==result_hash){
        // return res.write('<html><body><p> Udzielona odpowiedź to: '+String(result_os)+' oraz hash jest zgodny </p></body></html>')
        return res.write('<html> \
            <head> \
            <title> Signup Form</title> \
            <link rel="stylesheet" href= "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> \
            <link rel="stylesheet" type="text/css" href="style.css"> \
            </head> \
            <body> \
            <br> \
            <br> \
            <br> \
            <div class="container" > \
            <div class="row"> \
            <div class="col-md-3"> \
            </div> \
            <div class="col-md-6 main"> \
            <form action="/sign_up" method="post"> \
            <p> Udzielona odpowiedź to: '+String(result_os)+'</p> \
            <p> Twoj Hash jest zgodny</p> \
            </form> \
            </div> \
            <div class="col-md-3"> \
            </div> \
            </div> \
            </div> \
            </body> \
            </html>');
    }
    else{
        return res.write('<html> \
            <head> \
            <title> Signup Form</title> \
            <link rel="stylesheet" href= "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> \
            <link rel="stylesheet" type="text/css" href="style.css"> \
            </head> \
            <body> \
            <br> \
            <br> \
            <br> \
            <div class="container" > \
            <div class="row"> \
            <div class="col-md-3"> \
            </div> \
            <div class="col-md-6 main"> \
            <form action="/sign_up" method="post"> \
            <p> Twoj Hash nie jest zgodny</p> \
            </form> \
            </div> \
            <div class="col-md-3"> \
            </div> \
            </div> \
            </div> \
            </body> \
            </html>');
    }

    // return res.write('<html><body><p> Your answear was: '+String(result_os)+' and your SHA256 hash was: '+String(result_hash)+'</p></body></html>');



    db.close();
  });
}) 
  
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3001) 
  
  
console.log("server listening at port 3001"); 
