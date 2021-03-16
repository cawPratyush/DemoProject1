import React, { Component } from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/mode/python'
import 'brace/theme/monokai'
import 'brace/theme/textmate'
import 'brace/theme/twilight'
export class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
             mode:'python',
             theme:'monokai'
        }
    } 
    componentDidUpdate(){
        console.log(this.state)
    }
    changeHandler=()=>{
        // alert("change detected")
        this.setState({
            mode:document.getElementById("mySelect").value
        })
    }
    changeHandlerTheme=()=>{
        this.setState({
            theme:document.getElementById("mySelectTheme").value
        })
    } 
    render() {
        return (
            <div>
            <select onChange={this.changeHandler} id="mySelect">
                <option>python</option>
                <option>javascript</option>
            </select>
            <select onChange={this.changeHandlerTheme} id="mySelectTheme">
                <option>monokai</option>
                <option>textmate</option>
                <option>twilight</option>
            </select>
            <AceEditor mode={this.state.mode} theme={this.state.theme} className="wrapper" />
            </div>
        )
    }
}

export default Editor
