import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from '../core/contexts/theme.context';
import { FontSizeProvider } from '../core/contexts/fontsize.context';
import { UserProvider, useUser } from '../core/contexts/UserContext';
import { TaskProvider } from '../core/contexts/TaskContext';

const RootNavigator = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  return (
    <>
      <StatusBar style="auto" />

      <Stack screenOptions={{ animation: 'none', headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>

        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account" />
        </Stack.Protected>
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <UserProvider>
          <TaskProvider>
            <RootNavigator />
          </TaskProvider>
        </UserProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}