CREATE DATABASE DB_Alquileres;

go

use DB_Alquileres;

go

CREATE TABLE dbo.Propiedad
(
ID_Propiedad int not null primary key IDENTITY(1,1),
ID_Tipo int not null,
NumeroDeHabitaciones int not null,
Area varchar (128),
Direccion varchar (128),
Disponibilidad int not null,
foreign key (ID_Tipo) references dbo.Tipo(ID_Tipo)
);

CREATE TABLE dbo.Tipo
(
ID_Tipo int not null primary key,
Tipo varchar(20)
);

CREATE TABLE dbo.Especificacion
(
    ID_Especificacion int not null primary key,
    ID_Propiedad int not null,
    Descripcion varchar(128),
    Requisitos varchar(128),
    FOREIGN KEY (ID_Propiedad) references dbo.Propiedad(ID_Propiedad)
);


CREATE TABLE dbo.Inquilino
(
    ID_Inquilino int not null primary key IDENTITY(1,1),
    Nombre varchar(50) not null,
    Apellido varchar(50) not null,
    Telefono varchar(15),
    Email varchar(50),
    DPI int not null
);

CREATE TABLE dbo.Contrato
(
    ID_Contrato int not null primary key IDENTITY(1,1),
    ID_Propiedad int not null,
    ID_Inquilino int not null,
    FechaInicio date not null,
    FechaFin date not null,
    Estado varchar(20) not null,
    MontoFijado int not null,
    FOREIGN KEY (ID_Propiedad) references dbo.Propiedad(ID_Propiedad),
    FOREIGN KEY (ID_Inquilino) references dbo.Inquilino(ID_Inquilino)
);

CREATE TABLE dbo.Precio
(
    ID_Precio int not null primary key IDENTITY(1,1),
    ID_Propiedad int not null,
    Monto int not null,
    Deposito int not null,
    VigenciaInicio date not null,
    VigenciaHasta date not null,
    FOREIGN KEY (ID_Propiedad) references dbo.Propiedad(ID_Propiedad)
);

CREATE TABLE dbo.EstadoDeCuenta
(
    ID_EstadoDeCuenta int not null primary key IDENTITY(1,1),
    ID_Contrato int not null,
    FechaCorte date not null,
    MontoPagado int not null,
    MontoPendiente int not null,
    FOREIGN KEY (ID_Contrato) references dbo.Contrato(ID_Contrato)
);

CREATE TABLE Pago 
(
    ID_Pago int not null primary key IDENTITY(1,1),
    ID_Contrato int not null,
    FechaPago date not null,
    MontoPagado int not null,
    EstadoDePago varchar(20) not null,
    FOREIGN KEY (ID_Contrato) references dbo.Contrato(ID_Contrato)
);



CREATE TABLE dbo.Usuario
(
    ID_Usuario int not null primary key IDENTITY(1,1),
    NombreUsuario varchar(50) not null,
    Contrasena varchar(50) not null,
    Rol varchar(20) not null
);

CREATE TABLE dbo.Gasto
(
    ID_Gasto int not null primary key IDENTITY(1,1),
    TipoDeGasto varchar(128) not null,
    Monto int not null,
    FechaAsignacion date not null
);

CREATE TABLE dbo.AsignacionGasto 
(
    ID_Asignacion int not null primary key IDENTITY(1,1),
    ID_Gasto int not null,
    ID_Propiedad int not null,
    FechaAsignacion date not null,
    FOREIGN KEY (ID_Gasto) references dbo.Gasto(ID_Gasto),
    FOREIGN KEY (ID_Propiedad) references dbo.Propiedad(ID_Propiedad)
);


