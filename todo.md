# TODO

## 1. Rejestracja
- HTML można zabrać z loginu i dodać odpowiednie pola które będzie zhard codowane - Mikołaj:
- logika tworzenia nowego konta:
  * użyjmy modułu bcrypt, pewnie `npm i --save bcrypt`?
  * próba stowrznia konta na mailu powiązanego z już istniejącym kontem powinna zwrócić błąd i powiadomić użytkownika - można to zaimplementować poprzez np parametr modelu message patrz notatki.
  * jeśli email jest wolny to postaraj się dodać do bazy, jeśli baza będzie miała jakiś problem z danymi to poproś o ponowne wprowdzenie danych.
  
