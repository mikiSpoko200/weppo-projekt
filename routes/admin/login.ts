import { Admin } from "../../session";
import { Password } from "../../local_types";
import { pool } from "../../index";
import {Request, Response} from "express";
import bcrypt from "bcrypt";


/**
 * Query database for admin login and password.
 * @param email { Password } email associated with the account.
 */
async function retrieve_admin_login_data(email: string): Promise<[Admin, Password] | null> {
    try {
        let query_result = await pool.query(
            "select id, name, surname, password from admins where email like $1", [email]
        );
        if (query_result.rows.length == 1) {
            let admin_data: { id: string, name: string, surname: string, password: Password } = query_result.rows[0];
            return [new Admin(admin_data.id, admin_data.name, admin_data.surname), admin_data.password];
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}


// region request handlers
export function get_handler(req: Request, res: Response) {
    if (req.session) {
        if (req.session.admin) {
            res.render('admin/login', { message: "Jesteś już zalogowany/(a).", status: "info"});
        } else {
            res.render('admin/login');
        }
    } else {
        console.log('Default - no admin session.');
        res.render('admin/login');
    }
}


// Login form contents
type LoginForm = { email: string, password: Password };


// Login attempt's outcome contents.
type message_obj = { message: string, status: string };

/**
 * Post request handler for /admin/login route. It retrieves admin login information, validates them and establishes session by
 * assigning the admin object.
 * @param req { Request<{}, {}, LoginForm> }: request with filled login form.
 */
export async function async_post_handler(req: Request<{}, {}, LoginForm>): Promise<message_obj | null> {
    const query_result = await retrieve_admin_login_data(req.body.email);
    if (query_result === null) {
        return { message: 'Podany adres email nie jest zarejestrowany', status: 'error' };
    } else {
        const [admin, password] = query_result;
        const is_received_correct = await bcrypt.compare(req.body.password, password);
        if (is_received_correct) {
            req.session.admin = admin;
            req.session.user  = null;
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
            res.render('admin/login', message_obj);
        } else {
            res.render('admin/login');
        }
    })
}
// endregion
