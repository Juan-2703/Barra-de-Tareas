import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '../types/Task';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';

interface Props {
  tarea: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onPress: (tarea: Task) => void;
}

export const TaskItem: React.FC<Props> = ({ tarea, onToggleComplete, onEdit, onDeleteRequest, onPress }) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);

  const handleToggle = useCallback(() => onToggleComplete(tarea.id), [tarea.id, onToggleComplete]);
  const handleEdit = useCallback(() => onEdit(tarea.id), [tarea.id, onEdit]);
  const handleDeleteRequest = useCallback(() => onDeleteRequest(tarea.id), [tarea.id, onDeleteRequest]);
  const handlePress = useCallback(() => onPress(tarea), [tarea, onPress]);

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.topSection}>
        <View style={styles.titleSection}>
          <Checkbox
            value={tarea.completada}
            onValueChange={handleToggle}
            color={tarea.completada ? '#00882d' : undefined}
            style={styles.checkbox}
          />
          <Text
            style={[
              styles.title, 
              { color: theme.text, fontSize: currentFontSize + 4 },
              tarea.completada && styles.titleCompleted
            ]}
            numberOfLines={1}
          >
            {tarea.titulo}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
            <MaterialIcons name="edit" size={22} color="#0d61af" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteRequest} style={styles.actionButton}>
            <MaterialIcons name="delete" size={22} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomSection}>
        {tarea.descripcion && (
          <Text style={[styles.description, { color: theme.textSecondary, fontSize: currentFontSize }]} numberOfLines={3}>
            {tarea.descripcion}
          </Text>
        )}
        {tarea.fechaVencimiento && (
          <Text style={[styles.date, { fontSize: currentFontSize - 2 }]}>
            Fecha Limite: {tarea.fechaVencimiento.toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  checkbox: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  bottomSection: {
    marginTop: 2,
    paddingLeft: 34,
  },
  description: {
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    color: '#007AFF',
    marginTop: 2,
  },
});