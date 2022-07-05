import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { getData, storeData } from '../config/database';
import globalsStyles, { globalsColors } from '../globals/theme';
import SelectPicker from './SelectPicker';

const CreateNewExpenditure = ({ handleClose, dataToEdit, actualBudget }) => {
  const [categories, setCategories] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [newExpend, setNewExpend] = useState({
    id: '',
    title: '',
    amount: '',
    category: '',
  });

  useEffect(() => {
    getCategories();
    getExpenditures();
  }, []);

  useEffect(() => {
    if (Object.values(dataToEdit).length > 0) {
      setNewExpend(dataToEdit);
    }
  }, [dataToEdit]);

  const getCategories = async () => {
    const categoriesList = await getData('categories');
    if (categoriesList) setCategories(categoriesList);
  };

  const getExpenditures = async () => {
    const expenditureList = await getData();
    setExpenditures(expenditureList ? expenditureList : []);
  };

  const handleChange = (name, text) => {
    setNewExpend({ ...newExpend, [name]: text });
  };

  const saveNewExpend = async () => {
    if (Object.values(dataToEdit).length > 0) {
      return updateExpenditure();
    }

    if (+newExpend.amount > +actualBudget) {
      return Alert.alert('No tienes suficiente dinero para este gasto.');
    }

    newExpend.id = expenditures.length + 1;

    const newArrExpend =
      expenditures.length > 0 ? [...expenditures, newExpend] : [newExpend];

    const saved = await storeData('expenditure', newArrExpend);
    if (saved) handleClose();
  };

  const updateExpenditure = async () => {
    const updated = expenditures.map((expend) => {
      if (+expend.id === +newExpend.id) {
        expend.title = newExpend.title;
        expend.amount = newExpend.amount;
        expend.category = newExpend.category;
      }
      return expend;
    });

    const saved = await storeData('expenditure', updated);
    if (saved) {
      setNewExpend({ id: '', title: '', category: '', amount: '' });
      handleClose();
    }
  };

  return (
    <View
      style={[
        globalsStyles.container,
        {
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 50,
          position: 'relative',
        },
      ]}
    >
      <Text
        style={{ position: 'absolute', right: 20, top: 10, fontSize: 18 }}
        onPress={handleClose}
      >
        Cancelar
      </Text>
      <View style={styles.containerInputs}>
        <Text style={{ fontSize: 14 }}>Nombre del gasto:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Netflix"
          value={newExpend.title}
        />
      </View>
      <View style={styles.containerInputs}>
        <Text style={{ fontSize: 14 }}>Cantidad gastada:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => handleChange('amount', text)}
          placeholder="0$"
          keyboardType="decimal-pad"
          value={newExpend.amount}
        />
      </View>
      <View style={styles.containerInputs}>
        <Text style={{ fontSize: 14 }}>Categoría:</Text>
        <TouchableOpacity
          style={[globalsStyles.input, { justifyContent: 'center' }]}
          onPress={() => setIsSelectOpen(true)}
        >
          <Text style={{ fontSize: 16, color: 'gray' }}>
            {newExpend.category === ''
              ? 'Seleccione categoría'
              : newExpend.category}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.containerInputs, { marginBottom: 0 }]}>
        <TouchableOpacity style={globalsStyles.button} onPress={saveNewExpend}>
          <Text style={{ fontSize: 16, color: '#fff' }}>Guardar gasto</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isSelectOpen && categories.length > 0}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setIsSelectOpen(false);
        }}
      >
        <SelectPicker
          data={categories}
          handleSelectOption={(optionSelected) =>
            handleChange('category', optionSelected)
          }
          handleClose={() => setIsSelectOpen(false)}
          defaultTitle={newExpend.category}
        />
      </Modal>
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
});

export default CreateNewExpenditure;
