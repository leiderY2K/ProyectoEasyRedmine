EasyRedmine MVP

MVP Full Stack para optimizar la imputación de tiempos mediante la Redmine REST API.

Este proyecto nace para resolver inconsistencias reales en la imputación de actividades, mejorando la integridad de los datos y la eficiencia operativa del equipo.

Objetivo
Evitar errores de imputación filtrando dinámicamente las actividades según el tipo de petición (tracker), antes de enviar la información al API de Redmine.

Arquitectura
Frontend
Angular
Standalone Components
Reactive Forms
FormArray dinámico
Angular Material
Filtrado reactivo dependiente del issue seleccionado

Backend
Node.js
Express
TypeScript
Axios

Arquitectura por capas:
Controllers
Services
Mappers

Funcionalidades Principales
Filtro dinámico de actividades basado en el tracker del issue
Validación previa antes de consumir Redmine API
Soporte para múltiples imputaciones dinámicas
Separación clara de responsabilidades

Flujo General
El usuario selecciona una petición (issue).
Se detecta su tracker.
Se filtran automáticamente las actividades permitidas.
Se valida la imputación.
Se envía al backend.
El backend transforma y consume la Redmine REST API.

Buenas Prácticas Aplicadas
Clean Architecture
Separation of Concerns
Strong Typing (TypeScript)
Código desacoplado y mantenible

Futuras Mejoras
Autenticación de usuarios
Tests unitarios
Dockerización
CI/CD
Cache de peticiones

Contribuciones
El proyecto está abierto a sugerencias y mejoras.
