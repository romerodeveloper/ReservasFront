# README

## Descripción

Este proyecto es una aplicación React para gestionar reservas en un sistema. Permite visualizar, añadir, actualizar y eliminar reservas. También incluye funcionalidades para filtrar las reservas por nombre de persona, rango de fechas y servicio.

## Tecnologías Utilizadas

- **React**: Librería para construir interfaces de usuario.
- **Axios**: Biblioteca para realizar solicitudes HTTP.
- **React-Bootstrap**: Biblioteca de componentes Bootstrap para React.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes elementos:

- [Node.js](https://nodejs.org/) (que incluye npm)
- [React](https://reactjs.org/)
- [Bootstrap](https://getbootstrap.com/)

## Instalación

1. **Clona el repositorio** o descarga el código fuente del proyecto.

2. **Navega a la carpeta del proyecto usando cmd**.

3. **Instala las dependencias del proyecto**.

    ```bash
    npm install
    ```

## Librerías Necesarias

Asegúrate de que las siguientes librerías estén en el archivo `package.json` de tu proyecto. Si no están, puedes instalarlas con npm:

- `axios`: Para realizar solicitudes HTTP.
- `react-bootstrap`: Para utilizar los componentes de Bootstrap en React.

Instala estas librerías usando los siguientes comandos:

```bash
npm install axios react-bootstrap bootstrap
```

## Configuración

Asegúrate de que el backend está ejecutándose en `http://localhost:8080` y que proporciona los endpoints necesarios para las reservas, servicios y personas.

## Ejecución del Proyecto

Para iniciar la aplicación en modo desarrollo, utiliza el siguiente comando:

```bash
npm start
```
## Estructura del Código

- **`App.js`**: Componente principal que maneja la visualización y gestión de reservas.

  - **`useState`**: Maneja el estado para reservas, servicios, personas, modales, mensajes de error y éxito, y filtros.
  - **`useEffect`**: Realiza las solicitudes iniciales para obtener datos de reservas, servicios y personas.
  - **`handleShowUpdateModal`**: Muestra el modal para actualizar una reserva.
  - **`handleCloseModal`**: Cierra los modales y limpia los estados relacionados.
  - **`handleInputChange`**: Maneja los cambios en los campos de entrada.
  - **`handleUpdateReserva`**: Actualiza una reserva existente.
  - **`handleDeleteReserva`**: Elimina una reserva.
  - **`handleAddReserva`**: Añade una nueva reserva.
  - **`handleFilterChange`**: Maneja los cambios en los filtros para las reservas.
  - **`filteredReservas`**: Filtra las reservas según los criterios seleccionados.
