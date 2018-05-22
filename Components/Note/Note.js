import React from 'react';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import deleteIcon from '../../Static/images/delete.png';
import editIcon from '../../Static/images/edit.png';
import {noteStyles} from './NoteStyle';

class Note extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            message: this.props.message
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(this.state.message !== nextProps.message){
            this.setState({message: nextProps.message});
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return(this.state.message !== nextState.message);
    }

    handleEdit(){
        const noteID = this.state.id;
        this.props.editNote(noteID);
    }

    handleRemove(){
        const noteID = this.state.id;
        this.props.removeNote(noteID);
    }

    render(){
        return(
            <View style={noteStyles.noteContainer}>
                <Text style={noteStyles.textContainer}>{this.state.message}</Text>
                <TouchableHighlight 
                    style={noteStyles.imageContainer}
                    onPress={this.handleEdit}
                >
                    <Image
                        style={noteStyles.imageContainer}
                        source={editIcon}
                    />
                </TouchableHighlight>
                <View style={noteStyles.buttonsContainer}>
                    <TouchableHighlight 
                        style={noteStyles.imageContainer}
                        onPress={this.handleRemove}
                    >
                        <Image
                            source={deleteIcon}
                        />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

export default Note;
