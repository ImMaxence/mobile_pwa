import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ onSuccess, onError }) => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    try {
                        const token = credentialResponse.credential;
                        const decoded = jwtDecode(token);

                        const userInfo = {
                            email: decoded.email,
                            nom: decoded.family_name,
                            prenom: decoded.given_name,
                            picture: decoded.picture,
                        };

                        console.log("Utilisateur Google :", userInfo);
                        onSuccess && onSuccess(userInfo);
                    } catch (err) {
                        console.error("Erreur de décodage :", err);
                        onError && onError(err);
                    }
                }}
                onError={() => {
                    console.log("Échec de la connexion Google");
                    onError && onError();
                }}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
