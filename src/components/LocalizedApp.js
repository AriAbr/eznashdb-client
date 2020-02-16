import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import '../css/App.css';
import '../css/NavBar.css';
import '../css/LanguageControls.css';
import '../css/Home.css';
import '../css/AddShul.css';
import '../css/Search.css';
import '../css/Map.css';
import NavBar from './NavBar';
import Home from './Home';
import APITest from './APITest';
import AddShul from './AddShul';
import Search from './Search';
import Map from './Map';
import { withLocalize } from "react-localize-redux";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

class LocalizedApp extends Component {
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

    var direction = (this.props.activeLanguage && this.props.activeLanguage.code === 'he') ? 'rtl' : 'ltr'
    const theme = createMuiTheme({
      direction: direction,
      typography: {
        fontFamily: [
          "Rubik",
          'sans-serif'
        ].join(','),
      },
      palette: {
        // secondary: {
          // main: "#cee9f2",
          // light: "#ff4081",
          // main: "#f50057",
          // dark: "#c51162",
          // contrastText: "#fff",
        // }
      }
    });

    return (

      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <Router>
            <div className="App">
              <NavBar />
              <div className="page-content">
                <Route
                  exact path="/"
                  render={(props) => <Home {...props}
                  />}
                />
                <Route
                  path="/search"
                  render={(props) => <Search {...props}
                  />}
                />
                <Route
                  path="/map"
                  render={(props) => <Map {...props}
                  />}
                />
                <Route
                  path="/add-shul"
                  render={(props) => <AddShul {...props}
                  />}
                />
                <Route
                  path="/api"
                  render={(props) => <APITest {...props}
                    apiResponse={this.state.apiResponse}
                  />}
                />
              </div>
              <div id='page-content-scroll-buffer'></div>
            </div>
          </Router>
        </ThemeProvider>
      </StylesProvider>

);
  }
}

export default withLocalize(LocalizedApp);


