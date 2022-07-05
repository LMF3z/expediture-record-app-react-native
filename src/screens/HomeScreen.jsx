import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import SwipeableFlatList from 'react-native-swipeable-list';
import Card from '../components/Card';
import CreateNewExpenditure from '../components/CreateNewExpenditure';
import FloatAddIcon from '../components/FloatAddIcon';
import { getData, storeData } from '../config/database';
import globalsStyles, { globalsColors } from '../globals/theme';

const HomeScreen = () => {
  const [addBudgetAmount, setAddBudgetAmount] = useState(false);
  const [budgetBase, setBudgetBase] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [statistics, setStatistics] = useState({
    percent: 0,
    available: 0,
    spent: 0,
  });
  const [modalNewExpent, setModalNewExpent] = useState(false);
  const [expenditures, setExpenditures] = useState([]);
  const [expendToEditData, setExpendToEditData] = useState({});

  useEffect(() => {
    getBudget();
    getExpenditures();
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [expenditures]);

  const getBudget = async () => {
    const budgetSaved = await getData('budget');
    if (budgetSaved) {
      setBudgetBase(budgetSaved);
    }
  };

  const getExpenditures = async () => {
    const expenditureList = await getData();
    if (expenditureList?.length) setExpenditures(expenditureList);
  };

  const changeBudget = (text) => {
    setCurrentBudget(text);
  };

  const addBudget = async () => {
    if (+currentBudget === 0) {
      await storeData('budget', 0);
      return setCurrentBudget('');
    }

    const saved = await storeData('budget', currentBudget);

    setAddBudgetAmount(false);

    if (!saved) return Alert.alert('Error al guardar presupuesto');

    getBudget();
  };

  const deleteExpenditure = async (id_expenditure) => {
    const deleted = expenditures.filter((item) => +item.id !== +id_expenditure);
    setExpenditures(deleted);
    await storeData('expenditure', deleted);
    if (deleted.length === 0) getExpenditures();
  };

  const editExpenditure = (expend) => {
    setExpendToEditData(expend);
    setModalNewExpent(true);
  };

  const calculate = () => {
    const worn = expenditures.reduce((acc, el) => acc + +el.amount, 0);

    if (worn > 0) {
      const roundedWorn = (worn * 100) / 100;
      const percent = (roundedWorn * 100) / budgetBase;

      return setStatistics({
        ...statistics,
        percent: percent.toFixed(1),
        available: budgetBase - roundedWorn,
        spent: roundedWorn,
      });
    }

    setStatistics({
      percent: 0,
      available: 0,
      spent: 0,
    });
  };

  const QuickActions = (index, qaItem) => {
    return (
      <View style={styles.qaContainer}>
        <View style={[styles.button]}>
          <Pressable onPress={() => editExpenditure(qaItem)}>
            <Text style={[styles.buttonText, { color: 'green' }]}>Editar</Text>
          </Pressable>
        </View>
        <View style={[styles.button]}>
          <Pressable onPress={() => deleteExpenditure(qaItem.id)}>
            <Text style={[styles.buttonText, { color: 'red' }]}>Eliminar</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (isNaN(budgetBase) || +budgetBase === 0 || addBudgetAmount) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#000" barStyle={'light-content'} />
        <View style={globalsStyles.container}>
          <View
            style={{ width: '100%', paddingHorizontal: '10%', height: 250 }}
          >
            <Card containerStyles={styles.stylesCard} title="">
              <Text style={styles.title}>Definir presupuesto</Text>
              <TextInput
                style={[globalsStyles.input, styles.separator]}
                keyboardType="decimal-pad"
                placeholder="Description"
                onChangeText={changeBudget}
                value={currentBudget}
              />
              <TouchableOpacity
                style={globalsStyles.button}
                onPress={addBudget}
              >
                <Text style={{ fontSize: 16, color: '#fff' }}>Añadir</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalNewExpent}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalNewExpent(false);
        }}
      >
        <CreateNewExpenditure
          handleClose={() => {
            setModalNewExpent(false);
            getExpenditures();
          }}
          dataToEdit={expendToEditData}
          actualBudget={budgetBase}
        />
      </Modal>
      <View
        style={[
          globalsStyles.container,
          {
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 20,
            position: 'relative',
          },
        ]}
      >
        <CircularProgress
          value={statistics.percent}
          radius={110}
          duration={1000}
          progressValueColor={'#101011'}
          maxValue={100}
          title={''}
          titleColor={''}
          titleStyle={{ fontWeight: 'bold' }}
          inActiveStrokeColor={globalsColors.gray}
          activeStrokeColor={globalsColors.blue}
        />

        <View style={[styles.containerDataStatistics, { borderWidth: 0 }]}>
          <TouchableOpacity
            style={globalsStyles.button}
            onPress={() => setAddBudgetAmount(true)}
          >
            <Text style={{ color: '#fff' }}>Modificar presupuesto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerDataStatistics}>
          <Text style={styles.textStatistics}>
            Presupuesto:{' '}
            <Text style={{ color: globalsColors.blue }}>{budgetBase}</Text>
          </Text>
          <Text style={styles.textStatistics}>
            Disponible:{' '}
            <Text style={{ color: globalsColors.blue }}>
              {statistics.available}
            </Text>
          </Text>
          <Text style={styles.textStatistics}>
            Gastado:{' '}
            <Text style={{ color: globalsColors.blue }}>
              {statistics.spent}
            </Text>{' '}
          </Text>
        </View>

        <View style={styles.containerList}>
          <SwipeableFlatList
            data={expenditures}
            renderItem={({ item }) => (
              <View style={styles.renderItem}>
                <Text style={styles.renderItemsText}>{item.title}</Text>
                <Text style={styles.renderItemsText}>{item.amount}$</Text>
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

        <FloatAddIcon handlePress={() => setModalNewExpent(true)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stylesCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 18,
  },
  separator: {
    marginVertical: 20,
  },

  containerDataStatistics: {
    width: '80%',
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 3,
    borderColor: globalsColors.gray,
    borderRadius: 10,
  },
  textStatistics: {
    fontSize: 18,
  },
  containerList: {
    marginTop: 20,
    width: '80%',
    height: 350,
  },
  renderItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  renderItemsText: {
    color: globalsColors.grayDos,
    fontSize: 20,
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

export default HomeScreen;
