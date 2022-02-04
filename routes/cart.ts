import { Request, Response } from "express";
import { pool } from '../index';


/**
 * Model of the shopping cart stored in the user session.
 */
export class Cart {
    constructor() {
        this.product_ids = [];
    }

    add_item(product_id: string) {
        this.product_ids.push(product_id);
    }

    remove_item(product_id: string) {
        this.product_ids.filter(product => product != product_id);
    }

    product_ids: string[]
}


// region request handlers

export async function async_get_hanlder(req: Request, res: Response) {
    if (req.session.user) {
        let picked_products: any[] = [];
        for (let product of req.session.user.cart.product_ids) {
             const product_data = await pool.query('select ');
             picked_products.push(product_data);
        }
        res.render('cart', {  })
    } else {
        res.render('cart', {message: 'Musisz być zalogowanym, żeby móc używać koszyka', status: 'info'});
    }
}


// endregion