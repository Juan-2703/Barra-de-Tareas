<div align="center">

<img src="./assets/icon.png" alt="TaskBar Logo" width="150" />

<h1>📋 TaskBar</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo_SDK-54.0.0-success?style=for-the-badge" />
</p>

</div>

---

## Comandos iniciales para levantar el proyecto

Sigue estos pasos para ejecutar la app en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd TaskBar

# 2. Instalar las dependencias
npm install

# 3. Ejecutar el proyecto en modo desarrollo
npx expo start

# 4. Abrir la app en tu dispositivo
# - Escanea el código QR con la app Expo Go en tu celular.
# - O presiona 'a' (Android) o 'i' (iOS) en la terminal para abrir el emulador.

TaskBar/
├── src/
│   ├── components/         # Componentes reutilizables (TaskItem, CustomAlert, etc.)
│   ├── context/            # Context API (TaskContext, ThemeContext)
│   ├── data/               # Datos mockeados para pruebas iniciales
│   ├── hooks/              # Hooks personalizados (useTasks)
│   ├── navigation/         # Configuración de la navegación (Tabs + Stack)
│   ├── screens/            # Pantallas de la app (Home, Create, Edit, Calendar, Settings)
│   ├── types/              # Definiciones de tipos TypeScript (Task)
│   └── utils/              # Utilidades (formato de fechas)
├── assets/                 # Iconos y recursos gráficos
├── App.tsx                 # Punto de entrada de la app
├── app.json                # Configuración de Expo
├── package.json            # Dependencias y scripts
└── README.md               # Documentación del proyecto