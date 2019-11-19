import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from "react-localize-redux";
import logo from '../logo.svg';

class APITest extends Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {

    var directionStyling = {
      direction: 'ltr',
      textAlign: 'left'
    }

    if (this.props.activeLanguage && this.props.activeLanguage.code === "he") {
      directionStyling = {
        direction: 'rtl',
        textAlign: 'right'
      }
    }

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

APITest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withLocalize(APITest);
