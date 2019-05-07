import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import axios from "axios";

import 'brace/mode/python';
import 'brace/theme/xcode';

//IMPORT SEMANTIC UI
import {Button, Icon, Grid} from "semantic-ui-react";

//IMPORT JS
import {updateValue, returnCode, userInput} from "../assets/js/popOutText";
import {getOutput, checkSucess} from "../assets/js/textAnimation";

class textEditor extends Component {
    state = {
        output: "",
        realOutput: "",
        outputPass: ""
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
        axios.post( this.props.ip + "run", {code})
        .then(res =>{
            axios.get( this.props.ip + "output")   //output
            .then(res => {
                const realOutput = res.data;
                let output = res.data;
                let expectedOutPut = getOutput();

                expectedOutPut = expectedOutPut.split(' ').join('');
                output = output.split(' ').join('');
                expectedOutPut = expectedOutPut.split('\n').join('');
                output = output.split('\n').join('');
                console.log("EXPECTED OUTPUT: ", expectedOutPut);
                console.log("OUTPUT: ", res.data)
                console.log(expectedOutPut, "===", output);        
                if(expectedOutPut.replace(' ', '') === output.replace(' ', '')){
                    checkSucess(true);
                }
                else{
                    checkSucess(false);
                }
                this.setState({realOutput});
            })
        })
    }

    handleKill = () =>{
        axios.get( this.props.ip + "kill")
        .then(res=>{
            console.log("KILLED PROGRAM");
        })
    }
    render() { 
        return (
            <React.Fragment>
                <div className = "leftSide">
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
                        <Grid columns= "equal">
                            <Grid.Column width = {8}>
                                <Button id = "playButton" className = "runPlay" onClick = {() => this.handleRun()}>
                                    <Button.Content hidden>
                                        <Icon name='play' />
                                    </Button.Content>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width = {8}>
                                <Button id = "playButton" className = "runPause" onClick = {() => this.handleKill()}>
                                    <Button.Content hidden>
                                        <Icon name='pause' />
                                    </Button.Content>
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </div>
                
                    <textarea readOnly className = "console" type ="text" name = "comment" value={this.state.realOutput}>
                        
                    </textarea>
                </div>            

            </React.Fragment>
          );
    }
}
 
export default textEditor;
