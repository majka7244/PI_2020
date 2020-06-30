# W aplikacji dodaj_ankiete. 
### Inicjalizacja wymaganych bibliotek.
```javascript
  
var express=require("express");             
var bodyParser=require("body-parser");       
  
const mongoose = require('mongoose');       
const crypto = require('crypto');            
```
### Połączenie do bazy mongodb. 
```javascript
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority');         
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
```
### Inicjalizacja biblioteki express, API z którego korzysta aplikacja. 
```javascript
var app=express() 
app.use(express.static(__dirname));

  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
```
### Inicjalizacja wymaganych zmiennych 
```javascript
var secrete_id=Date.now().toString(10);             // Generowanie ID ankiety na podstawie obecnego czasu, wartość unikatowa. 
var osname = req.body.osname;                       // Zmienna przyjmująca odpowiedź na system operacyjny klasy PC.
var osname_mobile = req.body.osname_mobile;         // Zmienna przyjmująca odpowiedź na system operacyjny klasy mobile.
var browsername = req.body.browsername;             // Zmienna przyjmująca odpowiedź na przeglądarke. 
var email =req.body.email;                          // Zmienna przyjmująca podany e-mail. 
var haslo =req.body.haslo;                          // Zmienna przyjmująca podane hasło.

```
### Generowanie hash sha256 na podstawie odpowiedzi tzn: system operacyjny klasy PC + system operacyjny klasy mobile + przeglądarka + hasło.
```javascript
var hashed_secret = crypto.createHash("sha256")    
    .update(osname+osname_mobile+browsername+haslo) 
    .digest("hex");
```
### Przygotowanie query - wymagane do przeszukania bazy - query zawiera e-mail, potrzebne do weryfikacji powtórzonych e-maili.
```javascript
    var query = {"email": String(email)};               
```
### weryfikacja czy użytkownik wypełniał już ankietę. Weryfikacja na poziomie podanego e-mail (przeszukanie bazy).
```javascript
    db.collection('unique_emails').findOne(query, function(err, result)      
```
###  Jeżeli mail znajduję się już na bazie, zwracamy odpowiednią treść. 
```javascript
if (result) {                                  
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
}
```
### Przekierowanie danych na baze, gdy użytkownik wypełnia ankiete po raz pierwszy. 
```javascript
else                                      // Jeżeli mail nie znajduje się na bazie przygotuj zestaw danych z ankiety do przekazania na baze. 
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
```
### Zwracana strona dla klienta, który pomyślnie wziął udział w ankiecie, a jego odpowiedzi zostały przesłane na baze.
```javascript 
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
```
### Uruchomienie aplikacji na podanym porcie. 
```javascript
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3000) 
  
  
console.log("server listening at port 3000"); 
```
# W aplikacji pokaz_wyniki
### Inicjalizacja wymaganych bibliotek.
```javascript
  
var express=require("express");             
var bodyParser=require("body-parser");       
  
const mongoose = require('mongoose');       
const crypto = require('crypto');            
```
### Połączenie do bazy mongodb. 
```javascript
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-gzzce.mongodb.net/test?retryWrites=true&w=majority');         
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
```
### Inicjalizacja biblioteki express, API z którego korzysta aplikacja. 
```javascript
var app=express() 
app.use(express.static(__dirname));

  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
```
### Przygotowanie query - wymagane do przeszukania - query zawiera ID ankiety.
```javascript
var query = {"secrete_id": String(secrete_id)};  
```
### Przeszukanie bazy "details" w celu uzyskania udzielonych odpowiedzi. Wyszukiwanie odbywa się na podstawie podanego ID ankiety. 
```javascript
db.collection('details').find(query).toArray(function(err,result)       
```
### Inicjalizacja zmiennych 
```javascript
var result_os=result[0]["osname"]                           // Zmienna przyjmująca odpowiedź na system operacyjny klasy PC
var osname_mobile=result[0]["osname_mobile"]                // Zmienna przyjmująca odpowiedź na system operacyjny klasy mobile
var browsername=result[0]["browsername"]                    // Zmienna przyjmująca odpowiedź na przeglądarke. 
var result_hash=result[0]["hashed_secret"]                  // Zmienna przyjmująca hash z bazy. 
```
### Generowanie hasha na podstawie odpowiedzi z bazy oraz podanego przez uzytkownika hasla 
```javascript
var check_hash = crypto.createHash("sha256")    
        .update(result_os+osname_mobile+browsername+user_password)
        .digest("hex");
```
### Odpowiedź zwrotna w przypadku kiedy hash jest pasujący, następuje zwrócenie użytkownikowi listy z odpowiedziami 
```javascript
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
```
### Jeżeli hash nie jest równy z hashem na bazie informujemy użytkownika poniższą zwrotką. 
```javascript
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
```
### Uruchomienie aplikacji na podanym porcie.
```javascript
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3001) 
  
  
console.log("server listening at port 3001"); 
```

# W aplikacji sprawdz_wszystkie_wyniki.
### Inicjalizacja wymaganych bibliotek.
```javascript
  
var express=require("express");             
var bodyParser=require("body-parser");       
  
const mongoose = require('mongoose');       
const crypto = require('crypto');            
```
### Przeszukanie bazy "details" w celu uzyskania wszystkich udzielonych odpowiedzi. 
```javascript
db.collection("details").find({}).toArray(function(err, result)
```
### Inicjalizacja zmiennych
```javascript
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
```
### Podliczenie wyników systemu operacyjnego klasy PC z bazy.
```javascript
for (i = 0; i < result.length; i++) {         
    if(result[i]["osname"].toLowerCase().includes("windows")){no_windows++}
    else if(result[i]["osname"].toLowerCase().includes("linux")){no_linux++}
    else{no_others_pc++}
    }
```
### Podliczenie wyników systemu operacyjnego klasy Mobile z bazy.
```javascript
for (i = 0; i < result.length; i++) {         
    if(result[i]["osname_mobile"].toLowerCase().includes("android")){no_android++}
    else if(result[i]["osname_mobile"].toLowerCase().includes("ios")){no_ios++}
    else{no_others_mobile++}
    }
```
### Podliczenie wyników wybranej przeglądarki z bazy.
```javascript
for (i = 0; i < result.length; i++) {       
    if(result[i]["browsername"].toLowerCase().includes("chrome")){no_chrome++}
    else if(result[i]["browsername"].toLowerCase().includes("firefox")){no_firefox++}
    else if(result[i]["browsername"].toLowerCase().includes("opera")){no_opera++}
    else{no_others_browsers++}
    }
```
### Inicjalizacja zmiennych 
```javascript
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
```
### Strona zwracana klientowi wraz ze wszystkimi danymi z bazy. 
```javascript
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
```
### Uruchomienie aplikacji na podanym porcie.
```javascript
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3002) 
```
