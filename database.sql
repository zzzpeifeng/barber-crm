-- 理发店会员管理系统数据库脚本
CREATE DATABASE IF NOT EXISTS barber_crm DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE barber_crm;

CREATE TABLE merchant (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '商家名称',
    phone VARCHAR(20) COMMENT '商家电话',
    remark TEXT COMMENT '备注',
    login_account VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

CREATE TABLE shop (
    id INT PRIMARY KEY AUTO_INCREMENT,
    merchant_id INT NOT NULL COMMENT '所属商家ID',
    name VARCHAR(100) NOT NULL COMMENT '店铺名称',
    description TEXT COMMENT '店铺简介',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='店铺表';

CREATE TABLE store (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL COMMENT '所属店铺ID',
    name VARCHAR(100) NOT NULL COMMENT '门店名称',
    address VARCHAR(255) COMMENT '门店地址',
    phone VARCHAR(20) COMMENT '门店电话',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

CREATE TABLE member (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL COMMENT '所属店铺ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    phone VARCHAR(20) NOT NULL COMMENT '电话',
    address VARCHAR(255) COMMENT '地址（非必填）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE,
    UNIQUE KEY uk_member_phone_shop (shop_id, phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员表';

CREATE TABLE member_points_summary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL COMMENT '店铺ID',
    member_id INT NOT NULL COMMENT '会员ID',
    current_points INT NOT NULL DEFAULT 0 COMMENT '当前可用积分',
    total_earned INT NOT NULL DEFAULT 0 COMMENT '累计获得积分',
    total_used INT NOT NULL DEFAULT 0 COMMENT '累计消耗积分',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    UNIQUE KEY uk_summary_shop_member (shop_id, member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员积分总览表';

CREATE TABLE member_points_transaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL COMMENT '店铺ID',
    member_id INT NOT NULL COMMENT '会员ID',
    change_type ENUM('increase','decrease','reset') NOT NULL COMMENT '变更类型',
    points_change INT NOT NULL COMMENT '本次变更的积分值（正增负减）',
    reason VARCHAR(255) COMMENT '变更原因',
    operator_id INT NOT NULL COMMENT '操作人ID（merchant_user.id）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员积分变更明细表';

CREATE TABLE member_store_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL COMMENT '店铺ID',
    store_id INT NOT NULL COMMENT '门店ID',
    member_id INT NOT NULL COMMENT '会员ID',
    action_type ENUM('consume','visit') NOT NULL COMMENT '行为类型',
    points_change INT DEFAULT 0 COMMENT '本次行为的积分变化',
    remark VARCHAR(255) COMMENT '备注',
    operator_id INT NOT NULL COMMENT '操作人ID（merchant_user.id）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员门店关联日志表';

CREATE TABLE merchant_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    merchant_id INT NOT NULL COMMENT '所属商家ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    role ENUM('owner','manager','staff') NOT NULL COMMENT '角色',
    real_name VARCHAR(50) COMMENT '真实姓名',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家用户表';

CREATE TABLE admin_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    role ENUM('super_admin') NOT NULL DEFAULT 'super_admin' COMMENT '角色',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
    last_login_at DATETIME COMMENT '最近登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表（Super Admin）';

-- 插入测试数据
INSERT INTO admin_user (username, password_hash, real_name, role, status) VALUES 
('admin', '$2b$10$example_hash', '超级管理员', 'super_admin', 1);

INSERT INTO merchant (name, phone, remark, login_account, password_hash) VALUES 
('测试理发店品牌', '13800138000', '这是一个测试商家', 'test_merchant', '$2b$10$example_hash');

INSERT INTO merchant_user (merchant_id, username, password_hash, role, real_name, status) VALUES 
(1, 'merchant_owner', '$2b$10$example_hash', 'owner', '商家主账号', 1),
(1, 'merchant_staff', '$2b$10$example_hash', 'staff', '商家操作员', 1);

INSERT INTO shop (merchant_id, name, description) VALUES 
(1, '测试店铺一', '这是一个测试店铺');

INSERT INTO store (shop_id, name, address, phone) VALUES 
(1, '测试门店一', '北京市朝阳区测试路1号', '010-12345678'),
(1, '测试门店二', '北京市朝阳区测试路2号', '010-87654321');

INSERT INTO member (shop_id, name, phone, address) VALUES 
(1, '张三', '13900139000', '北京市朝阳区测试路1号'),
(1, '李四', '13900139001', '北京市朝阳区测试路2号');

INSERT INTO member_points_summary (shop_id, member_id, current_points, total_earned, total_used) VALUES 
(1, 1, 100, 100, 0),
(1, 2, 50, 50, 0);