import pg from "pg";


const pool = new pg.Pool({
    host: "localhost",
    database: "lista8",
    user: "postgres",
    password: "password"
});


type Password = string;
type Email = string;


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
    constructor(id: string, name: string, surname: string, cart: Cart, ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.cart = cart;
    }

    cart: Cart;
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

/** Query database for user login and password.
 * @param email {string} email associated with the account.
 */
export async function user_login_data(email: string): Promise<[User, Password] | null> {
    try {
        let query_result = await pool.query(
            "select (id, name, surname, password) from users where email like '$1'", [email]
        );
        if (query_result.rows.length == 1) {
            let user_data = query_result.rows[0];
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

/** Query database for admin login and password.
 * @param email {string} email associated with the account.
 */
export async function admin_login_data(email: string): Promise<[Admin, Password] | null> {
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
