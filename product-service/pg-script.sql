--create extension if not exists "uuid-ossp"

--create table products (
--	id uuid primary key default uuid_generate_v4(),
--	title text not null,
--	description text,
--	price int
--)

--create table stocks (
--	id uuid primary key default uuid_generate_v4(),
--	product_id uuid,
--	count int,
--	foreign key ("product_id") references "products" ("id"),
--	unique ("product_id")
--)

--insert into products (title, description, price) values
--('ProductOne', 'Short Product Description1', 2.4),
--('ProductNew', 'Short Product Description3', 10),
--('ProductTop', 'Short Product Description2', 23),
--('ProductTitle', 'Short Product Description7', 15),
--('Product', 'Short Product Description2', 23),
--('ProductTest', 'Short Product Description4', 15),
--('ProductName', 'Short Product Description1', 44)

--insert into stocks (product_id, count) values
--('21b66b3c-c59c-4ab4-879f-116d9637d61c', 4),
--('5d9558fe-47cf-4750-8d46-83a9b4d4c934', 6),
--('6e45177e-b41b-40f8-88a5-d81d77c4a2a3', 7),
--('79b7d01d-8811-452d-8f0c-4d5695018c7f', 12),
--('46224c6c-ef02-47b5-a854-4a521bf8f79e', 7),
--('9c972550-16ad-4984-bd0e-33e9d5a2a6d0', 8),
--('2910567d-63d0-4dae-b108-ca4fad72145a', 3)

--drop table stocks

--select p.id, p.description, p.price, p.title, s.count from products p left join stocks s on p.id=s.product_id