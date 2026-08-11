import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { useUser } from '../../../../core/contexts/UserContext';

import { textSizes } from '../../../../config/theme/texts';

import { TaskItem } from '../components/TaskItem.component';
import { TaskSkeleton } from '../components/TaskSkeleton.component';
import { FilterModal } from '../components/FilterModal.component';
import { CustomAlert } from '../../../../core/components/CustomAlert.component';

import { TaskEntityImpl } from '../../domain/entities/task.entity';
import { useTaskList } from '../hooks/useTaskList.hook';
import { useTaskActions } from '../hooks/useTaskActions.hook';
import { useToggleComplete } from '../hooks/useToggleComplete.hook';

export const HomeScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const { user, refreshUser } = useUser();

  const {
    filteredTasks,
    isLoading,
    refreshing,
    searchQuery,
    isSearchVisible,
    filterPriority,
    filterStatus,
    activeFilterCount,
    setSearchQuery,
    setFilterPriority,
    setFilterStatus,
    handleRefresh,
    toggleSearch,
    clearSearch,
  } = useTaskList();

  const {
    deleteAlert,
    detailsAlert,
    errorAlert,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
    handleOpenDetails,
    handleCloseDetails,
    handleEdit,
    closeErrorAlert,
  } = useTaskActions();

  const { toggleComplete } = useToggleComplete();

  const currentFontSize = textSizes[fontSize];

  const [filterModalVisible, setFilterModalVisible] =
    useState(false);

  const [forceUpdate, setForceUpdate] =
    useState(0);

  useFocusEffect(
    useCallback(() => {
      void refreshUser().then(() =>
        setForceUpdate((prev) => prev + 1)
      );
    }, [])
  );

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Usuario';

  const photoURL = user?.photoURL || '';

  const handlePullRefresh = async () => {
    await refreshUser();
    await handleRefresh();
  };

  const renderItem = useCallback(
    ({ item }: { item: TaskEntityImpl }) => (
      <TaskItem
        task={item}
        onToggleComplete={toggleComplete}
        onPress={handleOpenDetails}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />
    ),
    [
      toggleComplete,
      handleOpenDetails,
      handleEdit,
      handleDeleteRequest,
    ]
  );

  const renderAvatar = () => {
    if (photoURL) {
      return (
        <Image
          source={{ uri: photoURL }}
          style={styles.avatarSmall}
          key={forceUpdate}
        />
      );
    }

    return (
      <View
        style={[
          styles.avatarSmall,
          { backgroundColor: '#fff' },
        ]}
      >
        <Text
          style={[
            styles.avatarTextSmall,
            { fontSize: currentFontSize - 2 },
          ]}
        >
          {displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: theme.header },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              {
                color: '#fff',
                fontSize: currentFontSize + 10,
              },
            ]}
          >
            Mis Tareas
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/account')}
            style={styles.headerAvatar}
          >
            {renderAvatar()}
          </TouchableOpacity>
        </View>

        <TaskSkeleton count={4} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: theme.header },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: '#fff',
              fontSize: currentFontSize + 10,
            },
          ]}
        >
          Mis Tareas
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.headerIcon}
          >
            <MaterialIcons
              name="filter-list"
              size={24}
              color="#fff"
            />

            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleSearch}
            style={styles.headerIcon}
          >
            <MaterialIcons
              name={isSearchVisible ? 'close' : 'search'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/account')}
            style={styles.headerAvatar}
          >
            {renderAvatar()}
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <MaterialIcons
              name="search"
              size={22}
              color={theme.textSecondary}
            />

            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                  fontSize: currentFontSize,
                },
              ]}
              placeholder="Buscar tarea..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />

            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearButton}
            >
              <MaterialIcons
                name="close"
                size={18}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {filteredTasks.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.background },
          ]}
        >
          {searchQuery.length > 0 ||
          activeFilterCount > 0 ? (
            <>
              <MaterialIcons
                name="search-off"
                size={60}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: theme.text,
                    fontSize: currentFontSize + 4,
                  },
                ]}
              >
                No se encontraron tareas
              </Text>

              <Text
                style={[
                  styles.emptySubtitle,
                  {
                    color: theme.textSecondary,
                    fontSize: currentFontSize,
                  },
                ]}
              >
                Prueba con otros filtros
              </Text>
            </>
          ) : (
            <>
              <MaterialIcons
                name="checklist"
                size={60}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: theme.text,
                    fontSize: currentFontSize + 4,
                  },
                ]}
              >
                ¡Nada por hacer! ✨
              </Text>

              <Text
                style={[
                  styles.emptySubtitle,
                  {
                    color: theme.textSecondary,
                    fontSize: currentFontSize,
                  },
                ]}
              >
                Agrega una tarea tocando el botón verde.
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handlePullRefresh}
            />
          }
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor:
              theme.fab || '#2d5a3d',
            shadowColor:
              theme.fabShadow ||
              'rgba(45, 90, 61, 0.25)',
          },
        ]}
        onPress={() =>
          router.push('/(tabs)/tasks/new')
        }
      >
        <MaterialIcons
          name="add"
          size={30}
          color="#fff"
        />
      </TouchableOpacity>

      <FilterModal
        visible={filterModalVisible}
        onClose={() =>
          setFilterModalVisible(false)
        }
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        theme={theme}
        currentFontSize={currentFontSize}
      />

      <CustomAlert
        visible={deleteAlert.visible}
        title="Eliminar tarea"
        message={`¿Estás seguro de que quieres eliminar "${deleteAlert.taskTitle}"?`}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <CustomAlert
        visible={detailsAlert.visible}
        title={
          detailsAlert.task?.titulo || 'Detalles'
        }
        message={
          detailsAlert.task
            ? `Descripción:\n${
                detailsAlert.task.descripcion ||
                'Sin descripción'
              }\n\nPrioridad: ${detailsAlert.task.getPriorityLabel()}\n\nFecha Límite:\n${
                detailsAlert.task.fechaVencimiento
                  ? detailsAlert.task.fechaVencimiento.toLocaleDateString()
                  : 'Sin fecha'
              }`
            : ''
        }
        onClose={handleCloseDetails}
        hideConfirmButton
        cancelText="Cerrar"
      />

      <CustomAlert
        visible={errorAlert.visible}
        title="Error"
        message={errorAlert.message}
        onClose={closeErrorAlert}
        hideConfirmButton
        cancelText="Cerrar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 22,
    letterSpacing: 0.5,
    color: '#fff',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 4,
    marginRight: 8,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -2,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerAvatar: {
    marginLeft: 4,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextSmall: {
    color: '#3a6b4a',
    fontWeight: 'bold',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 10,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0,
  },
});