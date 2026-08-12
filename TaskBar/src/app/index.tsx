import { Redirect } from 'expo-router';
import { useUser } from '../core/contexts/UserContext';

export default function AppIndex() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}