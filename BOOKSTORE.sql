USE master 
GO
IF DB_ID('QLSACH') IS NOT NULL 
	DROP DATABASE QLSACH 
GO
CREATE DATABASE QLSACH
GO
---------------------
USE QLSACH 
GO

create table KhachHang 
(
	MaKH NVARCHAR(5),
	TenKH nvarchar(100), 
	Email NVARCHAR(100), 
	SDT NVARCHAR(11),
	DiaChi NVARCHAR(100),
	Pass NVARCHAR(100)
	PRIMARY KEY (MaKH)
)

create table SanPham 
(
	MaSP NVARCHAR(5),
	TenSP nvarchar(100), 	 
	LoaiSP NVARCHAR(100),
	Gia INT,
	LinkAnh NVARCHAR(200),
	NgayThem DATE

	PRIMARY KEY (MaSP)
)
create table DonHang 
(
	MaDH NVARCHAR(7),
	MaKH NVARCHAR(5),
	SDT NVARCHAR(11),
	DiaChi NVARCHAR(100),
	NgayMua DATE,
	TongTien INT

	PRIMARY KEY (MaDH)
)

create table GioHang
(
	MaKH NVARCHAR(5),
	MaSP NVARCHAR(5),
	SoLuong INT

	PRIMARY KEY(MaKH, MaSP)
)

alter table GioHang add
	constraint FK_GioHang_KhachHang foreign key (MaKH) references KhachHang (MaKH),
	constraint FK_GioHang_SanPham foreign key (MaSP) references SanPham (MaSP)

alter table DonHang add 
	constraint FK_DonHang_KhachHang foreign key (MaKH) references KhachHang (MaKH)

----------------
----------------
insert into SanPham values ('0001',N'Grammar in use',N'Education',78000,N'https://salt.tikicdn.com/cache/200x200/ts/product/b8/a8/f2/fae1d1cc2b27276ddc4d7f68888df668.jpg.webp','2022-01-05')
insert into SanPham values ('0002',N'Hacker history',N'IT',88000,N'https://salt.tikicdn.com/cache/200x200/ts/product/a9/23/d7/7d8612e8ba7e475a5cbab2c6cae7dcc6.jpg.webp','2022-08-05')
insert into SanPham values ('0003',N'Is life really boring?',N'Psychology',55000,N'https://salt.tikicdn.com/cache/200x200/ts/product/0b/78/57/9717a495221c9c1dcb265fb8c7cad9e0.jpg.webp','2022-08-05')
insert into SanPham values ('0004',N'Self-discipline',N'Psychology',67000,N'https://salt.tikicdn.com/cache/200x200/ts/product/27/2e/63/308986aa2c17293af227162874ad24a3.jpg.webp','2022-08-05')
insert into SanPham values ('0005',N'What`s hot in the IT?',N'IT',37000,N'https://salt.tikicdn.com/cache/200x200/ts/product/6e/6f/e0/40d33719f67c9df7ea34d2bac9e52320.jpg.webp','2022-08-05')
insert into SanPham values ('0006',N'11 word murder',N'Detective',47000,N'https://salt.tikicdn.com/cache/200x200/ts/product/32/2e/b7/fcd82c276d5e2a662ccadc1fb7e26cb4.jpg.webp','2022-08-05')
insert into SanPham values ('0007',N'Series of murders A.B.C',N'Detective', 40000, N'https://salt.tikicdn.com/cache/200x200/ts/product/87/34/f1/d5b17076b139e8c04fe6bb854c9269d4.jpg.webp','2022-04-03')
insert into SanPham values ('0008',N'Bach Da Hanh',N'Detective', 53000, N'https://salt.tikicdn.com/cache/200x200/ts/product/80/67/af/753a66ef25086f469826f3ee4716f751.jpg.webp','2022-04-03')
insert into SanPham values ('0009',N'Murder in the Halloween',N'Detective', 44000, N'https://salt.tikicdn.com/cache/200x200/ts/product/9c/6e/78/912ee8654cfb2ceac5a35414126d790b.jpg.webp','2022-04-03')


