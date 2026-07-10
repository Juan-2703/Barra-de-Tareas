import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CreateTaskScreen } from '../screens/CreateTaskScreen';
import { EditTaskScreen } from '../screens/EditTaskScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  CreateTask: undefined;
  EditTask: { taskId: string };
};

export type MainTabParamList = {
  Tareas: undefined;
  Calendario: undefined;
  Ajustes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName: keyof typeof MaterialIcons.glyphMap = 'list';
            if (route.name === 'Tareas') iconName = 'list';
            else if (route.name === 'Calendario') iconName = 'calendar-today';
            else if (route.name === 'Ajustes') iconName = 'settings';
            return (
              <MaterialIcons
                name={iconName}
                size={26}
                color={focused ? '#5d8a6e' : color}
              />
            );
          },
          tabBarActiveTintColor: '#5d8a6e',
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Tareas" component={HomeScreen} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
        <Tab.Screen name="Ajustes" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{
          headerShown: true,
          title: 'Crear Tarea',
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          headerShown: true,
          title: 'Editar Tarea',
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }}
      />
    </Stack.Navigator>
  );
}