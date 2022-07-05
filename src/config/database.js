import AsyncStorage from '@react-native-async-storage/async-storage';

const NAME_EXPENDITURE = 'expenditure';

export const storeData = async (name = NAME_EXPENDITURE, data) => {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(data));
    return true;
  } catch (e) {
    console.log('Error al guardar datos.', e);
    return null;
  }
};

export const getData = async (name = NAME_EXPENDITURE) => {
  try {
    const jsonValue = await AsyncStorage.getItem(name);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Error al obtener datos.', e);
    return null;
  }
};

export const removeAllValue = async (name = NAME_EXPENDITURE) => {
  try {
    await AsyncStorage.removeItem(name);
    return true;
  } catch (e) {
    console.log('Error al remover datos.', e);
    return null;
  }
};
