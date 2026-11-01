-- Shopwave's shop database: built to take one order at a time.
CREATE TABLE customers (
    customer_id  bigint PRIMARY KEY,
    country      char(2) NOT NULL,
    signup_date  date NOT NULL,
    email        text NOT NULL UNIQUE
);

CREATE TABLE products (
    product_id  bigint PRIMARY KEY,
    sku         text NOT NULL UNIQUE,
    name        text NOT NULL,
    brand       text NOT NULL,
    category    text NOT NULL,
    price       numeric(10, 2) NOT NULL
);

CREATE TABLE orders (
    order_id     bigint PRIMARY KEY,
    order_ts     timestamptz NOT NULL,
    customer_id  bigint NOT NULL REFERENCES customers,
    country      char(2) NOT NULL,
    status       text NOT NULL,
    total        numeric(12, 2) NOT NULL
);

CREATE TABLE order_items (
    order_id    bigint NOT NULL REFERENCES orders,
    line        int NOT NULL,
    product_id  bigint NOT NULL REFERENCES products,
    qty         int NOT NULL,
    unit_price  numeric(10, 2) NOT NULL,
    PRIMARY KEY (order_id, line)
);
