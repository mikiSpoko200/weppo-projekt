import * as express from 'express';
import {Request, Response} from 'express';
import session from 'express-session';
import {User, Cart} from "./routes/login";
import {get_items} from "./routes/browse";
import pg from 'pg';


const pool = new pg.Pool({
    host: "localhost",
    database: "lista8",
    user: "postgres",
    password: "foo"
});


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
app.use(session({resave: true, saveUninitialized: true, secret: SIGNATURE}));
app.use(express.static('public'));


declare global {
    namespace Express {
        interface Session {
            user: User
        }
    }
}

/*
 * TODO: 28.01.2020:
 *  =--------------- EJS i baza
 *  2. Podpinanie bazki - wyświetlanie produktów, filtrowanie - rosnąco/malejąco względem X, po gatunkach, czy dostępne, tytuł, reżyser, kraj produkcji.
 *  3. Wybieranie produktu podczas przeglądania.
 *  =-------------- Bezpieczne hasła
 *  6. logowanie zarówno użytkownik jak i admin
 *  7. rejestrowanie zarówno użytkownik, admina rejestrujemy my albo coś.
 */

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


// async function get_user(email: string): Promise<User> {         // Zakomentowałem bo mi coś tutaj wywalało
//     try {
//         let query_result = await pool.query('select (surname, email, password) from users');
//         let user = query_result.rows[0];
//         let cart = new Cart();
//         return new Promise(User(user.email, user.password, cart));
//     } catch (err) {
//         console.log(err);
//     }
// }


// region routing: /
app.get('/', (req: Request, res: Response) => {
    console.log('homepage!!');
    res.render('index');
});
// endregion


// region routing: /browse/
app.get('/browse/', (req: Request, res: Response) => {
    get_items(req.query.search).then(items => {
        res.render('browse', {query_results: items});
    })
});
// endregion


// region routing: /login/
app.get('/login', (req: Request, res: Response) => {
    console.log('login');
    if (!req.session!.user) {
        console.log("No session data found.");
    } else {
        console.log("Session data found");
        console.log(`${!req.session?.user.email}, ${!req.session?.user.password}`);
    }
    res.render('login', {email: req.session?.user?.email, password: req.session?.user?.password});
});

app.post('/login', (req: Request, res: Response) => {
    console.log(req.body)
    req.session!.user!.email = req.body.email;
    req.session!.user!.password = req.body.password;
    console.log(`Posted: ${req.session?.user?.email}, ${req.session?.user?.password}`);
    res.redirect('browse')
});
// endregion


// region routing: /cart/
app.get('/cart/', (req: Request, res: Response) => {
    res.render('cart', req.session?.user?.cart.products);
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
