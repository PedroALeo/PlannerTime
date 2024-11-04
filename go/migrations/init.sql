create table if not exists users (
	user_id bigserial primary key not null,
	username varchar(255) unique not null,
	password varchar(255) not null
);

create table if not exists events (
	event_id bigserial not null,
	start_timestamp timestamp not null,
	end_timestamp timestamp not null,
	description varchar(255),
	user_id BIGINT NOT NULL,
	constraint event_fk_user_id foreign key (user_id) references users(user_id)
);

create table if not exists restrictions (
	restriction_id bigserial not null,
	description varchar(255),
	crontab varchar(255),
	user_id BIGINT NOT NULL,
	constraint restriction_fk_user_id foreign key (user_id) references users(user_id)
);
