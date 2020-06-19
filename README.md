# Informacje o Aplikacji 
Aplikacja dziala w oparciu o nodejs oraz mongodb.

Aplikacja sklada sie z dwoch programow
* dodaj_ankiete
* pokaz_wyniki

# Uruchomienie 
## Uruchomienie aplikacji dodaj_ankiete
bedac w folderze z aplikacja dodaj_ankiete nalezy uruchomic poprzez 
```
node app.js
```
aplikacja dziala na localhost:3000
## aplikacja pokaz_ankiety
bedac w folderze z aplikacja pokaz_ankiety nalezy uruchomic poprzez 
```
node app.js
```
aplikacja dziala na localhost:3000

# Dzialanie aplikacji
w ankiecie klient podaje:
1. odpowiedz
2. swoj email
3. haslo
po wcisnieciu submit wykonuja sie ponizsze akcje:
1. weryfikowany jest podany email - sprawdzenie czy email znajduje sie juz w bazie, jezeli nie, zostaje dodany do bazy "unique_emails". Jezeli email jest juz w bazie dalsze dzialania zostaja wstrzymane. 
2. tworzony jest SHA256 hash stringa 'odpowiedz'+'haslo'='odpowiedzhaslo', checksum jest zwracany klientowi i sluzy do sprawdzenia przez klienta poprawnosci udzielonej odpowiedzi. 
3. odpowiedz wraz z wygenerowanym checksum umieszczana zostaje w bazie. 

sprawdzenie poprawnosci odpowiedzi przez klienta. 
1. klient podaje swoj secrete_id - w aplikacji pokaz_wynik
2. zostaje zwrocona odpowiedz wraz z hashem. 
3. w celu weryfikacji klient wykonuje checksum256 na stringu, ktory jest kombinacja odpowiedzi oraz hasla. 