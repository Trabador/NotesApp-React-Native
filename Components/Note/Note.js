import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import deleteIcon from '../../Static/images/delete.png';
import editIcon from '../../Static/images/edit.png';

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
            <View>
                <Text>{this.state.message}</Text>
                <TouchableHighlight onPress={this.handleRemove}>
                    <Image
                        source={deleteIcon}
                    />
                </TouchableHighlight>
                <TouchableHighlight onPress={this.handleEdit}>
                    <Image
                        source={editIcon}
                    />
                </TouchableHighlight>
            </View>
        );
    }
}

export default Note;
