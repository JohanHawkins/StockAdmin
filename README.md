# Sistema de Gestión de Inventario Web

## Estado Actual del Proyecto

Proyecto frontend desarrollado con Angular moderno (Standalone Components), enfocado en la creación de un sistema administrativo de inventario profesional para portafolio y aprendizaje.

---

# Tecnologías Utilizadas

## Frontend
- Angular 21
- TypeScript
- HTML5
- CSS3

---

# Arquitectura Actual

El proyecto utiliza:
- Angular Standalone Components
- Angular Router
- SPA (Single Page Application)
- Componentes reutilizables
- Navegación dinámica

---

# Estructura del Proyecto

```text
src/
 └── app/
      ├── dashboard/
      ├── layout/
      ├── login/
      ├── products/
      ├── app.config.ts
      ├── app.routes.ts
      ├── app.routes.server.ts
      ├── app.ts
      ├── app.html
      └── app.css
```

---

# Funcionalidades Implementadas

## 1. Login UI

Pantalla de inicio de sesión con:
- Input Email
- Input Contraseña
- Botón Ingresar

### Objetivo
Crear la primera interfaz del sistema y comprender la estructura básica de Angular.

---

## 2. Layout Administrativo

Se implementó:
- Sidebar lateral
- Navbar superior
- Área dinámica de contenido

### Objetivo
Crear una estructura reutilizable para todo el sistema administrativo.

---

## 3. Sidebar Navegable

Módulos actuales:
- Dashboard
- Productos
- Categorías
- Movimientos
- Usuarios

### Características
- Navegación SPA
- Cambio dinámico de contenido
- URL dinámica

---

# Sistema de Rutas

## Rutas implementadas

| Ruta | Pantalla |
|---|---|
| /dashboard | Dashboard |
| /products | Productos |

---

# Dashboard

Pantalla principal con:
- Total productos
- Productos con stock bajo
- Movimientos diarios

### Objetivo
Visualizar información general del sistema.

---

# Módulo Productos

## Funcionalidades actuales

### Tabla dinámica
Visualización de productos usando:
- Arrays
- *ngFor

### Datos mostrados
- Código
- Nombre
- Precio
- Stock
- Estado

---

# Modal Nuevo Producto

## Características
- Apertura dinámica
- Formulario funcional
- Inputs enlazados con ngModel
- Guardado dinámico en tabla

---

# CRUD Actual

## Implementado
- Create
- Read

## Pendiente
- Update
- Delete

---

# Conceptos Angular Aprendidos

## Componentes
- Standalone Components
- Reutilización

---

## Routing
- RouterModule
- routerLink
- router-outlet

---

## Directivas
- *ngFor
- *ngIf

---

## Forms
- FormsModule
- ngModel

---

# Diseño UI Actual

## Sidebar
- Menú lateral oscuro
- Navegación dinámica

---

## Navbar
- Barra superior administrativa

---

## Dashboard
- Cards informativas

---

## Productos
- Tabla moderna
- Modal emergente
- Diseño responsive básico

---

# Estado General del Proyecto

## Actualmente el sistema:
 Navega entre páginas  
 Usa Angular Router  
 Tiene estructura administrativa  
 Permite crear productos dinámicamente  
 Maneja estado básico frontend  
 Posee componentes organizados  

---

# Próximas Funcionalidades

## Corto plazo
- Editar productos
- Eliminar productos
- Categorías
- Movimientos inventario

---

## Mediano plazo
- Backend ASP.NET Core
- API REST
- PostgreSQL
- Autenticación JWT

---

## Largo plazo
- Roles de usuario
- Reportes
- Dashboard avanzado
- Exportación PDF/Excel

---

# Objetivo del Proyecto

Construir una aplicación:
- Profesional
- Escalable
- Moderna
- Presentable para GitHub
- Útil para portafolio laboral

---