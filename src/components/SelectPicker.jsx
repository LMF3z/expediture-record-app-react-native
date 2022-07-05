import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import globalsStyles, { globalsColors } from '../globals/theme';

const SelectPicker = (props) => {
  const { handleSelectOption, data, handleClose } = props;

  return (
    <View
      style={[
        globalsStyles.container,
        { paddingHorizontal: '10%', backgroundColor: globalsColors.gray },
      ]}
    >
      <View style={styles.containerOptions}>
        {data.map((cat) => (
          <View style={styles.option} key={cat.id}>
            <Text
              onPress={() => {
                handleSelectOption(cat.title);
                handleClose();
              }}
            >
              {cat.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerOptions: {
    width: '100%',
    minHeight: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  option: {
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export default SelectPicker;
