import { MaterialIcons } from '@expo/vector-icons';

export const getTabBarOptions = (theme: any) => ({
  tabBarActiveTintColor: theme.navActive || '#2d5a3d',
  tabBarInactiveTintColor: theme.navInactive || '#8a9e94',
  headerStyle: { backgroundColor: theme.header },
  headerTintColor: '#fff',
  headerShown: false,
});

export const getTabIcon = (routeName: string, color: string) => {
  const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    tasks: 'list',
    calendar: 'calendar-today',
    settings: 'settings',
  };

  return (
    <MaterialIcons
      name={icons[routeName] || 'list'}
      size={26}
      color={color}
    />
  );
};