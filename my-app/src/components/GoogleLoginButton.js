import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { getInfoUserGoogle } from "../services/userService";
import { jwtDecode } from "jwt-decode";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ onSuccess, onError }) => {
    const handleLogin = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;

            // Optionnel : tu peux lire les données du token Google
            const decoded = jwtDecode(token);
            console.log("Token Google décodé :", decoded);


            const { user } = await getInfoUserGoogle(token);




            onSuccess && onSuccess({ user });
        } catch (err) {
            console.error("Erreur lors du login Google :", err);
            onError && onError(err);
        }
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
                onSuccess={handleLogin}
                onError={() => {
                    console.log("Échec de la connexion Google");
                    onError && onError();
                }}

            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
