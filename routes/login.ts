import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Cart } from './cart';
import { User } from '../session';
import { Password } from "../local_types";
import { pool } from '../index';


/** Query database for user login and password.
 * @param email {string} email associated with the account.
 */
async function retrieve_user_login_data(email: string): Promise<[User, Password] | null> {
    try {
        let query_result = await pool.query(
            "select id, name, surname, password from users where email like $1", [email]
        );
        if (query_result.rows.length == 1) {
            let user_data: { id: string, name: string, surname: string, password: Password } = query_result.rows[0];
            let cart = new Cart();
            return [new User(user_data.id, user_data.name, user_data.surname, cart), user_data.password];
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}


// region request handlers
/**
 * GET request handler for login. It checks if User session is established,
 * if so notifies the user and server login page.
 * @param req: { Request }: get request that may have session established
 * @param res: { Response }: logging page.
 */
export function get_handler(req: Request, res: Response) {
    if (req.session) {
        console.log('SOME session data found.');
        if (req.session.user) {
            res.render('login', { message: "Jesteś już zalogowany/(a).", status: "info"});
        } else {
            console.log('No USER session data found.');
            res.render('login');
        }
    } else {
        console.log('Default - no user session.');
        res.render('login');
    }
}


// Login form contents
type LoginForm = { email: string, password: Password };


// Login attempt's outcome contents.
type message_obj = { message: string, status: string };

/**
 * Post request handler for /login route. It retrieves user login information, validates them and establishes session by
 * assigning the user object.
 * @param req { Request<{}, {}, LoginForm> }: request with filled login form.
 */
export async function async_post_handler(req: Request<{}, {}, LoginForm>): Promise<message_obj | null> {
    const query_result = await retrieve_user_login_data(req.body.email);
    if (query_result === null) {
        return { message: 'Podany adres email nie jest zarejestrowany', status: 'error' };
    } else {
        const [user, password] = query_result;
        const is_received_correct = await bcrypt.compare(req.body.password, password);
        if (is_received_correct) {
            console.log("sesja założona.");
            req.session.user = user;
            req.session.admin = null;
            return { message: "Logowanie zakończone skucesem", status: "success"};
        } else {
            return { message: "Niepoprawne hasło", status: "error" };
        }
    }
}

/**
 * Synchronous wrapper for proper asynchronous handler.
 * @param req { Request<{}, {}, LoginForm> }: request with filled login form.
 * @param res { Response }: server's response.
 */
export function post_handler(req: Request<{}, {}, LoginForm>, res: Response) {
    async_post_handler(req).then(message_obj => {
        if (message_obj !== null) {
            res.render('login', message_obj);
        } else {
            res.render('login');
        }
    })
}
// endregion
