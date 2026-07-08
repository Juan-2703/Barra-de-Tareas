<div align="center" style="background-color: #2f4f4f; padding: 30px; border-radius: 12px; width: 100%;">

<img src="./TaskBar/src/assets/icon.png" alt="TaskBar Logo" width="150" />

<h1 style="color: #ffffff; margin-top: 10px;">TaskBar</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo_SDK-54-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge" />
</p>

</div>

---

### Que es TaskBar?

**TaskBar** es una aplicación móvil para la gestión de tareas personales, desarrollada con **React Native** y **Expo**.
Permite crear, editar, eliminar y marcar tareas como completadas. Incluye un calendario integrado para visualizar tareas por fecha de vencimiento y un modo oscuro para adaptarse a las preferencias del usuario.

---


# 1. Comandos iniciales para levantar el proyecto


## 1.1. Clonar el repositorio (Si usas URL)

```bash
git clone https://github.com/Juan-2703/Barra-de-Tareas.git
cd Barra-de-Tareas
cd TaskBar
```

## 1.2. Instalar las dependencias
```bash
npm install
```

## 1.3. Ejecutar el proyecto 

### Para red local 
```bash
npx expo start
```
### Para hostear con túnel 
```bash
npx expo start --tunnel
```

## 1.4. Abrir la app en tu dispositivo
- Escanea el código QR con la app Expo Go en tu celular.
- O presiona 'a' (Android) o 'i' (iOS) en la terminal para abrir el emulador.

# 2. Estructura del Proyecto

```text
TaskBar/
├── src/
│   ├── context/
│   ├── hooks/
│   ├── navigation/
│   ├── types/
│   ├── data/
│   ├── assets/
│   ├── screens/
│   └── components/
├── App.tsx
├── app.json
├── package.json
└── README.md
```

# 3. Función de cada carpeta

| Carpeta | Función |
| :--- | :--- |
| **`context/`** | Proveedores de estado global (`TaskContext`, `ThemeContext`). |
| **`hooks/`** | Hook personalizado para acceder al estado de forma sencilla (`useTasks`). |
| **`navigation/`** | Configuración de la barra inferior y el apilado de pantallas. |
| **`types/`** | Interfaces TypeScript para un código seguro y tipado. |
| **`data/`** | Datos de ejemplo para iniciar la app con tareas predefinidas. |
| **`assets/`** | Iconos y recursos estáticos. |
| **`screens/`** | Vistas principales (`Home`, `Create`, `Edit`, `Calendar`, `Settings`). |
| **`components/`** | Componentes reutilizables (`TaskItem`, `CustomButton`, `CustomAlert`). |

# 4. Librerias Utilizadas

| Librería | Razón de uso |
| :--- | :--- |
| **React Navigation** | Navegación profesional con Bottom Tabs y Stack Navigator. |
| **`@react-native-community/datetimepicker`** | Selector de fecha nativo para iOS y Android. |
| **`expo-checkbox`** | Checkbox estilizado y funcional para marcar tareas. |
| **`expo-vector-icons`** | Iconos profesionales para la interfaz de usuario. |
| **`react-native-safe-area-context`** | Asegura que el contenido respete los bordes seguros de la pantalla. |


# 5. Integrantes del Grupo

| Integrante | Rol |
| :--- | :--- |
| Juan Espetia | Estructura base (Context, Hooks, Navigation, Types) |
| Isaac Gavidia | Calendario y Formularios (Calendar, Create, Edit) |
| Sebastian Arista | Componentes y Pantalla de Inicio (Components, HomeScreen) |
| Milagros Lujan | Ajustes y Tema (Settings, ThemeContext) |
