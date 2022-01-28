import * as express from 'express';
import { Request, Response } from 'express';

const app = express.default();

// default app configuration.
const enum AppConfig {
    ViewEngine = 'view engine',
    ViewDirectory = 'views',
    Port = 8080,
}

app.set(AppConfig.ViewEngine, 'ejs');
app.set(AppConfig.ViewDirectory, './views');

app.use(express.static('./static'));
app.use(express.urlencoded({extended:true}));

/*
* TODO:
*  - koszyk
*  - wybieranie produktu
*  - sesja - cookies
*  - autentykacja użytkownika
*  - kodowanie paska adresowego - parameter tampering
*  - podział na obsługę żądań POST/GET w routingu
*  - bazka - uwaga hasła musza być hashowane przed dodaniem (patrz wykład 10)
* */

// NOTE: wszystkie middle-ware, poza ostatnim, przyjmują 3-ci parametr: next: NextFunction

// region routing: /
app.get('/', (req: Request, res: Response) => {
    console.log('homepage!!');
    res.render('index');
});
// endregion


// region routing: /browse/
app.get('/browse/', (req: Request, res: Response) => {
    res.render('browse');
});
// endregion


// region routing: /login/
app.get('/login', (req: Request, res: Response) => {
    console.log('login');
    res.render('login');
});

app.post('/login', (req: Request, res: Response) => {
    console.log(req.body, "adawe a");
    res.render('login');
});
// endregion


// region routing: /cart/
app.get('/cart/', (req: Request, res: Response) => {
    res.render('cart');
});
// endregion


// region routing: /register/
app.get('/register/', (req: Request, res: Response) => {
    res.render('register');
});
// endregion


// region routing: /product/
app.use('/product/', (req: Request, res: Response) => {
    res.render('product', {product_id: 1234321});
});
// endregion


// region routing: 404
app.use((req: Request, res: Response) => {
    res.render('404.ejs', {url: req.url});
    //res.end('nie ma!');
});
// endregion


// start the Express server
app.listen(AppConfig.Port, () => {
    console.log(`server started at http://localhost:${AppConfig.Port}`);
});
