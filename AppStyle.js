import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1//ratio 1/1
    },
    notesHeader: {
      flex:1,//ratio 1/10
      margin: 5,
      backgroundColor: '#6a6a6b90',//90 is for opacity value
      borderRadius: 5,
      marginTop: 30 
    },
    headerText:{
      textAlign : 'center',
      fontSize: 30,
      color: '#e07a2c'
    },
    notesForm: {
      flex: 2,//ratio 2/10
      flexDirection: 'column',
      margin: 5,
      backgroundColor: '#6a6a6b90',//90 is for opacity value
      borderRadius: 5,
      padding: 10
    },
    notesDisplay: {
      flex: 7,//ratio 7/10
      margin : 5,
    }
});