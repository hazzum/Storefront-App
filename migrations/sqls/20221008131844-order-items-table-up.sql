CREATE TABLE IF NOT EXISTS order_items (
	id SERIAL PRIMARY KEY,
	quantity INT NOT NULL,
    order_id BIGINT REFERENCES orders(id),
	product_id BIGINT REFERENCES products(id),
	UNIQUE(order_id, product_id)
);