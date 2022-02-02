import {Request} from "express";


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

function test(req: Request, res: Response) {
    req.body.getElementById()
}

// Model of a card
