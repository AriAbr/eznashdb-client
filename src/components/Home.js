import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from "react-localize-redux";
import logo from '../logo.svg';

class Home extends Component {
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
        ---HOME WILL GO HERE---
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withLocalize(Home);
