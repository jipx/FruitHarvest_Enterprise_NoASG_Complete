INSERT IGNORE INTO roles(role_name) VALUES
('ADMIN'),('CUSTOMER'),('WAREHOUSE'),('REVIEWER'),('MANAGER');

INSERT IGNORE INTO users(email, full_name, status) VALUES
('admin@fruitharvest.com','FruitHarvest Admin','ACTIVE'),
('reviewer@fruitharvest.com','AI Review Officer','ACTIVE');

INSERT IGNORE INTO categories(category_name, description) VALUES
('Fruits','Fresh fruits'),
('Vegetables','Fresh vegetables'),
('Drinks','Juices and beverages'),
('Frozen Food','Frozen items');

INSERT IGNORE INTO customers(customer_code, customer_name, email, phone, customer_type) VALUES
('CUST001','John Tan','john@example.com','91234567','RETAIL'),
('CUST002','Mary Lim','mary@example.com','92345678','RETAIL'),
('CUST003','Sunrise Cafe','orders@sunrisecafe.sg','63451234','BUSINESS');

INSERT IGNORE INTO warehouses(warehouse_code, warehouse_name, address) VALUES
('WH-SG-01','Singapore Main Warehouse','Tuas, Singapore'),
('WH-SG-02','Jurong Fresh Warehouse','Jurong, Singapore');

INSERT IGNORE INTO products(sku, product_name, description, category_id, unit_price, uom) VALUES
('APPLE001','Red Apple','Fresh red apples',1,3.20,'KG'),
('ORANGE001','Orange','Sweet oranges',1,2.80,'KG'),
('BANANA001','Banana','Fresh bananas',1,2.50,'KG'),
('MANGO001','Mango','Premium mangoes',1,5.50,'KG'),
('CARROT001','Carrot','Fresh carrots',2,1.90,'KG'),
('JUICE001','Apple Juice','Bottled apple juice',3,4.20,'BTL');

INSERT IGNORE INTO inventory(warehouse_id, product_id, available_qty, reserved_qty, damaged_qty)
SELECT 1, product_id, 1000, 0, 0 FROM products;

INSERT IGNORE INTO orders(order_number, customer_id, order_channel, order_status, total_amount) VALUES
('FH-DEMO-1001',1,'WEBSITE','DELIVERED',32.00),
('FH-DEMO-1002',2,'WHATSAPP','PENDING_REVIEW',0.00),
('FH-DEMO-1003',3,'MANUAL','PACKED',280.00);

INSERT IGNORE INTO order_items(order_id, product_id, quantity, unit_price, subtotal)
SELECT o.order_id, p.product_id, 10, p.unit_price, 10*p.unit_price
FROM orders o, products p
WHERE o.order_number='FH-DEMO-1001' AND p.sku='APPLE001';

INSERT IGNORE INTO ai_order_reviews(order_id, original_message, extracted_json, confidence_score, review_status)
SELECT order_id,
       'Need 200 apples and 50 oranges tomorrow',
       JSON_OBJECT('items', JSON_ARRAY(JSON_OBJECT('sku','APPLE001','qty',200), JSON_OBJECT('sku','ORANGE001','qty',50))),
       82.50,
       'PENDING_REVIEW'
FROM orders WHERE order_number='FH-DEMO-1002';

INSERT INTO audit_logs(action, entity_type, entity_id, details)
VALUES ('SEED_DATA_CREATED','SYSTEM',0,JSON_OBJECT('source','001_seed_data.sql'));
