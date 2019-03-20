import React, { Component } from 'react';
import AceEditor from 'react-ace';
import axios from "axios";

import 'brace/mode/python';
import 'brace/theme/xcode';

//IMPORT SEMANTIC UI
import {Button, Icon} from "semantic-ui-react";

//IMPORT JS
import {updateValue, returnCode, userInput} from "../assets/js/popOutText";

class textEditor extends Component {
    state = {
        output: ""
    }
    
    handleChange = (code) =>{
        updateValue(code);
    }
    //will handle submission of code written
    handleRun = () =>{
        const code = {
            code: returnCode(),
            input: userInput(returnCode())

        }
        console.log("HERE ",code.input);
        axios.post("http://localhost:5000/run", {code})
        .then(res =>{
            const output = res.data;
            //UPDATES WHAT WILL BE DISPLAY OJN CONSOLE
            this.setState({output});
        })
    }
    render() { 
        return (
            <React.Fragment>
                  <AceEditor
                    className = "editor"
                    fontSize = {18}
                    value = {returnCode()}
                    mode="python"
                    theme="xcode"
                    onChange={this.handleChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                  />
                  <div className = "buttonRun">
                    <Button animated className = "runPlay" onClick = {() => this.handleRun()}>
                        <Button.Content visible>
                            <Icon name='pause' />
                        </Button.Content>
                        <Button.Content hidden>
                            <Icon name='play' />
                        </Button.Content>
                    </Button>
                  </div>
               
                  <textarea className = "console" type ="text" name = "comment" 
                 placeholder={this.state.output}/>
                 
            </React.Fragment>
          );
    }
}
 
export default textEditor;