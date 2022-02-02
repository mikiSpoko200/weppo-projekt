import { Request, Response } from 'express';
import pg from 'pg';
import bcrypt from "bcrypt";

// database connection
export const pool = new pg.Pool({
    host: 'localhost',
    database: 'shop',
    user: 'postgres',
    password: 'password'
});


const SALT_ROUNDS = 14;


/**
 * GET request handler.
 * @param req {Request<{}, {}, RegistrationForm>} - request object that uses RegistrationForm object as body.
 * @param res {Response} - server's response.
 */
export function get_handler(req: Request, res: Response) {
    res.render('register');
}


/**
 * Data structure representing the contents of submitted user registration form.
 */
class RegistrationForm {
    constructor(
        name: string, surname: string, email: string,
        password: string, password_repeat: string,
        phone_number: string, city: string,
        post_code: string, street: string,
        house_number: string, local_number: string)
    {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.password_repeat = password_repeat;
        this.phone_number = phone_number;
        this.city = city;
        this.post_code = post_code;
        this.street = street;
        this.house_number = house_number;
        this.local_number = local_number;
    }

    name: string;
    surname: string;
    email: string;
    password: string;
    password_repeat: string;
    phone_number: string;
    city: string;
    post_code: string;
    street: string;
    house_number: string;
    local_number: string;
}


/**
 * post request handler.
 * This function performs number of checks before creating the account:
 *     1. Check if email is not already in use.
 *     2. Check if two versions of password match each other.
 * Once these steps are complete it creates new user.
 * @param registration_form {RegistrationForm} - data passed from registration form.
 * @return
  */
async function async_post_handler(registration_form: RegistrationForm): Promise<{ message: string, status: string } | null> {
    try {
        // check if given email is already registered.
        const result = await pool.query(
            "select email from users where email like $1",
            [registration_form.email]
        );
        const is_free = result.rows.length === 0;
        if (is_free) {
            if (registration_form.password === registration_form.password_repeat) {
                const password_hash = await bcrypt.hash(registration_form.password, SALT_ROUNDS);
                await pool.query(
                    "insert into users values (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                    [
                        registration_form.name,
                        registration_form.surname,
                        registration_form.email,
                        registration_form.phone_number,
                        password_hash,
                        registration_form.city,
                        registration_form.post_code,
                        registration_form.street,
                        registration_form.house_number,
                        registration_form.local_number
                    ]
                );
                return { message: 'Konto zostało pomyślnie założone', status: 'success' };
            } else { // incorrectly repeated password
                return { message: 'Błędnie powtórzone hasło', status: 'error' };
            }
        } else { // email already taken.
            return { message: 'Wskazany aders email jest już powiązany z kontem', status: 'error' };
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}


/**
 * A synchronous wrapper around main async handler.
 * @param req {Request<{}, {}, RegistrationForm>} - request object that uses RegistrationForm object as body.
 * @param res {Response} - server's response.
 */
export function post_handler(req: Request<{}, {}, RegistrationForm>, res: Response) {
    const registration_form = req.body;
    async_post_handler(registration_form).then(message_obj => {
        console.log(message_obj);
        if (message_obj !== null) {
            res.render('register', message_obj);
        } else {
            res.render('register');
        }
    })
}
