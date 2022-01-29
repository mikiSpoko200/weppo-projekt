import { Request, Response } from 'express';
import * as crypto from 'crypto';


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


// Model for user session content.
export class User {
    constructor(email: string, password: string, cart: Cart, ) {
        this.email = email;
        this.password = password;
        this.cart = cart;
    }

    cart: Cart;
    email: string;
    password: string;
}
