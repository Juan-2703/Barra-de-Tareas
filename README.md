<div align="center">

<img src="./TaskBar/src/assets/icon.png" alt="TaskBar Logo" width="150" />

# TaskBar

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo_SDK-54-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge" />
</p>

</div>

---

## ¿Qué es TaskBar?

**TaskBar** es una aplicación móvil para el registro, organización y seguimiento de tareas, desarrollada con **React Native, Expo y TypeScript**.

La aplicación permite crear, consultar, editar y eliminar tareas, además de asignar prioridades, fechas límite y estados. También incorpora filtros y un calendario que permite visualizar las actividades registradas de acuerdo con su fecha.

TaskBar utiliza **SQLite** como base de datos local, permitiendo acceder y realizar cambios sobre las tareas incluso cuando el dispositivo no dispone de conexión a Internet. Cuando se recupera la conectividad, los cambios pendientes se sincronizan con **Cloud Firestore**, manteniendo actualizada la información del usuario.

El acceso a la aplicación se gestiona mediante **Firebase Authentication**, mientras que la foto de perfil se almacena utilizando la **API REST de Cloudinary**. La aplicación también incluye opciones de personalización, como tema visual, tamaño del texto y visualización de estadísticas de las tareas.

---

# 1. Características principales

* Registro e inicio de sesión de usuarios.
* Gestión completa de tareas (CRUD).
* Estados de tarea: pendiente, en progreso y completada.
* Prioridades alta, media y baja.
* Asignación de fechas límite.
* Filtros por prioridad y estado.
* Calendario para consultar tareas por fecha.
* Visualización de estadísticas de las tareas.
* Modo claro y modo oscuro.
* Configuración del tamaño del texto.
* Edición de datos del perfil.
* Foto de perfil mediante cámara o galería.
* Cambio de contraseña.
* Persistencia local mediante SQLite.
* Almacenamiento remoto mediante Cloud Firestore.
* Funcionamiento sin conexión a Internet.
* Sincronización de cambios pendientes al recuperar la conectividad.
* Autenticación mediante Firebase Authentication.
* Consumo de la API REST de Cloudinary para la gestión de fotografías de perfil.
* Arquitectura basada en Clean Architecture.

---

# 2. Instalación y ejecución del proyecto

## 2.1. Clonar el repositorio

```bash
git clone https://github.com/Juan-2703/Barra-de-Tareas.git
cd Barra-de-Tareas
cd TaskBar
```

## 2.2. Instalar las dependencias

```bash
npm install
```

## 2.3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto `TaskBar`, tomando como referencia el archivo `.env.example`.

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

El archivo `.env` contiene la configuración necesaria para acceder a los servicios utilizados por la aplicación y no se encuentra incluido en el repositorio. Para configurar los valores correspondientes, revisar la documentación entregada junto con el proyecto.

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

Una vez iniciado Expo:

* Escanear el código QR mediante **Expo Go** desde un dispositivo compatible.
* Presionar `a` en la terminal para ejecutar la aplicación en Android si existe un emulador configurado.
* También es posible instalar y ejecutar una build de Android generada mediante **EAS Build**.

---

# 3. Arquitectura del proyecto

TaskBar se desarrolla siguiendo los principios de **Clean Architecture**, separando la lógica de negocio de los detalles técnicos relacionados con la interfaz, almacenamiento local y servicios externos.

La regla principal de esta arquitectura establece que las capas externas pueden depender de las internas, mientras que las capas internas no deben depender directamente de las implementaciones externas.

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

## Capas y carpetas principales

| Carpeta    | Función                                                                     |
| :--------- | :-------------------------------------------------------------------------- |
| `app/`     | Contiene las rutas y navegación principal mediante Expo Router.             |
| `assets/`  | Contiene imágenes, iconos y recursos utilizados por la aplicación.          |
| `config/`  | Agrupa configuraciones generales, como Firebase y el tema visual.           |
| `core/`    | Contiene componentes, contextos, hooks, servicios y utilidades compartidas. |
| `modules/` | Agrupa los módulos funcionales principales de TaskBar.                      |

Dentro del módulo de tareas se aplica la siguiente separación:

| Capa            | Función                                                                                                               |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `domain/`       | Contiene entidades, interfaces de repositorios y casos de uso sin depender de tecnologías específicas.                |
| `data/`         | Contiene data sources, DTOs, modelos e implementaciones de repositorios para SQLite y Cloud Firestore.                |
| `presentation/` | Contiene pantallas, componentes, hooks y elementos relacionados con la interacción del usuario.                       |
| `di/`           | Crea y conecta las implementaciones concretas utilizadas por las diferentes capas mediante inyección de dependencias. |

---

# 4. Funcionamiento offline y sincronización

TaskBar utiliza una estrategia **offline-first**, manteniendo una copia local de las tareas mediante **SQLite**.

Cuando el dispositivo no dispone de conexión a Internet, el usuario puede continuar trabajando con sus tareas. Las operaciones realizadas se almacenan localmente y los cambios que todavía no han sido enviados a la nube mantienen un estado pendiente de sincronización.

```text
Usuario
   ↓
TaskBar
   ↓
SQLite
   ↓
Cambios pendientes
   ↓
Sincronización
   ↓
Cloud Firestore
```

Cuando el dispositivo recupera la conexión a Internet, el proceso de sincronización envía los registros pendientes a **Cloud Firestore**, utilizando el identificador de cada tarea para reducir el riesgo de duplicación y actualizando posteriormente su estado de sincronización.

El funcionamiento offline permite realizar operaciones como:

* Crear tareas sin conexión.
* Consultar tareas almacenadas localmente.
* Editar tareas sin conexión.
* Cambiar el estado de una tarea.
* Eliminar tareas sin conexión.
* Mantener los cambios localmente.
* Sincronizar los cambios pendientes cuando se recupera la conectividad.

---

# 5. Tecnologías utilizadas

| Tecnología / Servicio   |        Versión       | Uso en TaskBar                                                             |
| :---------------------- | :------------------: | :------------------------------------------------------------------------- |
| React Native            |        0.81.5        | Desarrollo de la interfaz y funcionamiento de la aplicación móvil.         |
| Expo SDK                |     54 (~54.0.34)    | Entorno para desarrollo, ejecución y generación de builds.                 |
| TypeScript              |        ~5.9.2        | Desarrollo de la aplicación utilizando tipado estático.                    |
| Expo Router             |        ~6.0.24       | Gestión de rutas y navegación entre las pantallas.                         |
| Expo SQLite             |       ~16.0.10       | Persistencia local y funcionamiento sin conexión.                          |
| Firebase                |       ^12.17.0       | SDK utilizado para acceder a los servicios de Firebase.                    |
| Firebase Authentication |     Firebase SDK     | Registro, inicio de sesión y administración de usuarios.                   |
| Cloud Firestore         |     Firebase SDK     | Almacenamiento remoto y sincronización de tareas.                          |
| Cloudinary API REST     |       API REST       | Carga y almacenamiento de fotografías de perfil mediante solicitudes HTTP. |
| NetInfo                 |        11.4.1        | Detección del estado de conectividad del dispositivo.                      |
| Git                     | Control de versiones | Gestión del historial de cambios y desarrollo mediante ramas.              |
| GitHub                  |  Repositorio remoto  | Gestión colaborativa mediante commits, ramas, Pull Requests y merges.      |

---

# 6. Librerías externas principales

| Librería                                    |  Versión  | Uso                                                                          |
| :------------------------------------------ | :-------: | :--------------------------------------------------------------------------- |
| `@expo/vector-icons`                        |  ^15.0.3  | Iconos utilizados en diferentes elementos de la interfaz.                    |
| `@react-native-async-storage/async-storage` |   2.2.0   | Persistencia local utilizada por la autenticación y configuraciones locales. |
| `@react-native-community/netinfo`           |   11.4.1  | Detección del estado de la conexión a Internet.                              |
| `expo-checkbox`                             |   ~5.0.8  | Componentes de selección utilizados en la interfaz.                          |
| `expo-constants`                            |  ~18.0.13 | Acceso a información y configuración del entorno Expo.                       |
| `expo-file-system`                          |  ~19.0.23 | Acceso a funcionalidades relacionadas con archivos locales.                  |
| `expo-font`                                 |  ~14.0.12 | Soporte para fuentes dentro del entorno Expo.                                |
| `expo-image-picker`                         |  ~17.0.11 | Selección de imágenes desde la galería o cámara para la foto de perfil.      |
| `expo-linking`                              |  ~8.0.12  | Soporte para enlaces y rutas utilizadas por Expo Router.                     |
| `expo-router`                               |  ~6.0.24  | Navegación basada en archivos.                                               |
| `expo-secure-store`                         |  ~15.0.8  | Almacenamiento seguro de información local cuando es requerido.              |
| `expo-sqlite`                               |  ~16.0.10 | Acceso a la base de datos SQLite local.                                      |
| `expo-status-bar`                           |   ~3.0.9  | Control de la apariencia de la barra de estado.                              |
| `react-native-calendars`                    | ^1.1314.0 | Calendario utilizado para consultar tareas por fecha.                        |
| `react-native-gesture-handler`              |  ~2.28.0  | Soporte para gestos utilizados por navegación y componentes.                 |
| `react-native-safe-area-context`            |   ~5.6.0  | Adaptación de la interfaz a las áreas seguras del dispositivo.               |
| `react-native-screens`                      |  ~4.16.0  | Optimización del manejo de pantallas y navegación.                           |

---

# 7. Pantallas y funcionalidades principales

## Autenticación

* Inicio de sesión.
* Registro de usuarios.
* Control de acceso mediante Firebase Authentication.

## Gestión de tareas

* Listado de tareas.
* Creación de tareas.
* Consulta de información.
* Edición de tareas.
* Eliminación de tareas.
* Cambio de estado.
* Prioridades y fechas límite.
* Filtros por prioridad y estado.

## Calendario

La funcionalidad de calendario permite visualizar las tareas registradas de acuerdo con su fecha. Al seleccionar un día, se muestran las tareas asociadas a dicha fecha, facilitando la planificación y seguimiento de las actividades.

## Datos personales

Desde la sección de cuenta el usuario puede:

* Consultar sus datos personales.
* Editar la información de su perfil.
* Cambiar su contraseña.
* Seleccionar una foto desde la galería.
* Tomar una fotografía utilizando la cámara.
* Actualizar su foto de perfil.
* Cerrar sesión.

La fotografía seleccionada se envía a **Cloudinary mediante su API REST**, obteniendo una URL que posteriormente se asocia al perfil del usuario.

## Ajustes y preferencias

La sección de ajustes permite:

* Cambiar entre tema claro y oscuro.
* Configurar el tamaño del texto.
* Acceder a la visualización de estadísticas de las tareas.
* Acceder a las opciones relacionadas con la cuenta.

Las preferencias de apariencia se conservan localmente para mantener la configuración seleccionada al volver a utilizar la aplicación.

---

# 8. Flujo de sincronización de tareas

Las tareas pueden presentar diferentes estados internos dependiendo de su sincronización.

```text
Tarea creada o modificada
          ↓
        SQLite
          ↓
       Pending
          ↓
¿Existe conexión?
          ↓
   Cloud Firestore
          ↓
        Synced
```

SQLite funciona como almacenamiento local de las tareas, mientras que **Cloud Firestore** mantiene la información remota asociada a cada usuario.

La sincronización de las tareas es independiente del uso de la **API REST de Cloudinary**, ya que esta última se utiliza específicamente para la gestión de las fotografías de perfil.

---

# 9. Integrantes y responsabilidades

El desarrollo de TaskBar se distribuyó entre los cuatro integrantes del equipo mediante funcionalidades y ramas independientes, que posteriormente fueron integradas mediante Pull Requests.

| Integrante           | Rol                                                        | Responsabilidad principal                                                                                                                              |
| :------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sebastián Arista** | Desarrollador de Autenticación y Perfil                    | Implementación del registro e inicio de sesión mediante Firebase Authentication y funcionalidades relacionadas con la cuenta y perfil del usuario.     |
| **Milagros Lujan**   | Desarrolladora de Gestión de Tareas                        | Desarrollo de las funcionalidades principales de gestión de tareas, visualización y formularios para registrar y modificar actividades.                |
| **Juan Espetia**     | Desarrollador de Persistencia y Sincronización             | Implementación de SQLite y del mecanismo de sincronización entre los datos locales y Cloud Firestore para permitir el funcionamiento online y offline. |
| **Isaac Gavidia**    | Desarrollador de Interfaz y Configuración de la Aplicación | Desarrollo y organización de componentes visuales, temas, navegación y configuración general de la aplicación.                                         |

## Organización de ramas

```text
develop
├── feature/sebastian
│   ├── feature/sebastian-auth
│   └── feature/sebastian-perfil
│
├── feature/milagros
│   ├── feature/milagros-tareas
│   └── feature/milagros-formularios
│
├── feature/juan
│   ├── feature/juan-sqlite
│   └── feature/juan-firebase-sync
│
└── feature/isaac
    ├── feature/isaac-ui-tema
    └── feature/isaac-configuracion-app
```

Las funcionalidades desarrolladas en las ramas individuales fueron integradas progresivamente en `develop` mediante **Pull Requests y merges**. Una vez finalizada la integración y realizadas las pruebas correspondientes, la versión estable **v1.0.0** fue integrada desde `develop` hacia `main`.

---

# 10. Build y entorno de prueba

La versión **1.0.0** de TaskBar fue compilada e instalada en un dispositivo Android para comprobar su funcionamiento fuera del entorno de desarrollo.

| Dato                  | Valor             |
| :-------------------- | :---------------- |
| Aplicación            | TaskBar           |
| Versión               | 1.0.0             |
| Paquete Android       | `com.taskbar.app` |
| Plataforma            | Android           |
| Versión de Android    | Android 15        |

La aplicación fue instalada y ejecutada satisfactoriamente en el dispositivo, verificando el acceso a sus principales funcionalidades.

---

# 11. Plataformas

TaskBar fue desarrollada utilizando React Native y Expo, tecnologías que proporcionan soporte para el desarrollo multiplataforma.

* Android
* iOS

Durante el desarrollo, la aplicación puede ejecutarse mediante **Expo Go** y también puede generarse una versión instalable utilizando **EAS Build**.

---

# 12. Versión

**TaskBar v1.0.0**

