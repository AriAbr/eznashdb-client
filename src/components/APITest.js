import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import logo from '../logo.svg';

class APITest extends Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    return (
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="App-intro">{this.props.apiResponse}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </div>
    );
  }
}

export default withLocalize(APITest);
