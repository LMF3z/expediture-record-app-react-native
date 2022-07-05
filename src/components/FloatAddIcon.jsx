import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { globalsColors } from '../globals/theme';

const FloatAddIcon = ({ handlePress }) => {
  return (
    <TouchableOpacity style={styles.containerButton} onPress={handlePress}>
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerButton: {
    width: 60,
    height: 60,
    right: 20,
    bottom: 20,
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: globalsColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 25,
  },
});

export default FloatAddIcon;
