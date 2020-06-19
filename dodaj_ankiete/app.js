var express=require("express"); 
var bodyParser=require("body-parser"); 
  
const mongoose = require('mongoose'); 
const crypto = require('crypto');
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
    var secrete_id=Date.now().toString(10);
    var osname = req.body.osname; 
    var email =req.body.email; 
    var haslo =req.body.haslo; 
    var hashed_secret = crypto.createHash("sha256")
        .update(osname+haslo)
        .digest("hex");
    var query = {"email": String(email)};
    db.collection('unique_emails').findOne(query, function(err, result) {
        if (err) throw err;
        if (result) { 
            return res.write('<html><body><p> Odpowiedz zostala juz udzielona </p></body></html>');
        } else 
        {    
            var data = { 
                "osname": osname, 
                "secrete_id": secrete_id,
                "hashed_secret": hashed_secret
            } 
            var unique_emails = { 
                "email": email 
            } 
        db.collection('details').insertOne(data,function(err, collection){ 
                if (err) throw err; 
                console.log("Record inserted Successfully"); 
                      
            }); 
        db.collection('unique_emails').insertOne(unique_emails,function(err, collection){ 
                if (err) throw err; 
                console.log("unique_emails inserted Successfully"); 
                      
            }); 
            
            let fill_content="your secrete id is "+String(secrete_id)+" and your SHA256 hash is "+String(hashed_secret)
            return   res.write('<html><body><p>'+fill_content+'</p></body></html>');
        }
    })
})

  
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3000) 
  
  
console.log("server listening at port 3000"); 
