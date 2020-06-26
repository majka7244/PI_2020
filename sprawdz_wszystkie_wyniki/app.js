var express=require("express");           // Wymagane biblioteki 
var bodyParser=require("body-parser");    // Wymagane biblioteki 
const crypto = require('crypto');         // Wymagane biblioteki 
  
const mongoose = require('mongoose');     // Wymagane biblioteki 
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority');    // Połączenie do bazy mongodb. 
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
app.post('/sign_up', function(req,res){            // Przekierowanie rządania w momencie naciśnięcia przycisku "Submit".
    db.collection("details").find({}).toArray(function(err, result) {     // Przeszukanie bazy "details" w celu uzyskania wszystkich udzielonych odpowiedzi. 
        if (err) throw err;
        var result_length = result.length;            // Zmienna przyjmująca wartość ilości udzielonych ankiet. 
        var no_windows=0                              // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy PC "windows" .
        var no_linux=0                                // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy PC "linux".
        var no_others_pc=0                            // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy PC inne niż windows/linux.
        var no_android=0                              // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy Mobile "android".
        var no_ios=0                                  // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy Mobile "ios".
        var no_others_mobile=0                        // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na system operacyjny klasy Mobile inne niż android/ios.
        var no_chrome=0                               // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na wybraną przeglądarkę "chrome".
        var no_firefox=0                              // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na wybraną przeglądarkę "firefox".
        var no_opera=0                                // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na wybraną przeglądarkę "opera".
        var no_others_browsers=0                      // Zmienna przyjmująca wartość ilości udzielonych odpowiedzi na wybraną przeglądarkę chrome/firefox/opera.
        for (i = 0; i < result.length; i++) {         //Podliczenie wyników systemu operacyjnego klasy PC z bazy.
            if(result[i]["osname"].toLowerCase().includes("windows")){no_windows++}
            else if(result[i]["osname"].toLowerCase().includes("linux")){no_linux++}
            else{no_others_pc++}
          }
        for (i = 0; i < result.length; i++) {         //Podliczenie wyników systemu operacyjnego klasy Mobile z bazy.
            if(result[i]["osname_mobile"].toLowerCase().includes("android")){no_android++}
            else if(result[i]["osname_mobile"].toLowerCase().includes("ios")){no_ios++}
            else{no_others_mobile++}
          }
        for (i = 0; i < result.length; i++) {         //Podliczenie wyników wybranej przeglądarki z bazy.
            if(result[i]["browsername"].toLowerCase().includes("chrome")){no_chrome++}
            else if(result[i]["browsername"].toLowerCase().includes("firefox")){no_firefox++}
            else if(result[i]["browsername"].toLowerCase().includes("opera")){no_opera++}
            else{no_others_browsers++}
          }
        var procent_windows = +((no_windows / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_linux = +((no_linux / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_pc_others = +((no_others_pc / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_android = +((no_android / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_ios = +((no_ios / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_mobile_others = +((no_others_mobile / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_chrome = +((no_chrome / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_firefox = +((no_firefox / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_opera = +((no_opera / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.
        var procent_others_browsers = +((no_others_browsers / result_length * 100).toFixed(2));                 // Tworzenie zmiennych w procentach z udzielonych odpowiedzi w stosunku do wszystkich odpowiedzi.

        // Poniżej znajduje się strona zwracana klientowi wraz ze wszystkimi danymi z bazy. 
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
        <p> Summary of answers given, results in percent: </p> \
        <p> Windows PC system: '+String(procent_windows)+'%</p> \
        <p> PC Linux system: '+String(procent_linux)+'%</p> \
        <p> Other PC systems : '+String(procent_pc_others)+'%</p> \
        <p> Mobile Android system: '+String(procent_android)+'%</p> \
        <p> Mobile IOS system: '+String(procent_ios)+'%</p> \
        <p> Other Mobile systems : '+String(procent_mobile_others)+'%</p> \
        <p> Chrome browser: '+String(procent_chrome)+'%</p> \
        <p> Firefox browser: '+String(procent_firefox)+'%</p> \
        <p> Opera browser : '+String(procent_opera)+'%</p> \
        <p> Other browsers : '+String(procent_others_browsers)+'%</p> \
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
