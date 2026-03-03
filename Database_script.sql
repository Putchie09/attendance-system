
CREATE DATABASE IF NOT EXISTS `attendance_system`;
USE `attendance_system`;

-- ======================
-- TABLE: role
-- ======================

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL
);


-- ======================
-- TABLE: app_user
-- ======================

CREATE TABLE app_user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    pin_hash VARCHAR(255) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_app_user_role
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_app_user_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES app_user(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


-- ======================
-- TABLE: attendance
-- ======================

CREATE TABLE attendance (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    app_user_id INT UNSIGNED NOT NULL,
    type ENUM('IN','OUT') NOT NULL,
    recorded_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    updated_by INT UNSIGNED NULL,

    CONSTRAINT fk_attendance_user
        FOREIGN KEY (app_user_id)
        REFERENCES app_user(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_attendance_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES app_user(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


CREATE TABLE app_theme (
    id INT PRIMARY KEY AUTO_INCREMENT,
    theme VARCHAR(20) NOT NULL DEFAULT 'purple'
);

-- ======================
-- INDEXES
-- ======================

CREATE INDEX idx_attendance_user ON attendance(app_user_id);
CREATE INDEX idx_attendance_recorded_at ON attendance(recorded_at);



-- ======================
-- Default Data
-- ======================
INSERT INTO app_theme (theme) VALUES ('purple');

INSERT INTO role (name, created_at) VALUES
('Admin', NOW()),
('Employee', NOW());