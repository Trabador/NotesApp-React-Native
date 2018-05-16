import React from 'react';
import { StyleSheet, Text, View, List, FlatList, ScrollView } from 'react-native';
import firebase from 'firebase';
import {config} from './config';
import Note from './Components/Note/Note';
import NoteForm from './Components/NoteForm/NoteForm';

export default class App extends React.Component {
  constructor(){
    super();

    this.state = {
      editnoteID: null,
      action: 'add',
      editMessage : '',
      noteList: []
    };

    firebase.initializeApp(config);
    this.databaseRef = firebase.database().ref();

    this.displayNotes = this.displayNotes.bind(this);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
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
      <ScrollView>
        
          {this.state.noteList.map(note => {
            return(
              <Note 
                message={note.data.message} id={note.id} key={note.id} 
                removeNote={this.removeNote}
                editNote={this.editNote}
              />
            )
          })}
        
      </ScrollView>
    );
  }

  addNote(newRecord){
    const newNote = this.databaseRef.child('notes').push();
    newNote.set(newRecord);
  }

  removeNote(noteID){
    const notesRef = this.databaseRef.child('notes');
    const childToRemove= notesRef.child(noteID);
    childToRemove.remove()
      .then(() => {console.log(`child removed: ${noteID}`);})
      .catch(error => {console.log(`Error ${error.code}: ${error.message}`);});
  }

  editNote(noteID){
    const notesRef = this.databaseRef.child('notes');
    const childToEdit = notesRef.child(noteID);
    childToEdit.once('value', snapshot => {
      let message = snapshot.val().message;
      this.setState({action: 'edit', editMessage: message, editnoteID: noteID});
    });
  }

  updateNote(newData){
    if(newData.id !== null){
      const childToUpdate = this.databaseRef.child('notes').child(newData.id);
      childToUpdate.update({message: newData.newMessage})
        .then(() => {this.setState({editnoteID: null, action: 'add', editMessage: ''})})
        .catch((error) => {console.log(`Error ${error.code}: ${error.message}`)});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Notes in React</Text>
        {this.displayNotes()}
        <NoteForm 
          addNote={this.addNote} updateNote={this.updateNote} 
          action={this.state.action} message={this.state.editMessage}
          noteID={this.state.editnoteID}
        />
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
