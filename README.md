<div align="center">

<img src="./TaskBar/src/assets/icon.png" alt="TaskBar Logo" width="150" />

# TaskBar

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo_SDK-54-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge" />
</p>

</div>

---

## ¿Qué es TaskBar?

**TaskBar** es una aplicación móvil para la gestión de tareas personales, desarrollada con **React Native, Expo y TypeScript**.

Permite crear, editar, eliminar y marcar tareas como completadas, asignar prioridades y fechas límite, utilizar filtros y visualizar las tareas mediante un calendario.

La aplicación cuenta con autenticación de usuarios mediante **Firebase Authentication**, almacenamiento remoto con **Cloud Firestore** y almacenamiento local mediante **SQLite**, permitiendo utilizar las principales funciones de la aplicación incluso sin conexión a Internet.

Cuando la conexión vuelve a estar disponible, las tareas pendientes se sincronizan con Firebase.

También incluye personalización de perfil, foto de usuario, modo oscuro y configuración del tamaño de texto.

---

# 1. Características principales

- Registro e inicio de sesión de usuarios.
- Gestión completa de tareas (CRUD).
- Prioridades alta, media y baja.
- Fechas límite para las tareas.
- Calendario para consultar tareas por fecha.
- Filtros por prioridad y estado.
- Modo oscuro y modo claro.
- Configuración del tamaño de texto.
- Edición del nombre de usuario.
- Foto de perfil mediante cámara o galería.
- Cambio de contraseña.
- Almacenamiento local con SQLite.
- Almacenamiento remoto con Firebase.
- Funcionamiento sin conexión.
- Sincronización automática al recuperar Internet.
- Arquitectura basada en Clean Architecture.

---

# 2. Comandos iniciales para levantar el proyecto

## 2.1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd TaskBar
```

## 2.2. Instalar las dependencias

```bash
npm install
```

## 2.3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

El archivo `.env` contiene la configuración utilizada por la aplicación y no debe incluirse en el repositorio.

## 2.4. Ejecutar el proyecto

### Red local

```bash
npx expo start
```

### Mediante túnel

```bash
npx expo start --tunnel
```

## 2.5. Abrir la aplicación

- Escanear el código QR mediante Expo Go.
- Presionar `a` para abrir Android si hay un emulador configurado.
- También puede ejecutarse mediante una build generada con EAS.

---

# 3. Arquitectura del proyecto

TaskBar utiliza una estructura basada en **Clean Architecture**, separando la aplicación en distintas responsabilidades.

```text
src/
├── app/
├── assets/
├── config/
├── core/
└── modules/
    ├── Auth/
    └── Tasks/
        ├── data/
        ├── di/
        ├── domain/
        └── presentation/
```

### Capas principales

| Carpeta | Función |
| :--- | :--- |
| `app/` | Rutas y navegación principal mediante Expo Router. |
| `assets/` | Imágenes, iconos y recursos utilizados por la aplicación. |
| `config/` | Configuración de Firebase, navegación y tema visual. |
| `core/` | Componentes, contextos, hooks, servicios y utilidades compartidas. |
| `modules/` | Módulos funcionales principales de la aplicación. |

Dentro del módulo de tareas:

| Capa | Función |
| :--- | :--- |
| `data/` | Acceso a SQLite, Firebase, DTOs, modelos e implementación de repositorios. |
| `domain/` | Entidades, interfaces de repositorios y casos de uso. |
| `presentation/` | Pantallas, componentes y hooks relacionados con la interfaz. |
| `di/` | Creación e inyección de las dependencias utilizadas por el módulo. |

---

# 4. Funcionamiento Offline

TaskBar utiliza una estrategia de almacenamiento local y remoto.

Las tareas se almacenan localmente mediante **SQLite**, permitiendo consultar y modificar información aunque el dispositivo no tenga conexión.

Cuando una operación todavía no ha sido enviada al servidor, la tarea mantiene un estado pendiente de sincronización.

```text
Usuario
   ↓
TaskBar
   ↓
SQLite
   ↓
Sincronización
   ↓
Firebase
```

Al recuperar la conexión a Internet, TaskBar intenta sincronizar automáticamente los cambios pendientes con Firebase.

Esto permite realizar operaciones como:

- Crear tareas sin Internet.
- Editar tareas sin Internet.
- Completar tareas sin Internet.
- Eliminar tareas sin Internet.
- Mantener los cambios después de cerrar y volver a abrir la aplicación.
- Sincronizar los cambios cuando la conexión vuelve a estar disponible.

---

# 5. Servicios utilizados

| Tecnología / Servicio | Uso |
| :--- | :--- |
| React Native | Desarrollo de la aplicación móvil. |
| Expo | Entorno y herramientas para desarrollo y compilación. |
| TypeScript | Tipado y organización del código. |
| Expo Router | Navegación entre pantallas y tabs. |
| Firebase Authentication | Registro, inicio de sesión y gestión de usuarios. |
| Cloud Firestore | Almacenamiento remoto de tareas. |
| Expo SQLite | Persistencia local de las tareas. |
| NetInfo | Detección del estado de conexión a Internet. |
| Cloudinary | Almacenamiento de las fotos de perfil. |
| react-native-calendars | Calendario y selección de fechas. |
| AsyncStorage | Persistencia utilizada por la autenticación y configuraciones locales. |
| Material Icons | Iconografía de la interfaz. |
| Safe Area Context | Adaptación de la interfaz a las áreas seguras del dispositivo. |

---

# 6. Pantallas principales

TaskBar cuenta con las siguientes pantallas:

**Autenticación**
- Inicio de sesión.
- Registro.

**Tareas**
- Lista de tareas.
- Crear tarea.
- Editar tarea.
- Filtros de tareas.

**Calendario**
- Selección de fecha.
- Visualización de las tareas correspondientes al día seleccionado.
- Identificación visual de prioridades.

**Ajustes**
- Cambio entre modo claro y oscuro.
- Configuración del tamaño del texto.
- Acceso a la cuenta del usuario.

**Cuenta**
- Edición del nombre.
- Cambio de foto de perfil.
- Cambio de contraseña.
- Cierre de sesión.

---

# 7. Sincronización de tareas

Las tareas pueden presentar diferentes estados internos dependiendo de su sincronización.

```text
Tarea creada/modificada
        ↓
     SQLite
        ↓
     Pending
        ↓
   Hay Internet
        ↓
     Firebase
        ↓
      Synced
```

De esta manera, SQLite funciona como almacenamiento local mientras Firebase permite mantener los datos asociados a cada usuario de forma remota.

---

# 8. Integrantes del grupo

| Integrante | Rol |
| :--- | :--- |
| Juan Espetia | Arquitectura, contexto, autenticación y sincronización |
| Isaac Gavidia | Calendario y formularios |
| Sebastian Arista | Componentes y pantalla de tareas |
| Milagros Lujan | Ajustes, tema e interfaz |

---

# 9. Plataformas

TaskBar fue desarrollada utilizando React Native y Expo para permitir compatibilidad multiplataforma.

- Android
- iOS

La aplicación puede ejecutarse durante el desarrollo mediante Expo Go y puede compilarse mediante EAS Build.
