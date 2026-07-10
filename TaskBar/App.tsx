import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { TaskProvider } from './src/context/TaskContext';
import { FontSizeProvider } from './src/context/FontSizeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <FontSizeProvider>
      <TaskProvider>
        <ThemeProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ThemeProvider>
      </TaskProvider>
    </FontSizeProvider>
  );
}