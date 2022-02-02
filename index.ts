import * as express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';
import * as login from './routes/login';
import { get_items } from './routes/browse';
import * as register from './routes/register';
import * as multer from 'multer';
import pg from "pg";


const upload = multer.default();
const app = express.default();
const SIGNATURE = '64655bbc4bc11794cc67c300beaba73ab4ea957e6e2b3d1430bce3480fdf3dc997a1f174abe8fa4ce5986588e2013c6d5ae046937557e12e491783f1343e7d5c';

// default app configuration.
const enum AppConfig {
    ViewEngine = 'view engine',
    ViewDirectory = 'views',
    Port = 8080,
}

app.set(AppConfig.ViewEngine, 'ejs');
app.set(AppConfig.ViewDirectory, './views');

app.use(express.static('./static'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SIGNATURE,
    cookie: { maxAge: 1000 * 60 * 60, secure: false }
}));
app.use(express.static('public'));

declare module 'express-session' {
    interface SessionData {
        user?: login.User;
        admin?: login.Admin;
    }
}

/*
 * TODO: 28.01.2020:
 *  =--------------- EJS i baza
 *  3. Wybieranie produktu podczas przeglądania.
 *  =-------------- Bezpieczne hasła
 *  6. logowanie zarówno użytkownik jak i admin
 *  7. rejestrowanie zarówno użytkownik, admina rejestrujemy my albo coś.
 */

/*
* TODO:
*  - koszyk
*  - wybieranie produktu
*  - autentykacja użytkownika
*  - podział na obsługę żądań POST/GET w routingu
*  - bazka - uwaga hasła musza być hashowane przed dodaniem (patrz wykład 10)
* */




// region routing: /
app.get('/', (req: Request, res: Response) => {
    console.log('homepage!!');
    res.render('index');
});
// endregion


// region routing: /browse/
app.get('/browse', (req: Request, res: Response) => {
    get_items(req.query.search).then(items => {
        res.render('browse', {query_results: items});
    })
});
// endregion


// region routing: /login/
app.get('/login', login.get_handler);

app.post('/login', login.post_handler);
// endregion


// region routing: /cart/
app.get('/cart', (req: Request, res: Response) => {
    res.render('cart', req.session?.user?.cart.product_ids);
});

// database connection
export const pool = new pg.Pool({
    host: 'localhost',
    database: 'shop',
    user: 'postgres',
    password: 'password'
});

app.post('/cart/load_products', upload.any(), (req, res) => {
    pool.query('select * from movies').then(result => {
        let formatted_results = result.rows.map(row => `${row.title}, ${row.price}`);
        res.end(`<div>${formatted_results.join('\n')}</div>`);
    })
});

// endregion


// region routing: /register/
app.get('/register', register.get_handler);


app.post('/register', register.post_handler);
// endregion


// region routing: /product/
app.use('/product', (req: Request, res: Response) => {
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
