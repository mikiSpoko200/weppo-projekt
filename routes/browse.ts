/* TODO: TUTAJ proszem traszaonć mnie zapytania do bazki o:
 *  - jako parametr strony tj. w pasku adresowym, będziemy przekazywać number strony, na której jesteśmy.
 *    ilośc przedmiotów do wyświetenia per strona to np. max 30. Więc na strognie o numerze n wypisujemy
 *    wyniki zapytania od n * 30 do n * 31
 *    piszesz funkcję, która będzie przekazana jako callback dla app.get('/browse/, ... )
 *    jej zadaniem jest przekazanie do app.redner('browse', {  <kolekcja produktów do wyświetlenia np lista>   })
 *    parametry zaptrania pobierasz z paska adresowaego za pomocą req.querry - możliwe, że będzie potrzebny jakiś pakiet
 *    patrz notatki wykład 9. Poll.query('asdasdasd $1, $2, $3', v1, v2, v3)
 *    możemy zrobić sortowanie po np wszystkich filmach gatunku X, cenie rosnąco malejąco ASCENDING / DESCENDING,
 *    Przydatne elementy składni w sql'u LIMIT X, TAKE X, SKIP X, ORDER BY <pole>, ASCENDING, DESCENDING.
 *    nie no będzie sztonks
 */

const pg = require('pg');

export async function get_items(options: any) {
    const pool = new pg.Pool({
        host: 'localhost',
        database: 'shop',
        user: 'postgres',
        password: 'password'
    });
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
            console.log(":)");

            result.rows.forEach((r: { title: string; price: number; description: string; image: string; }) => {
                items.push([r.title, r.description, r.image])
            });
        }
        return items;
    } catch (err) {
        console.log(err);
    }
}