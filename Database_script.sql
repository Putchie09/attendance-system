CREATE DATABASE IF NOT EXISTS `attendance_system`;

USE `attendance_system`;

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE INDEX idx_user_role_id ON user(role_id);

CREATE TABLE attendance_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    recorded_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    ip_address VARCHAR(45),
    CONSTRAINT fk_attendance_user
        FOREIGN KEY (user_id) REFERENCES user(id),
    CONSTRAINT fk_attendance_type
        FOREIGN KEY (type_id) REFERENCES attendance_type(id)
);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_type_id ON attendance(type_id);
CREATE INDEX idx_attendance_recorded_at ON attendance(recorded_at);
CREATE INDEX idx_attendance_user_recorded_at ON attendance(user_id, recorded_at);

/* 
##############################
    Insert default roles
##############################
*/

INSERT INTO role (name, created_at) VALUES
('Admin', NOW()),
('Employee', NOW());