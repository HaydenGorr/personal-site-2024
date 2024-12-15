-- MySQL Database Initialization Script

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Image Folders Table
CREATE TABLE image_folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Image Categories Table
CREATE TABLE image_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Images Table
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    full_url VARCHAR(500) NOT NULL UNIQUE,
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category_id INT,
    folder_id INT,
    FOREIGN KEY (category_id) REFERENCES image_categories(id),
    FOREIGN KEY (folder_id) REFERENCES image_folders(id)
);
CREATE INDEX idx_category_id ON images(category_id);
CREATE INDEX idx_folder_id ON images(folder_id);

-- Articles Table
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    info_text TEXT,
    views INT DEFAULT 0,
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ready BOOLEAN DEFAULT FALSE,
    portfolio_ready BOOLEAN DEFAULT FALSE,
    type VARCHAR(50) DEFAULT 'misc.',
    image VARCHAR(255) DEFAULT '',
    article TEXT NOT NULL -- Removed the DEFAULT '' here
);

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    submit_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Chips Table
CREATE TABLE chips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    submit_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Article Chips Table
CREATE TABLE article_chips (
    article_id INT,
    chip_id INT,
    PRIMARY KEY (article_id, chip_id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (chip_id) REFERENCES chips(id)
);
CREATE INDEX idx_article_id ON article_chips(article_id);
CREATE INDEX idx_chip_id ON article_chips(chip_id);

-- MDX Table
CREATE TABLE mdx (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    full_url VARCHAR(500) NOT NULL UNIQUE,
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);