import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login';

const LoginComponent = () => {
  const [loginData, setLoginData] = useState(null);

  const handleGoogleSuccess = async (response:any) => {
    const { tokenId } = response;
    try {
      const res = await axios.post('http://localhost:8080/api/auth/google', { tokenId });
      setLoginData(res.data);
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleFacebookSuccess = async (response:any) => {
    const { accessToken } = response;
    try {
      const res = await axios.post('http://localhost:8080/api/auth/facebook', { accessToken });
      setLoginData(res.data);
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  };

  return (
    <div>
      <h2>Login with Google or Facebook</h2>
      <GoogleLogin
        clientId="266524089188-is2h75iv3mp7363ufomjaolkdpans15s.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={handleGoogleSuccess}
        onFailure={(err) => console.error('Google Login Failed:', err)}
        cookiePolicy={'single_host_origin'}
      />
      <FacebookLogin
        appId="470107509346551"
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFacebookSuccess}
      />
    </div>
  );
};

export default LoginComponent;