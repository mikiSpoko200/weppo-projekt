insert into directors values (default, 'foo', 'bar');


insert into movies values 
    (default, 'Ed, Edd i Eddy',      1,interval '2h 32m 30s','2015-10-01',10,'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRVKvKdOgXSmyF4ex3LPZyvgJ76MNEcQWsZdiEU1i7bHntmLCCl','Serial opowiadający przygody trzech kumpli o dość podobnych imionach.'),
    (default, 'Ojciec Chrzestny',    1,interval '3h 3m 30s','2014-10-01',15,'https://fwcdn.pl/fpo/10/89/1089/7196615.3.jpg','Opowieść o nowojorskiej rodzinie mafijnej. Starzejący się Don Corleone pragnie przekazać władzę swojemu synowi.'),
    (default, 'Hugo',                1,interval '1h 32m 33s','2014-10-01',15,'https://ocdn.eu/pulscms-transforms/1/Lmyk9kpTURBXy8yMDk5YjdlYmFlODNiODNkNThkM2M3MjMwMjRhYjFjMS5wbmeSlQMAV80RSM0JuJMFzQMUzQG8gqEwAaExAA','Hugo wraca do polsatu'),
    (default, 'Buddy - pies na gole',1,interval '1h 3m 12s','2015-01-12',5,'https://fwcdn.pl/fpo/84/43/98443/7454159.3.jpg','Obejrzyj kolejne zwariowane przygody najbardziej wysportowanego psa wszech czasów! Był już mistrzem koszykówki, baseballu i siatkówki. Nadszedł czas na nowe wyzwanie! '),
    (default, 'Kevin sam w domu 4',  1,interval '2h 54m 30s','2015-01-01',10,'https://image.ceneostatic.pl/data/products/119742/i-kevin-sam-w-domu-4-home-alone-4-dvd.jpg','Po rozwodzie rodziców Kevin postanawia spędzić święta z ojcem w posiadłości, którą próbuje okraść włamywacz, Marv Merchant.'),
    (default, 'The Room',            1,interval '2h 32m 30s','2051-01-01',10,'https://fwcdn.pl/fpo/22/99/252299/7352428.3.jpg','Życie poczciwego bankiera zostaje wywrócone do góry nogami w momencie, gdy jego narzeczona zaczyna się spotykać z ich najlepszym przyjacielem.'),
    (default, 'Ciacho',              1,interval '2h 52m 10s','2015-01-01',15,'https://fwcdn.pl/fpo/35/35/533535/7309617.3.jpg','Kiedy policjantka zostaje wplątana w handel narkotykami, na ratunek ruszają jej bracia.'),
    (default, 'Fred: The movie',     1,interval '9h 37m 50s','2015-10-20',12,'https://m.media-amazon.com/images/I/811xTUbh46L.jpg','Fred jest zakochany w Judy i chce, żeby się w nim zakochała'),
    (default, 'Wyjazd Integracyjny', 1,interval '6h 33m 30s','2015-12-01',10,'https://fwcdn.pl/fpo/18/49/601849/7401401.3.jpg','Fajtłapowaty dyrektor korporacji Polish Lody zaprasza do hotelu wszystkich klientów i pracowników w celu zacieśnienia więzi zawodowych. Sytuacja wymyka się jednak spod kontroli.'),
    (default, 'Fred: Obóz obciachu', 1,interval '1h 52m 38s','2015-10-10',14,'https://images-na.ssl-images-amazon.com/images/I/91ce+pmn6RL._RI_.jpg','Zmuszony do uczestnictwa w obozie letnim nastolatek i jego nowi przyjaciele rywalizują z rywalami w serii gier.');


insert into genres values
    (default, 'horror'),
    (default, 'akcja'),
    (default, 'przygodowy'),
    (default, 'komedia romantyczna'),
    (default, 'animowany'),
    (default, 'fantazy'),
    (default, 'historyczny'),
    (default, 'science fiction'),
    (default, 'thriller'),
    (default, 'western'),
    (default, 'prześmiewczy'),
    (default, 'cyberpunk'),
    (default, 'gangsterski'),
    (default, 'indie');


insert into movies_genres values
    (default, 1, 5), (default, 1, 11),
    (default, 2, 13), (default, 2, 2),
    (default, 3, 3), (default, 3, 5), (default, 3, 6),
    (default, 4, 5), (default, 3, 7), (default, 3, 11),
    (default, 5, 3), (default, 3, 11), (default, 3, 14),
    (default, 6, 11), (default, 6, 14), (default, 6, 8),
    (default, 7, 4), (default, 7, 11),
    (default, 8, 1), (default, 8, 9), (default, 8, 12), (default, 8, 13),
    (default, 9, 8), (default, 9, 5), (default, 9, 1),
    (default, 10, 1), (default, 10, 9), (default, 10, 12);


-- add new director
insert into directors values (default, name, surname);


-- list available genres
select * from genres;


-- basic movie selection
select title, description, genre from movies
    join directors d on movies.director_id = d.id
    join movies_genres mg on movies.id = mg.movie_id
    join genres g on mg.genre_id = g.id
    join tapes t on movies.id = t.movie_id;

