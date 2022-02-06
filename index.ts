
// npm imports
import * as express from 'express';
import { Request, Response } from 'express';
import session from 'express-session';
import * as multer from 'multer';
import pg from "pg";

// internal imports.
import { get_items } from './routes/browse';
import * as login from './routes/login';
import * as register from './routes/register';
import * as admin_login from './routes/admin/login';
import * as session_data from './session';
import * as browse from './routes/browse';


const upload = multer.default();
const app = express.default();
const SIGNATURE = '64655bbc4bc11794cc67c300beaba73ab4ea957e6e2b3d1430bce3480fdf3dc997a1f174abe8fa4ce5986588e2013c6d5ae046937557e12e491783f1343e7d5c';

// database connection
export const pool = new pg.Pool({
    host: 'localhost',
    database: 'shop',
    user: 'postgres',
    password: 'password'
});

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
        user: session_data.User | null
        admin: session_data.Admin | null
    }
}

/*
 * TODO: 28.01.2020:
 *  =--------------- EJS i baza
 *  3. Wybieranie produktu podczas przeglądania.
*  - koszyk
*  - wybieranie produktu
* */




// region routing: /
app.get('/', (req: Request, res: Response) => {
    console.log('homepage!!');
    res.render('index');
});
// endregion


// (req: Request, res: Response) => {
//     get_items(req.query.search).then(items => {
//         res.render('browse', {query_results: items});
//     })
// }
// (req: Request, res: Response) => {
//     console.log('produkt został dodany.');
// }

// region routing: /browse
app.get('/browse', browse.get_handler);

app.get('/browse', browse.post_handler);
// endregion


// region routing: /login
app.get('/login', login.get_handler);

app.post('/login', login.post_handler);
// endregion


// region routing: /cart
app.get('/cart', (req: Request, res: Response) => {
    res.render('cart', req.session?.user?.cart.product_ids);
});

async function TEMP_LOAD_PROD(req: Request, res: Response) {
    // @ts-ignore
    await Promise.all(req.session!.user.cart.product_ids.forEach(async product_id => {
        let selected_movies = await pool.query(
            'select movies.* from movies join tapes t on movies.id = t.movie_id where t.id = $1',
            [product_id]
        );
        let formatted_results = selected_movies.rows.map(row => `${row.title}, ${row.price}`);
        res.end(`<div>${formatted_results.join('\n')}</div>`);
    }));
}


app.post('/cart/load_products', upload.any(), (req, res) => {
    TEMP_LOAD_PROD
});
// endregion


// region routing: /register
app.get('/register', register.get_handler);


app.post('/register', register.post_handler);
// endregion


// region routing: /product
app.use('/product', (req: Request, res: Response) => {
    res.render('product', {product_id: 1234321});
});
// endregion


// region /admin/login
app.get('/admin/login', admin_login.get_handler);

app.post('/admin/login', admin_login.post_handler);
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
