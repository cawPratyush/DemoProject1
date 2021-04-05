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
      mode: 'python',
      theme: 'monokai',
      output: '',
      input: '',
      languageCode: 71,
      outputfinal: ''
    }
    this.clickHandler = this.clickHandler.bind(this)
  }
  componentDidUpdate() {
    console.log(this.state)
  }
  changeHandler = () => {



    // alert("change detected")
    this.setState({
      mode: document.getElementById("mySelect").value
    })
    if (document.getElementById("mySelect").value === "python") {
      this.setState({
        languageCode: 71

      })

    }
    if (document.getElementById("mySelect").value === "javascript") {
      this.setState({
        languageCode: 63

      })

    }
  }
  changeHandlerTheme = () => {
    this.setState({
      theme: document.getElementById("mySelectTheme").value
    })
  }
  clickHandler = async () => {
    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "0289fd5497msh6e1c7b0ddc2d92bp17e800jsn601d197dbee7", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: this.state.output,
          stdin: this.state.input,
          language_id: this.state.languageCode,
        }),
      }
    );
    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    console.log(jsonResponse)
    //   Token part 
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;

      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "0289fd5497msh6e1c7b0ddc2d92bp17e800jsn601d197dbee7", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
            "content-type": "application/json",
          },
        });

        jsonGetSolution = await getSolution.json();
      }

    }
    console.log(jsonGetSolution)
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      outputText.innerHTML = "";
      outputText.innerHTML += `Results : <br />  ${output} <br/> Execution Time : ${jsonGetSolution.time}  Secs <br/>Memory used : ${jsonGetSolution.memory} bytes`;
      console.log(output)
    }
    else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${error}`;

    }
    else {
      const compilation_error = atob(jsonGetSolution.compile_output);

      outputText.innerHTML = "";

      outputText.innerHTML += `\n Error :${compilation_error}`;
    }


  }
  onChangeACE = (e) => {
    this.setState({
      output: e
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
        <AceEditor onChange={this.onChangeACE} mode={this.state.mode} theme={this.state.theme} className="wrapper" />
        <button onClick={this.clickHandler} className="runbutton">Run</button>
        <div className="output"><h3>OUTPUT :</h3> <h4 id="output"> </h4>  </div>
      </div>
    )
  }
}

export default Editor
