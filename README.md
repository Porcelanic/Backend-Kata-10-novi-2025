# Backend Kata - Sistema de Gestión de Aprobaciones

> **Prueba Técnica** - Backend serverless desplegado en AWS con arquitectura de microservicios

Este proyecto fue desarrollado como parte de una prueba técnica para demostrar habilidades en desarrollo backend, infraestructura como código (IaC) y deployment en la nube.

---

## Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración Local](#-instalación-y-configuración-local)
- [Deployment en AWS](#-deployment-en-aws)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)

---

## Descripción

Sistema de gestión de solicitudes (acceso y despliegue) con autenticación de usuarios, notificaciones por email y auditoría de cambios. El backend está construido con **TypeScript**, utiliza **TypeORM** para la gestión de base de datos PostgreSQL, y está desplegado en **AWS Lambda** con **API Gateway** como punto de entrada.

### Funcionalidades Principales:

- **Autenticación y Autorización** de usuarios (registro/login con bcrypt)
- **Gestión de Solicitudes** (creación, actualización, consulta)
- **Notificaciones por Email** (SendGrid) a aprobadores y solicitantes
- **Auditoría (Histórico)** de cambios en solicitudes
- **Arquitectura Serverless** en AWS (Lambda + API Gateway + RDS)
- **Infraestructura como Código** (Terraform)

---

## Tecnologías

### Backend

- **Node.js** 18.x
- **TypeScript** 5.2
- **Express.js** - Framework web
- **TypeORM** 0.3.17 - ORM para PostgreSQL
- **Bcrypt.js** - Encriptación de contraseñas
- **SendGrid** - Servicio de envío de emails
- **serverless-http** - Adaptador para ejecutar Express en Lambda

### Base de Datos

- **PostgreSQL** 17.4 (RDS en AWS)

### Infraestructura (AWS)

- **Lambda Functions** - Compute serverless (5 funciones)
- **API Gateway HTTP** - Punto de entrada REST
- **RDS PostgreSQL** - Base de datos relacional
- **VPC** - Red privada virtual
- **NAT Gateway** - Salida a internet para Lambdas
- **CloudWatch** - Logs y monitoreo
- **IAM** - Gestión de permisos

### DevOps

- **Terraform** 1.6+ - Infraestructura como código
- **GitHub Actions** - CI/CD pipeline
- **AWS CLI** - Gestión de recursos AWS

## Requisitos Previos

### Para desarrollo local:

- **Node.js** >= 18.x
- **npm** o **yarn**
- **PostgreSQL** >= 14.x (local o remoto)
- **Git**

### Para deployment en AWS:

- **Cuenta de AWS**
- **AWS CLI** configurado
- **Terraform** >= 1.6
- **SendGrid API Key** (para emails)

---

## Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Porcelanic/Backend-Kata-10-novi-2025.git
cd Backend-Kata-10-novi-2025
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend_kata
DB_USER=postgres
DB_PASSWORD=tu_password

# SendGrid (opcional para desarrollo local)
SENDGRID_API_KEY=tu_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@tudominio.com
```

### 4. Configurar base de datos PostgreSQL

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE backend_kata;
\q
```

**TypeORM** creará automáticamente las tablas al iniciar la aplicación (con `synchronize: true`).

### 5. Compilar TypeScript

```bash
npm run build
```

### 6. Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 7. Probar la API

```bash
# Health check
curl http://localhost:3000/usuario

# Registrar usuario
curl -X POST http://localhost:3000/usuario/register \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@example.com",
    "nombre": "Test User",
    "password": "password123",
    "centro_costo": "CC001",
    "area": "TI",
    "rol": "Solicitante"
  }'
```

---

## Deployment en AWS

### 1. Configurar AWS CLI

```bash
aws configure
# Ingresa: Access Key, Secret Key, Region (us-east-1)
```

### 2. Configurar variables de Terraform

Edita `terraform/terraform.tfvars`:

```hcl
aws_region         = "us-east-1"
project_name       = "backend-kata"
db_username        = "admin"
db_password        = "YourSecurePassword123!"
sendgrid_api_key   = "SG.xxxxxxxxxxxxx"
sendgrid_from_email = "noreply@yourdomain.com"
```

### 3. Inicializar Terraform

```bash
cd terraform
terraform init
```

### 4. Configurar Remote State (S3 + DynamoDB)

```bash
# Ejecutar script de setup
chmod +x setup-remote-state.sh
./setup-remote-state.sh
```

### 5. Desplegar infraestructura

```bash
terraform plan
terraform apply
```

Esto creará:

- VPC con subnets privadas
- 5 Lambda Functions
- API Gateway
- RDS PostgreSQL
- NAT Gateway
- Security Groups
- IAM Roles

### 6. Obtener URL del API Gateway

```bash
terraform output api_gateway_url
```

### 7. GitHub Actions (CI/CD)

El proyecto incluye un workflow de GitHub Actions que automáticamente:

1. Instala dependencias
2. Compila TypeScript
3. Empaqueta las Lambdas
4. Ejecuta `terraform apply`

Configura estos secrets en GitHub:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

## Notas de la Prueba Técnica

Este proyecto fue desarrollado para demostrar:

1. **Arquitectura Serverless** - Uso de AWS Lambda y API Gateway
2. **Infraestructura como Código** - Terraform para gestión de infraestructura
3. **Buenas Prácticas** - Separación de responsabilidades, DTOs, repositorios
4. **Seguridad** - VPC privada, encriptación de contraseñas, variables sensibles
5. **DevOps** - CI/CD con GitHub Actions, remote state en S3
6. **Integración de Servicios** - SendGrid para notificaciones por email
7. **TypeScript** - Tipado fuerte y código mantenible

---

## Autor

**MGONZ85**

- GitHub: [@Porcelanic](https://github.com/Porcelanic)

---

## Licencia

ISC

---

## Agradecimientos

Desarrollado como parte de la Kata técnica del 10 de noviembre de 2025.
