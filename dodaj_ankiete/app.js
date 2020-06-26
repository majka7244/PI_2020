var express=require("express");             // Wymagane biblioteki 
var bodyParser=require("body-parser");      // Wymagane biblioteki 
  
const mongoose = require('mongoose');       // Wymagane biblioteki 
const crypto = require('crypto');           // Wymagane biblioteki 
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority');        // Połączenie do bazy mongodb. 
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

app.post('/sign_up', function(req,res){                 // Przekierowanie rządania w momencie naciśnięcia przycisku "Submit".
    var secrete_id=Date.now().toString(10);             // Generowanie ID ankiety na podstawie obecnego czasu, wartość unikatowa. 
    var osname = req.body.osname;                       // Zmienna przyjmująca odpowiedź na system operacyjny klasy PC.
    var osname_mobile = req.body.osname_mobile;         // Zmienna przyjmująca odpowiedź na system operacyjny klasy mobile.
    var browsername = req.body.browsername;             // Zmienna przyjmująca odpowiedź na przeglądarke. 
    var email =req.body.email;                          // Zmienna przyjmująca podany e-mail. 
    var haslo =req.body.haslo;                          // Zmienna przyjmująca podane hasło.
    var hashed_secret = crypto.createHash("sha256")     // Generowanie hash sha256.
        .update(osname+osname_mobile+browsername+haslo) // Hash generowany jest na podstawie odpowiedzi tzn: system operacyjny klasy PC + system operacyjny klasy mobile + przeglądarka + hasło.
        .digest("hex");
    var query = {"email": String(email)};               // Przygotowanie query - wymagane do przeszukania bazy - query zawiera e-mail, potrzebne do weryfikacji powtórzonych e-maili.
    db.collection('unique_emails').findOne(query, function(err, result) {       // W tym momencie rozpoczyna się weryfikacja czy użytkownik wypełniał już ankietę. Weryfikacja na poziomie podanego e-mail (przeszukanie bazy). 
        if (err) throw err;
        if (result) {                                   // Jeżeli mail znajduję się już na bazie, zwróć poniższe.
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
                <h1>  You have already participated in the survey. </h1> \
                </form> \
                </div> \
                <div class="col-md-3"> \
                </div> \
                </div> \
                </div> \
                </body> \
                </html>');
        } else                                      // Jeżeli mail nie znajduje się na bazie przygotuj zestaw danych z ankiety do przekazania na baze. 
        {    
            var data = {                            // Na osobną baze "data" przekazywane są dane z ankiety (udzielone odpowiedzi oraz ID ankiety wraz z hashem).
                "osname": osname, 
                "osname_mobile": osname_mobile,
                "browsername": browsername,
                "secrete_id": secrete_id,
                "hashed_secret": hashed_secret
            } 
            var unique_emails = {                   // Na osobną baze "unique_emails" przekazywane są e-mail.
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
            // Poniższej przygotowana jest strona dla klienta, który pomyślnie wziął udział w ankiecie, a jego odpowiedzi zostały przesłane na baze. 
            let fill_content_id="ID of your survey: "+String(secrete_id)
            let fill_content_hash="Your SHA256 hash is: "+String(hashed_secret)
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
            <p>  '+fill_content_id+' </p> \
            <p>  '+fill_content_hash+' </p> \
            </form> \
            </div> \
            <div class="col-md-3"> \
            </div> \
            </div> \
            </div> \
            </body> \
            </html>');
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
