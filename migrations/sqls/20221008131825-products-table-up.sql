CREATE TABLE IF NOT EXISTS products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	url TEXT DEFAULT NULL,
	description TEXT DEFAULT NULL,
	price FLOAT(2) NOT NULL
);
