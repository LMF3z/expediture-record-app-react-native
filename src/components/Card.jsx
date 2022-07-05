import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Card = ({ children, containerStyles }) => {
  return (
    <View style={[styles.containerCard, containerStyles]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  containerCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#0d0d0d',
    elevation: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
});

export default Card;
