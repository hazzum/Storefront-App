CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	user_name VARCHAR(100),
	password_digest VARCHAR,
	UNIQUE(user_name)
);