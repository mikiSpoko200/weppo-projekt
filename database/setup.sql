-- skrypt tworzący bazę danych.

create type gender as enum ('kobieta', 'mężczyzna');


create table if not exists users (
    id serial primary key,
    name varchar(20) not null,
    surname varchar(40),
    email text unique not null,
    phone_number char(9),
    password text not null,
    city varchar(20) not null,
    post_code char(6) not null,
    street text not null,
    house_number varchar(10) not null,
    local_number int not null
);

--     'horror', 'akcja', 'przygodowy', 'komedia romantyczna', 'animowany', 'fantazy', 'historyczny',
--     'science fiction','thriller', 'western', 'prześmiewczy', 'cyberpunk', 'gangsterski', 'indie'

create table if not exists genres (
    id serial primary key,
    genre varchar(30)
);


create table if not exists directors (
    id serial primary key,
    name varchar(20) not null,
    surname varchar(40) not null
);


create table if not exists movies (
    id serial primary key,
    title text not null,
    director_id integer not null references directors (id),
    runtime interval,
    release_year date not null,
    price decimal not null,
    image text,
    description text
);


create table if not exists movies_genres (
    id serial primary key,
    movie_id integer not null references movies (id),
    genre_id integer not null references genres (id)
);


create table if not exists orders (
    id serial primary key,
    is_active bool not null,
    user_id integer not null references users (id),
    creation_date timestamp default now() not null,
    total decimal not null
);


create table if not exists tapes (
    id serial primary key,
    movie_id integer not null references movies (id)
);


create table if not exists admins (
    id serial primary key,
    name varchar(20) not null,
    surname varchar(40) not null,
    email text not null unique,
    password text not null
);
