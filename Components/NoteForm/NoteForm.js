import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { noteFormStyles } from './NoteFormStyle';

class NoteForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            noteID: this.props.noteID,
            action: this.props.action,
            textContet: ''
        };

        this.renderButton = this.renderButton.bind(this);
        this.handleSendText = this.handleSendText.bind(this);
    }


  componentWillReceiveProps(nextProps){
        if( this.state.action !== nextProps.action ||
            this.state.message !== nextProps.message){
                this.setState({
                    noteID: nextProps.noteID,
                    textContet: nextProps.message,
                    action: nextProps.action
                });
        }
    }

    handleSendText(){
        if(this.state.action === 'add'){
            const newRecord = {
                message: this.state.textContet
            };

            this.props.addNote(newRecord);
        }
        else{
            const newData = {
                id: this.state.noteID,
                newMessage: this.state.textContet
            }

            this.props.updateNote(newData);
        }
        
        this.setState({
            action: 'add',
            textContet: ''
        });
    }

    renderButton(){
        let buttonTitle;
        if(this.state.action === 'add'){
            buttonTitle = 'Agregar'
        }
        else{
            buttonTitle = 'Actualizar'
        }
        return(
            <View>
                <TextInput 
                    style={noteFormStyles.textStyle}
                    value={this.state.textContet}
                    placeholder='Escribe una nueva nota aquí...'
                    onChangeText={(text) => this.setState({textContet: text})}
                />
                <Button 
                    style={noteFormStyles.buttonStyle}
                    title={buttonTitle}
                    onPress={this.handleSendText}
                />
            </View>
        );
    }

    render(){
        return(
            <View>
                {this.renderButton()}
            </View>
        );
    }
}

export default NoteForm;