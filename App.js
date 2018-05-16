import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import {config} from './config';
import Note from './Components/Note/Note';



export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      editnoteID: null,
      action: 'add',
      editMessage : '',
      noteList: []
    };

    firebase.initializeApp(config);
    this.databaseRef = firebase.database().ref();
  }

  componentWillMount(){
    //Show Notes 
    this.databaseRef.child('notes').on('child_added', (snapshot) => {
      let note = {data: snapshot.val(), id: snapshot.key};
      this.setState({
        noteList: this.state.noteList.concat(note)
      });
    });

    //Delete Note
    this.databaseRef.child('notes').on('child_removed', (snapshot) => {
      let aux = this.state.noteList;
      for(let i=0; i<aux.length; i++){ //search for the note deleted
        if(aux[i].id === snapshot.key){ 
          aux.splice(i,1);
          break;
        }
      }
      this.setState({noteList: aux, editnoteID: null, action: 'add', editMessage: ''});
    });

    //Update Note
    this.databaseRef.child('notes').on('child_changed', (snapshot) => {
      let aux = this.state.noteList;
      for(let i=0; i<aux.length; i++){
        if(aux[i].id === snapshot.key){
          aux[i].data = snapshot.val();
          break;
        }
      }
      this.setState({noteList: aux, editnoteID: null, action: 'add', editMessage: ''});
    });
  }

  displayNotes(){
    return(
      this.state.noteList.map(note => {
        return(<Note message={note.data.message} id={note.id} key={note.id} />
        )
      })
    );
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Notes in React</Text>
        {this.displayNotes()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
