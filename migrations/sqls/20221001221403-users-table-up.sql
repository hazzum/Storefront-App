CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	user_name VARCHAR(100) NOT NULL,
	password_digest VARCHAR NOT NULL,
	UNIQUE(user_name)
);