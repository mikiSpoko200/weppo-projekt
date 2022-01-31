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

/*
 *  Model expects to receive { message: Optional[string], status: Optional[string] } for more details please see register.ejs
 */
const SALT_ROUNDS = 73;


async function register_user(form: RegistrationForm) {

}


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

export function get_handler(req: Request, res: Response) {
    res.render('register');
}


export async function post_handler(req: Request<{}, {}, RegistrationForm>, res: Response) {
    const registration_form = req.body;
    try {
        let query_result = await pool.query(
            "select email from users where email like '$1'",
            [registration_form.email]
        );
        const is_free = query_result.rows.length === 0;
        if (is_free) {
            if (registration_form.password === registration_form.password_repeat) {

                const password_hash = bcrypt.hash(registration_form.password, SALT_ROUNDS);

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

                res.render('register', {message: 'Konto zostało pomyślnie założone', status: 'success'});

            } else { // incorrectly repeated password
                res.render('register', {message: 'Błędnie powtórzone hasło', status: 'error'});
            }
        } else { // email already taken.
            res.render('register', {message: 'Wskazany aders email jest już powiązany z kontem', status: 'error'});
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
    res.end();
}
