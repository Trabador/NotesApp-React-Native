import React from 'react';
import { Text, View, FlatList, ImageBackground, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import {config} from './config';
import {styles} from './AppStyle';
import Note from './Components/Note/Note';
import NoteForm from './Components/NoteForm/NoteForm';
import backgroundImage from './Static/images/background.jpg';

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

    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.updateNote = this.updateNote.bind(this);

    console.ignoredYellowBox = [
      'Setting a timer'
    ];/* should not be use, need to change when firebase team comes with a solution to 
      "Setting a timer for a long period ...." issue wiht android platform*/
  }


  componentWillMount(){
    this.addNotesListener();
    this.deleteNotesListener();
    this.updateNotesListener();
  }

  addNotesListener(){
    this.databaseRef.child('notes').on('child_added', (snapshot) => {
      let note = {data: snapshot.val(), id: snapshot.key};
      this.setState({
        noteList: this.state.noteList.concat(note)
      });
    });
  }

  deleteNotesListener(){
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
  }

  updateNotesListener(){
    this.databaseRef.child('notes').on('child_changed', (snapshot) => {
      let aux = this.state.noteList;
      for(let i=0; i<aux.length; i++){//serach for the note to update
        if(aux[i].id === snapshot.key){
          aux[i].data = snapshot.val();
          break;
        }
      }
      this.setState({noteList: aux, editnoteID: null, action: 'add', editMessage: ''});
    });
  }


  _renderItem = ({item}) => (
    <Note 
      message={item.data.message} id={item.id}  
      removeNote={this.removeNote}
      editNote={this.editNote}
    />
  );

  _keyExtractor = (item, index) => item.id;

  displayNotes(){
    return(
        <View style={styles.notesDisplay}>
        <FlatList
          data={this.state.noteList}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        </View>
    );
  }

  addNote(newRecord){
    const newNote = this.databaseRef.child('notes').push();
    newNote.set(newRecord);
    ToastAndroid.showWithGravity(
      'Nota Agregada',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  }

  removeNote(noteID){
    const notesRef = this.databaseRef.child('notes');
    const childToRemove= notesRef.child(noteID);
    childToRemove.remove()
      .then(
        () => {console.log(`child removed: ${noteID}`)},
        ToastAndroid.showWithGravity(
          'Nota Eliminada',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
      )
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
        .then(
          () => {this.setState({editnoteID: null, action: 'add', editMessage: ''})},
          ToastAndroid.showWithGravity(
            'Nota Actualizada',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          )
        )
        .catch((error) => {console.log(`Error ${error.code}: ${error.message}`)});
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior= "padding"
        style={styles.container}
      >
        <ImageBackground 
          style={styles.container}
          source={backgroundImage}
        >
            <View 
              style={styles.notesHeader}
            >
              <Text style={styles.headerText}>Notes in React</Text>
            </View>
            {this.displayNotes()}
            <View 
              style = {styles.notesForm}
            >
              <NoteForm 
                addNote={this.addNote} updateNote={this.updateNote} 
                action={this.state.action} message={this.state.editMessage}
                noteID={this.state.editnoteID}
              />
            </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}


