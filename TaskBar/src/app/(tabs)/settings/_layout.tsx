import { Stack } from 'expo-router';
import { useTheme } from '../../../core/hooks/useTheme.hook';

export default function SettingsLayout() {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}