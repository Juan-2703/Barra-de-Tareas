import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TaskPriority } from '../../domain/entities/task.entity';

type FilterPriority = TaskPriority | 'todas';
type FilterStatus = 'todas' | 'pendientes' | 'completadas';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterPriority: FilterPriority;
  setFilterPriority: (priority: FilterPriority) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  theme: any;
  currentFontSize: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  theme,
  currentFontSize,
}) => {
  const insets = useSafeAreaInsets();

  const priorityLabels: Record<FilterPriority, string> = {
    todas: 'Todas',
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
  };

  const priorityColors: Record<
    Exclude<FilterPriority, 'todas'>,
    string
  > = {
    alta: '#e74c3c',
    media: '#f39c12',
    baja: '#2ecc71',
  };

  const statusLabels: Record<FilterStatus, string> = {
    todas: 'Todas',
    pendientes: 'Pendientes',
    completadas: 'Completadas',
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.card,
                paddingBottom: Math.max(insets.bottom, 16) + 20,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: theme.text,
                    fontSize: currentFontSize + 4,
                  },
                ]}
              >
                Filtros
              </Text>

              <TouchableOpacity onPress={onClose}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.filterSectionTitle,
                {
                  color: theme.text,
                  fontSize: currentFontSize,
                },
              ]}
            >
              Prioridad
            </Text>

            <View style={styles.filterOptions}>
              {(
                ['todas', 'alta', 'media', 'baja'] as FilterPriority[]
              ).map((priority) => {
                const isActive =
                  filterPriority === priority;

                const activeColor =
                  priority === 'todas'
                    ? '#5d8a6e'
                    : priorityColors[
                        priority as Exclude<
                          FilterPriority,
                          'todas'
                        >
                      ];

                return (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.filterChip,
                      {
                        borderColor: isActive
                          ? activeColor
                          : theme.border,
                        backgroundColor: isActive
                          ? activeColor
                          : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setFilterPriority(priority)
                    }
                  >
                    {priority !== 'todas' && (
                      <View
                        style={[
                          styles.filterDot,
                          {
                            backgroundColor: isActive
                              ? '#fff'
                              : activeColor,
                          },
                        ]}
                      />
                    )}

                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: isActive
                            ? '#fff'
                            : theme.text,
                          fontSize: currentFontSize - 2,
                        },
                      ]}
                    >
                      {priorityLabels[priority]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={[
                styles.filterSectionTitle,
                {
                  color: theme.text,
                  fontSize: currentFontSize,
                  marginTop: 16,
                },
              ]}
            >
              Estado
            </Text>

            <View style={styles.filterOptions}>
              {(
                [
                  'todas',
                  'pendientes',
                  'completadas',
                ] as FilterStatus[]
              ).map((status) => {
                const isActive =
                  filterStatus === status;

                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      {
                        borderColor: isActive
                          ? '#5d8a6e'
                          : theme.border,
                        backgroundColor: isActive
                          ? '#5d8a6e'
                          : 'transparent',
                      },
                    ]}
                    onPress={() =>
                      setFilterStatus(status)
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: isActive
                            ? '#fff'
                            : theme.text,
                          fontSize: currentFontSize - 2,
                        },
                      ]}
                    >
                      {statusLabels[status]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.clearFiltersButton,
                  {
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => {
                  setFilterPriority('todas');
                  setFilterStatus('todas');
                }}
              >
                <Text
                  style={[
                    styles.clearFiltersText,
                    {
                      color: theme.text,
                      fontSize: currentFontSize,
                    },
                  ]}
                >
                  Limpiar filtros
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.applyFiltersButton,
                  {
                    backgroundColor: theme.header,
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.applyFiltersText,
                    {
                      fontSize: currentFontSize,
                    },
                  ]}
                >
                  Aplicar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filterChipText: {
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  clearFiltersText: {
    fontWeight: '500',
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});