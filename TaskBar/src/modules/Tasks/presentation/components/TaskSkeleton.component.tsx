// modules/Tasks/presentation/components/TaskSkeleton.component.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../../../core/hooks/useTheme.hook';

interface TaskSkeletonProps {
  count?: number;
}

export const TaskSkeleton: React.FC<TaskSkeletonProps> = ({ count = 3 }) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const skeletonColor = theme.border || '#e0e0e0';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {[...Array(count)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.skeletonCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.topSection}>
            <View style={styles.titleSection}>
              {/* ✅ Silueta de checkbox */}
              <Animated.View
                style={[
                  styles.skeletonCheckbox,
                  { backgroundColor: skeletonColor, opacity },
                ]}
              />
              {/* ✅ Silueta de título */}
              <Animated.View
                style={[
                  styles.skeletonTitle,
                  { backgroundColor: skeletonColor, opacity },
                ]}
              />
            </View>
            <View style={styles.actionsContainer}>
              {/* ✅ Siluetas de íconos (editar/eliminar) */}
              <Animated.View
                style={[
                  styles.skeletonIcon,
                  { backgroundColor: skeletonColor, opacity },
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonIcon,
                  { backgroundColor: skeletonColor, opacity },
                ]}
              />
            </View>
          </View>
          <View style={styles.bottomSection}>
            {/* ✅ Silueta de descripción */}
            <Animated.View
              style={[
                styles.skeletonDescription,
                { backgroundColor: skeletonColor, opacity },
              ]}
            />
            {/* ✅ Silueta de fecha */}
            <Animated.View
              style={[
                styles.skeletonDate,
                { backgroundColor: skeletonColor, opacity },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  skeletonCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  skeletonCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    marginRight: 12,
  },
  skeletonTitle: {
    width: '70%',
    height: 20,
    borderRadius: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  skeletonIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  bottomSection: {
    marginTop: 2,
    paddingLeft: 34,
  },
  skeletonDescription: {
    width: '85%',
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonDate: {
    width: '40%',
    height: 14,
    borderRadius: 4,
  },
});