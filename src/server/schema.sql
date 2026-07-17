-- ============================================
-- StockAdmin - Esquema de Base de Datos
-- PostgreSQL
-- ============================================

-- Eliminar tablas si existen (en orden inverso de dependencias)
DROP TABLE IF EXISTS movements CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: categories
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: products
-- ============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    status VARCHAR(10) NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: movements
-- ============================================
CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('ENTRADA', 'SALIDA')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    observation TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_movements_product ON movements(product_id);
CREATE INDEX idx_movements_user ON movements(user_id);
CREATE INDEX idx_movements_type ON movements(type);
CREATE INDEX idx_movements_created ON movements(created_at);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- DATOS INICIALES (SEED)
-- ============================================

-- Usuarios
INSERT INTO users (nombre, email, password, role) VALUES 
('Administrador', 'admin@admin.com', '123456', 'admin'),
('Usuario', 'user@user.com', '123456', 'user');

-- Categorías
INSERT INTO categories (code, name) VALUES 
('C001', 'Tecnología'),
('C002', 'Accesorios');

-- Productos
INSERT INTO products (code, name, description, price, stock, min_stock, category_id, status) VALUES 
('P001', 'Mouse Gamer', 'Mouse gamer con RGB y 12000 DPI', 80.00, 10, 3, 1, 'Activo'),
('P002', 'Teclado Mecánico', 'Teclado mecánico switches Blue', 150.00, 5, 2, 1, 'Activo');
