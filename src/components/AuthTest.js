import React, {Component} from 'react';
import { withLocalize } from "react-localize-redux";
import GoogleLogin from 'react-google-login';

class AuthTest extends Component {
  constructor(props) {
      super(props);
      this.state = {
        googleAccessToken: null,
        JWTdjangoToken: {},
        userData: null,
      };
      this.responseGoogle = this.responseGoogle.bind(this);
      this.getDjangoToken = this.getDjangoToken.bind(this);
      this.postLoginPlayground = this.postLoginPlayground.bind(this);
  }

  responseGoogle(response){
    console.log(response);
    this.setState({googleAccessToken: response.accessToken}, () => {
      this.getDjangoToken()
    })
  }

  getDjangoToken(e){
    const data = {
			access_token: this.state.googleAccessToken,
		}

    fetch(`${process.env.REACT_APP_DJANGO_API}dj-rest-auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      this.setState({
        JWTdjangoToken: data,
        djAuthToken: data.key,
      }, () => {
        this.postLoginPlayground();
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  postLoginPlayground(){
    console.log("=== POST LOGIN ===")
    fetch(`${process.env.REACT_APP_DJANGO_API}dj-rest-auth/user/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.JWTdjangoToken.access_token}`
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      this.setState({userData: data})
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  render() {
    return (
      <div>
        <div style={{textAlign: "left", overflowWrap: "anywhere"}}>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLOUD_CLIENT_ID}`}
          buttonText="Login"
          onSuccess={(res) => {this.responseGoogle(res)}}
          onFailure={(res) => {this.responseGoogle(res)}}
          cookiePolicy={'single_host_origin'}
        />
          <div><b>Google Access Token:</b> {this.state.googleAccessToken}</div>
          <div><b>JWT Access Token:</b> {this.state.JWTdjangoToken.access_token}</div>
          <div><b>JWT Refresh Token:</b> {this.state.JWTdjangoToken.refresh_token}</div>
          <div><b>User Data:</b> {JSON.stringify(this.state.userData)}</div>
        </div>
      </div>
    );
  }
}

export default withLocalize(AuthTest);
