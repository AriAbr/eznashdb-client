import React, {Component} from 'react';
import { renderToStaticMarkup } from "react-dom/server";
import { BrowserRouter as Router, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { LocalizeProvider } from "react-localize-redux";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";


class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        apiResponse: "",
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
      <LocalizeProvider>
      <Router>

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
        </Router>

      </LocalizeProvider>
    );
  }
}

export default withLocalize(App);
