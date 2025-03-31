CREATE TABLE IF NOT EXISTS users (
	user_id BIGSERIAL PRIMARY KEY NOT NULL,
	username VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	bio TEXT,
	email VARCHAR(255) UNIQUE NOT NULL,
	phone_numbers VARCHAR(255),
	language_preferences VARCHAR(100),
	profile_picture TEXT
);

create table if not exists events (
	event_id bigserial not null,
	duration integer not null,
	end_timestamp timestamp not null,
	priority integer,
	user_email VARCHAR(255) NOT NULL,
	constraint event_fk_user_id foreign key (user_email) references users(email)
);

create table if not exists restrictions (
	restriction_id bigserial not null,
	name varchar(255),
	day varchar(255),
	start integer,
	end integer,
	user_id BIGINT NOT NULL,
	constraint restriction_fk_user_id foreign key (user_id) references users(user_id)
);
