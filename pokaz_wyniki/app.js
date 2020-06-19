var express=require("express"); 
var bodyParser=require("body-parser"); 
  
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

var query = {"secrete_id": String(secrete_id)};
db.collection('details').find(query).toArray(function(err,result) {
    if (err) throw err;
    var result_os=result[0]["osname"]
    var result_hash=result[0]["hashed_secret"]
    return res.write('<html><body><p> Your answear was: '+String(result_os)+' and your SHA256 hash was: '+String(result_hash)+'</p></body></html>');
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
