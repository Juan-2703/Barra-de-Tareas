import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';
import { TaskEntityImpl } from '../../domain/entities/task.entity';

interface TaskItemProps {
  task: TaskEntityImpl;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (task: TaskEntityImpl) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onPress,
}) => {
  const { theme, isDark } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  const handleToggle = useCallback(
    () => onToggleComplete(task.id),
    [task.id, onToggleComplete]
  );

  const handleEdit = useCallback(
    () => onEdit(task.id),
    [task.id, onEdit]
  );

  const handleDelete = useCallback(
    () => onDelete(task.id),
    [task.id, onDelete]
  );

  const handlePress = useCallback(
    () => onPress(task),
    [task, onPress]
  );

  const isCompleted = task.isCompleted();
  const priorityColor = task.getPriorityColor();

  const checkboxColor = isCompleted
    ? isDark
      ? '#4a8c5c'
      : '#3a6b4a'
    : undefined;

  const syncIcon =
    task.syncStatus === 'pending'
      ? { name: 'sync' as const, color: '#f39c12' }
      : task.syncStatus === 'failed'
        ? { name: 'error-outline' as const, color: '#e74c3c' }
        : { name: 'check-circle' as const, color: '#2ecc71' };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: priorityColor },
        ]}
      />

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          <View style={styles.titleSection}>
            <Checkbox
              value={isCompleted}
              onValueChange={handleToggle}
              color={checkboxColor}
              style={styles.checkbox}
            />

            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                  fontSize: currentFontSize + 4,
                },
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.titulo}
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="edit"
                size={21}
                color="#4a7a8c"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="delete"
                size={21}
                color="#e74c5e"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {!!task.descripcion && (
            <Text
              style={[
                styles.description,
                {
                  color: theme.textSecondary,
                  fontSize: currentFontSize,
                },
              ]}
              numberOfLines={2}
            >
              {task.descripcion}
            </Text>
          )}

          <View style={styles.metaContainer}>
            {task.fechaVencimiento && (
              <View style={styles.dateContainer}>
                <MaterialIcons
                  name="event"
                  size={16}
                  color="#4a8c5c"
                />

                <Text
                  style={[
                    styles.date,
                    { fontSize: currentFontSize - 2 },
                  ]}
                >
                  {task.fechaVencimiento.toLocaleDateString()}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${priorityColor}20` },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  {
                    color: priorityColor,
                    fontSize: currentFontSize - 4,
                  },
                ]}
              >
                {task.getPriorityLabel()}
              </Text>
            </View>
          </View>

          <View style={styles.syncIndicator}>
            <MaterialIcons
              name={syncIcon.name}
              size={17}
              color={syncIcon.color}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  priorityBar: {
    width: 4,
  },

  contentContainer: {
    flex: 1,
    padding: 16,
  },

  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  titleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  checkbox: {
    width: 22,
    height: 22,
    marginRight: 12,
    borderRadius: 6,
  },

  title: {
    flex: 1,
    fontWeight: '600',
  },

  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  actionButton: {
    padding: 4,
    borderRadius: 8,
  },

  bottomSection: {
    paddingLeft: 34,
    paddingRight: 30,
    marginTop: 7,
    position: 'relative',
  },

  description: {
    marginBottom: 10,
    lineHeight: 20,
  },

  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  date: {
    color: '#4a8c5c',
    fontWeight: '500',
  },

  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  priorityText: {
    fontWeight: '600',
  },

  syncIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});