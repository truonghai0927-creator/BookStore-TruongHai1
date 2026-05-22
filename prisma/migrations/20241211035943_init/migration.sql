-- CreateTable
CREATE TABLE uthors (
    id INTEGER NOT NULL AUTO_INCREMENT,
    
ame VARCHAR(100) NOT NULL,
    gender BOOLEAN NULL,
    irth_year SMALLINT NULL,
    death_year SMALLINT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE ook_authors (
    ook_id INTEGER NOT NULL,
    uthor_id INTEGER NOT NULL,

    PRIMARY KEY (ook_id, uthor_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE ooks (
    id INTEGER NOT NULL AUTO_INCREMENT,
    	itle VARCHAR(100) NOT NULL,
    	ype ENUM('Magazine', 'Novel', 'Life', 'Arts', 'Comics', 'Education & Reference', 'Humanities & Social Sciences', 'Science & Technology', 'Kids', 'Sports') NOT NULL,
    published_at DATETIME(0) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0.0,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE order_items (
    id INTEGER NOT NULL AUTO_INCREMENT,
    order_id INTEGER NOT NULL,
    ook_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(15, 2) NOT NULL,

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE orders (
    id INTEGER NOT NULL AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    ddress TEXT NULL,
    	otal_price DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    created_at DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE atings (
    ook_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score TINYINT NOT NULL,
    ated_at DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX uniq_book_user_idx(ook_id, user_id),
    PRIMARY KEY (ook_id, user_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    
ame VARCHAR(100) NULL,
    alance DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    
ickname VARCHAR(100) NULL,
    created_at DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX 
ickname(
ickname),
    UNIQUE INDEX email(email),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX orders_book_id_idx ON orders(id);

-- AddForeignKey
ALTER TABLE ook_authors ADD CONSTRAINT ook_authors_book_id_fkey FOREIGN KEY (ook_id) REFERENCES ooks(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE ook_authors ADD CONSTRAINT ook_authors_author_id_fkey FOREIGN KEY (uthor_id) REFERENCES uthors(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_book_id_fkey FOREIGN KEY (ook_id) REFERENCES ooks(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE atings ADD CONSTRAINT atings_book_id_fkey FOREIGN KEY (ook_id) REFERENCES ooks(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE atings ADD CONSTRAINT atings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE;
