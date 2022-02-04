import { pool } from '../index';
import { Request, Response } from "express";


export async function get_items(options: any) {
    try {
        let items: any[] = [];
        const result = await pool.query("select * from movies");
        if (options) {
            options = options.toLowerCase();
            result.rows.forEach((r: { title: string; price: number; description: string; image: string; }) => {
                if (r.description.toLowerCase().includes(options) || r.title.toLowerCase().includes(options))
                    items.push([r.title, r.description, r.image])
            });
        } else {
            result.rows.forEach((r: { title: string; price: number; description: string; image: string; }) => {
                items.push([r.title, r.description, r.image])
            });
        }
        return items;
    } catch (err) {
        console.log(err);
    }
}


type MovieData = {
    id: string,
    title: string,
    director_name: string,
    director_surname: string,
    genres: string[],
    tape_count: number
    image: string,
    price: number,
    description: string
};


type MovieDatabaseRecord = {
    id: string,
    title: string,
    director_id: string,
    price: number,
    image: string,
    description: string
}


async function get_movies(search_params: SearchParams): Promise<MovieDatabaseRecord[]> {
    let query_string;
    let movies_query;
    if (Object.keys(search_params).length !== 0 && search_params.title !== '') {
        console.log(search_params);
        movies_query = await pool.query(
            "select id, title, director_id, price, image, description from movies where title like $1",
            ['%' + search_params.title + '%']
        );
    } else if (Object.keys(search_params).length !== 0 && search_params.genre !== '') {
        query_string = `
        select movies.id, title, director_id, price, image, description from movies 
            join movies_genres mg on movies.id = mg.movie_id
            join genres g on mg.genre_id = g.id
            where genre like $1`;
        movies_query = await pool.query( query_string, ['%' + search_params.genre + '%'] );
    } else {
        movies_query = await pool.query(
        "select id, title, director_id, price, image, description from movies"
        );
    }
    // @ts-ignore
    return movies_query.rows.map(movie_row => {
        return {
            id: movie_row.id,
            title: movie_row.title,
            director_id: movie_row.director_id,
            price: movie_row.price,
            image: movie_row.image,
            description: movie_row.description
        }
    });
}


export async function get_full_content(search_params: SearchParams): Promise<MovieData[] | null> {
    try {
        const movies: MovieDatabaseRecord[] = await get_movies(search_params);

        let movie_genres: {[key: string]: {genres: string[]}} = {};
        let directors: {[key: string]: {name: string, surname: string }} = {};
        let tapes_in_stock: {[key: string]: {count: number}} = {};
        for (let movie_row of movies) {
            // get genres
            const movie_genre_query = await pool.query(`
                        select genre from genres
                            join movies_genres mg on genres.id = mg.genre_id
                            where mg.movie_id = $1`,
                [movie_row.id]
            );
            movie_genres[movie_row.id] = movie_genre_query.rows.reduce((prev, genre_row) => {
                prev.genres.push(genre_row.genre);
                return prev;
            }, {genres: []});

            // get director info
            const director_query = await pool.query(
                "select name, surname from directors where id = $1",
                [movie_row.director_id]
            );
            const [name, surname] = [director_query.rows[0].name, director_query.rows[0].surname];
            directors[movie_row.id] = { name: name, surname: surname };

            // get tape info
            const tapes_query = await pool.query(
                "select count(*) as count from tapes where movie_id = $1",
                [movie_row.id]
            );

            tapes_in_stock[movie_row.id] = tapes_query.rows[0].count;
        }

        return movies.map(movie_row => {
            return {
                id: movie_row.id,
                title: movie_row.title,
                director_name: directors[movie_row.id].name,
                director_surname: directors[movie_row.id].surname,
                genres: movie_genres[movie_row.id].genres,
                tape_count: tapes_in_stock[movie_row.id].count,
                image: movie_row.image,
                price: movie_row.price,
                description: movie_row.description,
            };
        });
    } catch (err) {
        console.log(err);
        return null;
    }
}


type SearchParams = {
    title?: string, genre?: string
}


// region request handlers
export function get_handler(req: Request<{}, {}, {}, SearchParams>, res: Response) {
    const search_params = req.query;
    get_full_content(search_params).then(movie_data => {
        if (movie_data) {
            res.render('browse', { movie_data: movie_data });
        }
    });
}


type PickedProduct = { movie_id: number };


type message_obj = { message: string, status: string };


async function async_post_handler(req: Request<{}, {}, PickedProduct>, res: Response): Promise<message_obj> {
    if (req.session) {
        if (req.session.user) {
            const movie_id = req.body.movie_id;

            const available_products_query = await pool.query('select count(*) as count from tapes where movie_id = $1', [movie_id]);
            const available_products = available_products_query.rows[0].count;
            if (available_products > 0) {
                const tape_query = await pool.query('select id from tapes where movie_id = $1', [movie_id]);
                req.session.user.cart.add_item(tape_query.rows[0].id);
                return { message: 'Dodano produkt do koszyka!', status: 'success'};
            }
            return { message: 'Produkt niedostępny.', status: 'error'};
        } else {
            return { message: 'Musisz być zalogowany/(a), żeby używać koszyka.', status: 'error'};
        }
    } else {
        console.log('Błąd sesji w post.browse');
        return { message: 'Coś poszło nie tak, spróbuj ponownie później.', status: 'error'};
    }
}


export function post_handler(req: Request<{}, {}, PickedProduct>, res: Response) {
    async_post_handler(req, res).then(message_obj => {
        res.render('browse', message_obj)
    });
}

// endregion