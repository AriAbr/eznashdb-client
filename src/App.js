import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        apiResponse: ""
      };
  }

  callAPI() {
    fetch(process.env.REACT_APP_EZNASHDB_API + "testAPI")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }))
          .catch((e) => { this.setState({ apiResponse: "API response not recieved: " + e}) })
  }

  componentWillMount() {
      this.callAPI();
  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p className="App-intro">{this.state.apiResponse}</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
