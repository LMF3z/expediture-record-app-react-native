import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { getData, storeData } from '../config/database';
import globalsStyles, { globalsColors } from '../globals/theme';

const CreateCategories = () => {
  const [categoryValue, setCategoryValue] = useState({
    id: '',
    title: '',
    description: '',
  });
  const [categoriesList, setCategoriesList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (name, text) => {
    setCategoryValue({ ...categoryValue, [name]: text });
  };

  const getCategories = async () => {
    const categoriesList = await getData('categories');
    setCategoriesList(categoriesList ? categoriesList : []);
  };

  const saveCategory = async () => {
    if (categoryValue.title === '') {
      return Alert.alert('Por favor ingrese un titulo');
    }

    if (isEditMode) {
      return updateCategory();
    }

    categoryValue.id = categoriesList.length + 1;

    const newCategory = categoriesList
      ? [...categoriesList, categoryValue]
      : [categoryValue];

    const saved = await storeData('categories', newCategory);
    if (saved) {
      Alert.alert('Categoria guardada exitosamente');
      getCategories();
      return setCategoryValue({
        id: '',
        title: '',
        description: '',
      });
    }

    Alert.alert('Error al registrar categoria');
  };

  const deleteCategory = async (id) => {
    const listDeleted = categoriesList.filter((cat) => +cat.id !== +id);
    await storeData('categories', listDeleted);
    Alert.alert('Categoria eliminada exitosamente');
    getCategories();
  };

  const editCategory = (data) => {
    setCategoryValue(data);
    setIsEditMode(true);
  };

  const updateCategory = async () => {
    const updatedCategory = categoriesList.map((cat) => {
      if (+cat.id === categoryValue.id) {
        (cat.title = categoryValue.title),
          (cat.description = categoryValue.description);
      }
      return cat;
    });

    await storeData('categories', updatedCategory);
    Alert.alert('Categoria actualizada exitosamente');
    setIsEditMode(false);
    getCategories();
    setCategoryValue({
      id: '',
      title: '',
      description: '',
    });
  };

  const QuickActions = (index, qaItem) => {
    return (
      <View style={styles.qaContainer}>
        <View style={[styles.button]}>
          <Pressable onPress={() => editCategory(qaItem)}>
            <Text style={[styles.buttonText, { color: 'green' }]}>Editar</Text>
          </Pressable>
        </View>
        <View style={[styles.button]}>
          <Pressable onPress={() => deleteCategory(qaItem.id)}>
            <Text style={[styles.buttonText, { color: 'red' }]}>Eliminar</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        globalsStyles.container,
        { justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20 },
      ]}
    >
      <View style={styles.containerInputs}>
        <Text style={{ fontSize: 14 }}>Nombre de la categría:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Ej: Comida"
          value={categoryValue.title}
        />
      </View>
      <View style={styles.containerInputs}>
        <Text style={{ fontSize: 14 }}>Descripción:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Description"
          value={categoryValue.description}
        />
      </View>

      <View style={[styles.containerInputs, { marginBottom: 0 }]}>
        <TouchableOpacity style={globalsStyles.button} onPress={saveCategory}>
          <Text style={{ fontSize: 16, color: '#fff' }}>
            {isEditMode ? 'Editar' : 'Guardar'} Categoría
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerList}>
        <SwipeableFlatList
          data={categoriesList}
          renderItem={({ item }) => (
            <View style={styles.renderItem}>
              <Text style={styles.renderItemsText}>{item.title}</Text>
              <Text style={styles.renderItemsText}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          maxSwipeDistance={240}
          renderQuickActions={({ index, item }) => QuickActions(index, item)}
          shouldBounceOnMount={true}
          itemSeparatorComponent={<View style={styles.itemSeparator} />}
          // contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerInputs: {
    width: '70%',
    height: 90,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: globalsColors.grayDos,
  },
  containerList: {
    width: '70%',
    height: 400,
  },
  renderItem: {
    width: '100%',
    height: 80,
    color: '#fff',
    backgroundColor: '#fffefe',
    borderWidth: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  renderItemsText: {
    color: '#9ca2ae',
  },
  itemSeparator: {
    height: 20,
  },
  qaContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#ddd',
  },
  button: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    opacity: 2,
  },
  contentContainerStyle: {
    flexGrow: 1,
    height: 80,
    backgroundColor: '#0d0d0d',
  },
});

export default CreateCategories;
