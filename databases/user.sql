\c Bus_Booking

CREATE TABLE USERS(
  user_id serial primary key;
	user_name varchar(30)  not null;
	email varchar(50) unique not null;
	password_hash varchar(30) not null;
	created_at timestamp default now();	
)