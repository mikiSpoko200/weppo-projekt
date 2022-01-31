import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import pg from 'pg';


// database connection
export const pool = new pg.Pool({
    host: 'localhost',
    database: 'shop',
    user: 'postgres',
    password: 'password'
});


const ASSUME_HTTPS = false;


// region Session data structures
type Password = string;


interface ILogged {
    readonly id: string;
    readonly name: string;
    readonly surname: string;
}

// Model of a card
export class Cart {
    products: string[] = [];

    add_item(product_id: string) {
        this.products.push(product_id);
    }

    remove_item(product_id: string) {
        this.products.filter(product => product != product_id);
    }
}

// representation of user account.
export class User implements ILogged {
    constructor(id: string, name: string, surname: string, email: string, password: string, cart: Cart) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.cart = cart;
    }

    cart: Cart;
    readonly email: string;
    readonly password: string;
    readonly name: string;
    readonly surname: string;
    readonly id: string;
}

// representation of admin account.
export class Admin implements ILogged {
    constructor(id: string, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    readonly name: string;
    readonly surname: string;
    readonly id: string;
}

// endregion

/** Query database for user login and password.
 * @param email {string} email associated with the account.
 */
async function user_login_data(email: string): Promise<User | null> {
    try {
        let query_result = await pool.query(
            "select (id, name, surname, password) from users where email like '$1'", [email]
        );
        if (query_result.rows.length == 1) {
            let user_data = query_result.rows[0];
            let cart = new Cart();
            return new User(user_data.id, user_data.name, user_data.surname, email, user_data.password, cart);
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

/** Query database for admin login and password.
 * @param email {string} email associated with the account.
 */
async function admin_login_data(email: string): Promise<[Admin, Password] | null> {
    try {
        let query_result = await pool.query(
            "select (id, name, surname, password) from admins where email like '$1'", [email]
        );
        if (query_result.rows.length == 1) {
            let admin_data = query_result.rows[0];
            return [new Admin(admin_data.id, admin_data.name, admin_data.surname), admin_data.password];
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}


export function get_handler(req: Request, res: Response) {
    /**
     *  1. If session is already established, fill the form with saved data else do not.
     *  FIXME: CREATE APPROPRIATE MODEL FOR THE VIEW.
     */
    if (req.session) {
        console.log('Session data found');
        res.render('login', {email: req.session.user!.email, password: req.session!.user!.password});
    } else {
        console.log('No session data found.');
    }
    res.render('login', {email: req.session!.user!.email, password: req.session!.user!.password});
}


class LoginForm {
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    readonly email: string;
    readonly password: string;
}


enum LoginStatus {
    UNRECOGNIZED_EMAIL,
    WRONG_PASSWORD,
    SUCCESS,
}


export async function post_handler(req: Request<{}, {}, LoginForm>, res: Response) {
    const user = await user_login_data(req.body.email);
    if (user === null) {
        res.render('login', { message: 'Podany adres email nie jest zarejestrowany', status: 'error'});
        return;
    }

    const is_received_correct = await bcrypt.compare(req.body.password, user.password);

    if (is_received_correct) {
        req.session.user = user;
        res.render('login', { message: "Logowanie zakończone skucesem", state: "success"});
        return;
    }

    res.render('login', { message: "Niepoprawne hasło", state: "error"});
}