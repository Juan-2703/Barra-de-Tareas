import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TaskProvider } from './src/context/TaskContext';
import { FontSizeProvider } from './src/context/FontSizeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

function StatusBarWrapper() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <FontSizeProvider>
      <TaskProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBarWrapper />
          </NavigationContainer>
        </ThemeProvider>
      </TaskProvider>
    </FontSizeProvider>
  );
}