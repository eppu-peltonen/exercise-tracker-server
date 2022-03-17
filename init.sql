create table users (
  id serial primary key,
  username varchar(50) not null,
  fname varchar(50) not null,
  lname varchar(50) not null,
  passwordhash varchar(50) not null
);

create table exercises (
  id serial primary key,
  user_id integer references users (id),
  sport varchar(50) not null,
  start_time timestamp without time zone not null,
  duration interval not null,
  distance numeric(5,1),
  avg_hr int
);
