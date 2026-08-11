import { Tabs, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../core/hooks/useTheme.hook';
import { getTabBarOptions, getTabIcon } from '../../config/navigation/tabNav';
import { Platform, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabsLayout() {
  const { theme, isDark } = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const hideTabs = pathname.includes('/tasks/new') || pathname.includes('/tasks/');

  const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    if (hideTabs) return null;

    const visibleRoutes = state.routes.filter((route) => route.name !== 'index');

    const tabBarHeight = Platform.OS === 'ios' ? 80 + insets.bottom : 60 + insets.bottom;

    return (
      <View
        style={{
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: Platform.OS === 'ios' ? 4 : 2,
        }}
      >
        <View style={{
          flexDirection: 'row',
          height: Platform.OS === 'ios' ? 76 : 58,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 8,
        }}>
          {visibleRoutes.map((route: any, index: number) => {
            const isFocused = state.index === state.routes.indexOf(route);
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let label = '';
            if (route.name === 'tasks') label = 'Tareas';
            else if (route.name === 'calendar') label = 'Calendario';
            else if (route.name === 'settings') label = 'Ajustes';

            const iconColor = isFocused
              ? theme.navActive || '#2d5a3d'
              : theme.navInactive || '#8a9e94';

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 4,
                }}
              >
                {getTabIcon(route.name, iconColor)}
                <Text style={{
                  fontSize: 11,
                  fontWeight: isFocused ? '600' : '500',
                  color: iconColor,
                  marginTop: 2,
                }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          ...getTabBarOptions(theme),
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tareas',
            tabBarIcon: ({ color }) => getTabIcon('tasks', color),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendario',
            tabBarIcon: ({ color }) => getTabIcon('calendar', color),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color }) => getTabIcon('settings', color),
          }}
        />
      </Tabs>
    </>
  );
}