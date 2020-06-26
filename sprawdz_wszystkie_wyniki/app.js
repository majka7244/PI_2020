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


    db.collection("details").find({}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result.length);
        // console.log(result[0]["osname"]);
        // console.log(result[0]["osname_mobile"]);
        // console.log(result[0]["browsername"]);
        var result_length = result.length; 
        var no_windows=0
        var no_linux=0
        var no_others_pc=0
        var no_android=0
        var no_ios=0
        var no_others_mobile=0
        var no_chrome=0
        var no_firefox=0
        var no_opera=0
        var no_others_browsers=0
        for (i = 0; i < result.length; i++) {
            // console.log(result[i]["osname"]);
            if(result[i]["osname"].toLowerCase().includes("windows")){no_windows++}
            else if(result[i]["osname"].toLowerCase().includes("linux")){no_linux++}
            else{no_others_pc++}
          }
        for (i = 0; i < result.length; i++) {
            // console.log(result[i]["osname_mobile"]);
            if(result[i]["osname_mobile"].toLowerCase().includes("android")){no_android++}
            else if(result[i]["osname_mobile"].toLowerCase().includes("ios")){no_ios++}
            else{no_others_mobile++}
          }
        for (i = 0; i < result.length; i++) {
            // console.log(result[i]["browsername"]);
            if(result[i]["browsername"].toLowerCase().includes("chrome")){no_chrome++}
            else if(result[i]["browsername"].toLowerCase().includes("firefox")){no_firefox++}
            else if(result[i]["browsername"].toLowerCase().includes("opera")){no_opera++}
            else{no_others_browsers++}
          }
        var procent_windows = +((no_windows / result_length * 100).toFixed(2));
        var procent_linux = +((no_linux / result_length * 100).toFixed(2));
        var procent_pc_others = +((no_others_pc / result_length * 100).toFixed(2));
        var procent_android = +((no_android / result_length * 100).toFixed(2));
        var procent_ios = +((no_ios / result_length * 100).toFixed(2));
        var procent_mobile_others = +((no_others_mobile / result_length * 100).toFixed(2));
        var procent_chrome = +((no_chrome / result_length * 100).toFixed(2));
        var procent_firefox = +((no_firefox / result_length * 100).toFixed(2));
        var procent_opera = +((no_opera / result_length * 100).toFixed(2));
        var procent_others_browsers = +((no_others_browsers / result_length * 100).toFixed(2));

        // debug 
        // console.log("procent_windows")
        // console.log(procent_windows)
        // console.log("procent_linux")
        // console.log(procent_linux)
        // console.log("procent_pc_others")
        // console.log(procent_pc_others)
        // console.log("procent_android")
        // console.log(procent_android)
        // console.log("procent_ios")
        // console.log(procent_ios)
        // console.log("procent_mobile_others")
        // console.log(procent_mobile_others)
        // console.log("procent_chrome")
        // console.log(procent_chrome)
        // console.log("procent_firefox")
        // console.log(procent_firefox)
        // console.log("procent_opera")
        // console.log(procent_opera)
        // console.log("procent_others_browsers")
        // console.log(procent_others_browsers)
        
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
        <p> Podsumowanie udzielonych odpowiedzi, wyniki w procentach: </p> \
        <p> System PC Windows: '+String(procent_windows)+'%</p> \
        <p> System PC Linux: '+String(procent_linux)+'%</p> \
        <p> Pozostale systemy PC : '+String(procent_pc_others)+'%</p> \
        <p> System Mobile Android: '+String(procent_android)+'%</p> \
        <p> System Mobile IOS: '+String(procent_ios)+'%</p> \
        <p> Pozostale systemy Mobilne : '+String(procent_mobile_others)+'%</p> \
        <p> Przeglądarka Chrome: '+String(procent_chrome)+'%</p> \
        <p> Przeglądarka Firefox: '+String(procent_firefox)+'%</p> \
        <p> Przeglądarka Opera : '+String(procent_opera)+'%</p> \
        <p> Pozostałe przeglądarki : '+String(procent_others_browsers)+'%</p> \
        </form> \
        </div> \
        <div class="col-md-3"> \
        </div> \
        </div> \
        </div> \
        </body> \
        </html>');
        db.close();
      });


}) 
  
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3002) 
  
  
console.log("server listening at port 3002"); 
