import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";

class AddShul extends Component {
  constructor(props) {
      super(props);
      this.state = {

      };
  }

  render() {
    return (
      <div>
        <h1>---Add Shul Goes Here---</h1>
      </div>
    );
  }
}

export default withLocalize(AddShul);
