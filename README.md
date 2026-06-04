# Sistema de Gestión de Inventario Web

## Estado Actual del Proyecto

Frontend desarrollado con Angular 21 y componentes Standalone. El proyecto es un panel administrativo de inventario con navegación SPA y páginas para dashboard, productos y categorías.

---

# Tecnologías Utilizadas

## Frontend
- Angular 21
- TypeScript 5.9
- HTML5
- CSS3
- Angular Router
- Angular SSR (`@angular/ssr`)
- Express

---

# Arquitectura Actual

El proyecto utiliza:
- Angular Standalone Components
- Angular Router
- SPA con configuración SSR básica
- Componentes y servicios organizados
- Layout administrativo con sidebar y navbar
- Routing basado en `app.routes.ts`

---

# Estructura del Proyecto

```text
src/
 └── app/
      ├── dashboard/
      ├── layout/
      ├── login/
      ├── products/
      ├── categories/
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

- Componente de login presente con inputs para email y contraseña
- Botón Ingresar
- No está todavía expuesto mediante ruta ni es parte de la navegación principal

---

## 2. Layout Administrativo

Se implementó:
- Sidebar lateral con navegación
- Navbar superior
- Área dinámica de contenido con `router-outlet`

---

## 3. Sidebar Navegable

Elementos visibles:
- Dashboard
- Productos
- Categorías
- Movimientos (placeholder)
- Usuarios (placeholder)

### Características
- Navegación SPA real para Dashboard, Productos y Categorías
- Links de Movimientos y Usuarios aún no enlazados a rutas reales
- `routerLink` en los items activos

---

# Sistema de Rutas

## Rutas implementadas

| Ruta | Pantalla |
|---|---|
| / | Redirige a /dashboard |
| /dashboard | Dashboard |
| /products | Productos |
| /categories | Categorías |

---

# Dashboard

Pantalla principal del panel con:
- Cards informativas
- Resumen general del inventario

### Objetivo
Visualizar información general del sistema.

---

# Módulo Productos

## Funcionalidades actuales

- Tabla dinámica de productos
- Búsqueda y filtro con `searchTerm`
- Modal para crear y editar productos
- Formulario con validación básica
- Toasts de estado
- CRUD completo: Create, Read, Update, Delete

## Datos mostrados
- Código
- Nombre
- Precio
- Stock
- Estado

---

# Módulo Categorías

## Funcionalidades actuales

- Lista dinámica de categorías
- Búsqueda y filtro
- Modal para crear y editar categorías
- Toasts de estado
- CRUD completo: Create, Read, Update, Delete

---

# Conceptos Angular Aprendidos

## Componentes
- Standalone Components
- Reutilización de componentes

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
- Menú lateral administrativo

---

## Navbar
- Barra superior con título y usuario

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
- Navega entre páginas con Angular Router
- Usa layout administrativo
- Permite crear, editar y eliminar productos
- Permite crear, editar y eliminar categorías
- Incluye placeholders de Movimientos y Usuarios
- Está organizado con componentes y servicios
- Tiene configuración SSR básica

---

# Próximas Funcionalidades

## Corto plazo
- Exponer la pantalla de login y autenticación real
- Añadir rutas y contenido para Movimientos
- Añadir rutas y contenido para Usuarios
- Mejorar filtros y búsqueda

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