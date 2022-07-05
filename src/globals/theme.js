export const globalsColors = {
  blue: '#3376f3',
  gray: '#d6d6d6',
  grayDos: '#0d0d0d',
};

const globalsStyles = {
  container: {
    // borderColor: '#ff0000',
    // borderWidth: 2,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#DDDDDD',
    backgroundColor: globalsColors.blue,
    padding: 10,
    borderRadius: 10,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#0d0d0d',
  },
};

export default globalsStyles;
