var express=require("express");             // Wymagane biblioteki 
var bodyParser=require("body-parser");      // Wymagane biblioteki 
const crypto = require('crypto');           // Wymagane biblioteki
  
const mongoose = require('mongoose');       // Wymagane biblioteki
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority');  // Połączenie do bazy mongodb. 
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
app.post('/sign_up', function(req,res){             // Przekierowanie rządania w momencie naciśnięcia przycisku "Submit" 
    var secrete_id = req.body.secrete_id;           // Zmienna przyjmowanie wartość podanego ID ankiety. 
    var user_password = req.body.user_password;     // Zmienna przyjmowanie wartość podanego hasła. 

var query = {"secrete_id": String(secrete_id)};     // Przygotowanie query - wymagane do przeszukania - query zawiera ID ankiety.
db.collection('details').find(query).toArray(function(err,result) {         // Przeszukanie bazy "details" w celu uzyskania udzielonych odpowiedzi. Wyszukiwanie odbywa się na podstawie podanego ID ankiety. 
    if (err) throw err;
    var result_os=result[0]["osname"]                           // Zmienna przyjmująca odpowiedź na system operacyjny klasy PC
    var osname_mobile=result[0]["osname_mobile"]                // Zmienna przyjmująca odpowiedź na system operacyjny klasy mobile
    var browsername=result[0]["browsername"]                    // Zmienna przyjmująca odpowiedź na przeglądarke. 
    var result_hash=result[0]["hashed_secret"]                  // Zmienna przyjmująca hash z bazy. 
    // W tym miejscu następuje generowanie hasha na podstawie odpowiedzi z bazy oraz podanego przez uzytkownika hasla 
    var check_hash = crypto.createHash("sha256")    
        .update(result_os+osname_mobile+browsername+user_password)
        .digest("hex");
    if(check_hash==result_hash){                                // Sprawdź czy hash odpowiada hashowi na bazie. Jeżeli tak, zwróć użytkownikowi listę z udzielonymi odpowiedziami.
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
            <p> Your survey: </p> \
            <p> Selected PC class operating system: '+String(result_os)+'</p> \
            <p> Selected mobile class operating system: '+String(osname_mobile)+'</p> \
            <p> Selected web browser: '+String(browsername)+'</p> \
            <p> Your hash number is correct</p> \
            </form> \
            </div> \
            <div class="col-md-3"> \
            </div> \
            </div> \
            </div> \
            </body> \
            </html>');
    }
    else{       // Jeżeli hash nie jest równy z hashem na bazie poinformuj użytkownika.
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
            <p> Your hash number is not correct, please verify your password or contact site administration</p> \
            </form> \
            </div> \
            <div class="col-md-3"> \
            </div> \
            </div> \
            </div> \
            </body> \
            </html>');
    }



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
