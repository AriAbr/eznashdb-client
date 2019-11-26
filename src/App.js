import React, {Component} from 'react';
import LocalizedApp from './components/LocalizedApp';
import { LocalizeProvider } from "react-localize-redux";
import { withLocalize } from "react-localize-redux";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {

    return (
      <LocalizeProvider>
        <LocalizedApp />
      </LocalizeProvider>
    );
  }
}

export default withLocalize(App);
