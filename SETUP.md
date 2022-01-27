# Wymagania

1. Node.js dodane do zmiennej systemowej `path`

# TypeScript

1. Instalacja TypeScript:

Najwygodniej zainstalować TypeScript jako pakiet globalny dla całego npm - flaga `-g`:

```console
npm install -g typescript
```

Teraz sprawdź czy zadziałało poprzez

```console
tsc --version
```

2. Przenawiguj do docelowego folderu projektu

3. W docelowym folderze projektu zainicjuj nowy pakiet TypeScript'u:

```console
tsc --init
```

To powinno stworzyć plik `tsconfig.json`.

4. W docelowym folderze projektu zainicjuj nowy pakiet `npm`:

```console
npm init -y
```

To powinno stworzyć plik `package.json`.

5. Konfiguracja `package.json`:

Aby móc korzystać ze składni

```js
import * as foo from 'foo';
```

Do `package.json` trzeba dodać:

```json
"type": "commonjs"
```

Dodatkowo trzeba dodać nazwę głównego pliku wykonywalnego - klucz "main".

```json
"main": "index.js",
```

Oraz skonfigurować skrypt uruchamiający nasz program

```json
"scripts": {
  "start": "node .",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```

**UWAGA**, index.js to nazwa głównego pliku.

6. Instalacja pakietów do pracy z Express'em:


```
npm i --save express
npm i --save ejs
npm i --save cookie-parser
...

//Każdy pakiet ma swój odpowiednik @types/ - to dane dla typescript'a

npm i --save-dev @types/express
npm i --save-dev @types/ejs
npm i --save-dev @types/cookie-parser
...
```
