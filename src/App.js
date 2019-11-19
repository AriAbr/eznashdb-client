import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './css/App.css';
import './css/NavBar.css';
import './css/LanguageControls.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import APITest from './components/APITest';
import { LocalizeProvider } from "react-localize-redux";
import { withLocalize } from "react-localize-redux";

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

  componentDidMount() {
      this.callAPI();
  }

  render() {

    return (
      <LocalizeProvider>
      <Router>

        <div className="App">
          <NavBar />

          <header className="App-header">
            <div className="page-content">
              <Route
                exact path="/"
                render={(props) => <Home {...props}
                  apiResponse={this.state.apiResponse}
                />}
              />
              <Route
                path="/api"
                render={(props) => <APITest {...props}
                  apiResponse={this.state.apiResponse}
                />}
              />
            </div>
          </header>
        </div>
        </Router>

      </LocalizeProvider>
    );
  }
}

export default withLocalize(App);
