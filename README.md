# Dokumentacja kodu źródłowego znajduje się w pliku dokumentacja.md
https://github.com/majka7244/PI_2020/blob/master/dokumentacja.md
# Informacje o Aplikacji 
Aplikacja działa w oparciu o nodejs oraz mongodb.

Aplikacja sklada sie z trzech programów
* dodaj_ankiete
* pokaz_wyniki
* sprawdz_wszystkie_wyniki

# Uruchomienie 
## Uruchomienie aplikacji dodaj_ankiete
Będąc w folderze dodaj_ankiete aplikację należy uruchomić za pomocą komendy: 
```
node app.js
```
aplikacja dziala na localhost:3000
## aplikacja pokaz_ankiety
Będąc w folderze pokaz_ankiety aplikację należy uruchomić za pomocą komendy:
```
node app.js
```
aplikacja dziala na localhost:3001
## aplikacja sprawdz_wszystkie_wyniki
Będąc w folderze sprawdz_wszystkie_wyniki aplikację należy uruchomić za pomocą komendy:
```
node app.js
```
aplikacja dziala na localhost:3002


# Dzialanie aplikacji
w ankiecie klient podaje:
1. Odpowiedź na używany system operacyjny klasy PC 
2. Odpowiedź na używany system operacyjny klasy Mobile
1. Odpowiedź na używaną przeglądarkę internetową
2. Swój e-mail
3. Hasło 
Po wcisnieciu Przycisku "submit" wykonują się poniższe akcje:
1. Weryfikacja podanego e-mail - sprawdzenie czy e-mail znajduje się już w bazie, jezeli nie, zostaje on dodany do bazy "unique_emails" i aplikacja wykonuje dalsze czynności związane z zapisem ankiety na bazie. W przypadku kiedy e-mail jest juz w bazie "unique_emails" dalsze działanie aplikacji zostaje wstrzymane, a użytkownik otrzymuje stosowną informację. 
2. Tworzony jest SHA256 hash z połączenia odpowiedzi 'odpowiedź_system_klasy_pc'+'odpowiedź_system_klasy_mobile'+'odpowiedź_przeglądarka_internetowa'+'hasło', checksum jest zwracany klientowi oraz przekazany do bazy razem z odpowiedziami. Posłuży on do sprawdzenia przez klienta aplikacji poprawności udzielonej odpowiedzi. 
3. ID ankiety, odpowiedzi oraz suma kontrolna zostaje umieszczona w bazie. 

sprawdzenie poprawnosci odpowiedzi przez klienta. 
1. Klient podaje ID ankiety oraz hasło w aplikacji pokaz_wynik
2. Aplikacja weryfikuje sumy kontrolne klienta. 
3. Gdy sumy są prawidłowe aplikacja zwraca  udzielone przez klienta odpowiedzi, w innym razie zwraca stosowną informację. 
