import { StyleSheet } from 'react-native';

export const noteStyles = StyleSheet.create({
    noteContainer: {
      flex: 1,//ratio 1/1
      backgroundColor: '#eed',
      flexDirection: 'row',
      margin: 5,
      borderRadius: 5
    },
    buttonsContainer: {
        flex: 1,//ratio 1/4
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    imageContainer: {
        padding: 10,
        alignItems: 'center'
    },
    textContainer: {
        flex: 3, //ratio 3/4
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        padding: 10
    }
  });
  