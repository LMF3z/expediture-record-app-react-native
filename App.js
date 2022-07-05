import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import CreateCategories from './src/screens/CreateCategories';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Gestor de gastos' }}
        />
        <Drawer.Screen
          name="Categories"
          component={CreateCategories}
          options={{ title: 'Categorias' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
