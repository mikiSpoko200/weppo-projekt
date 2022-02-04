/**
 * This file defines session datastructures.
 * 
 * ISession - interface that defines shared state and functionality amongst session stored objects.
 * User    - data structure that contains casual user session data.
 * Admin   - data structure that contains admin session data.
 */


import {Cart} from "./routes/cart";


/**
 * Interface that defines common shared state for session objects.
 */
interface ISession {
    readonly id: string;
    readonly name: string;
    readonly surname: string;
}


/**
 * Data structure that contains casual user session data.
 */
export class User implements ISession {
    constructor(id: string, name: string, surname: string, cart: Cart) {
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


/**
 * Data structure that contains admin session data.
 */
export class Admin implements ISession {
    constructor(id: string, name: string, surname: string) {
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    readonly name: string;
    readonly surname: string;
    readonly id: string;
}

