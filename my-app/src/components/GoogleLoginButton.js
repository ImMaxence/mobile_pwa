import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <GoogleOAuthProvider clientId={clientId} >
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log("Login Success:", credentialResponse);
                    onSuccess && onSuccess(credentialResponse);
                }}
                onError={() => {
                    console.log("Login Failed");
                    onError && onError();
                }}

            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
