DROP TABLE IF EXISTS pos.product_category;
DROP TABLE IF EXISTS pos.unit_type;
DROP TABLE IF EXISTS pos.product;
DROP TABLE IF EXISTS pos.product_batch;


CREATE TABLE IF NOT EXISTS unit_type (
    unit_symbol VARCHAR(10) PRIMARY KEY,     -- e.g., 'kg', 'm', 'pcs'
    description VARCHAR(100)
);


CREATE TABLE IF NOT EXISTS product_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INT NULL, -- self-referencing column
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_parent_category
        FOREIGN KEY (parent_category_id)
        REFERENCES product_category(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    category_id INT,
    brand VARCHAR(100),
    description TEXT,
    unit_symbol VARCHAR(10) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_unit
        FOREIGN KEY (unit_symbol)
        REFERENCES defaultdb.unit_type(unit_symbol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES defaultdb.product_category(category_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS admin_user (
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,     -- store hashed password ideally
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS product_batch (
    batch_id VARCHAR(30) PRIMARY KEY,
    product_id INT NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    quantity_received FLOAT DEFAULT 0,
    quantity_sold FLOAT DEFAULT 0,
    purchase_date DATE NULL DEFAULT NULL,
    expiry_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_batch_product
        FOREIGN KEY (product_id)
        REFERENCES defaultdb.product(product_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);