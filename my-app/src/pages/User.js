import React, { useState, useEffect } from 'react';
import VersionApp from '../components/VersionApp';
import Layout from '../components/Layout';
import { getAvatarUser, getFirstNameUser, getLastNameUser, getToken, getUserEmail } from '../utils/manageStorage';
import { Sheet } from 'react-modal-sheet';
import { register, logIn } from '../services/authService';

const User = () => {

    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [nom, setNom] = useState(null);
    const [prenom, setPrenom] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const [isOpen, setOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const [registerData, setRegisterData] = useState({
        nom: '',
        prenom: '',
        adresse: '',
        email: '',
        mot_de_passe: '',
        role: 1,
        typeConnect: 'classique'
    });
    const [registerError, setRegisterError] = useState(null);

    const [loginData, setLoginData] = useState({
        email: '',
        mot_de_passe: ''
    });
    const [loginError, setLoginError] = useState(null);

    const handleRegister = async (e) => {
        setRegisterError(null);
        e.preventDefault();
        try {
            await register(registerData);
            setOpen(false);
            setRegisterError(null);
            setTrigger(prev => !prev);
        } catch (err) {
            console.error(err);
            setRegisterError(err);
        }
    };

    const handleLogin = async (e) => {
        setLoginError(null);
        e.preventDefault();
        try {
            const res = await logIn(loginData);
            setLoginError(null);
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('email', res.email);
            localStorage.setItem('prenom', res.prenom);
            localStorage.setItem('nom', res.nom);
            localStorage.setItem('avatar', res.avatar == null ? 'null' : res.avatar.toString())
            localStorage.setItem('userId', res.id)
            setToken(res.accessToken);
            setEmail(res.email);
            setNom(res.nom);
            setPrenom(res.prenom);
            setAvatar(res.avatar == null ? 'null' : res.avatar.toString());
            setTrigger(prev => !prev); // pour déclencher le useEffect
        } catch (err) {
            console.error(err);
            setLoginError(err);
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken()
            const email = await getUserEmail()
            const prenom = await getFirstNameUser()
            const nom = await getLastNameUser()
            const avatar = await getAvatarUser()

            setToken(token)
            setEmail(email)
            setNom(nom)
            setPrenom(prenom)
            setAvatar(avatar)
        }

        fetchToken()
    }, [trigger])

    return (
        <Layout>
            <div>
                {
                    token ? (
                        <div>
                            <p>vous etes connecté</p>
                            <h1>Token: {token}</h1>
                            <button onClick={() => setToken(null)}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <h2>Connectez-vous à{'\n'}votre compte ici</h2>

                            <button>microsoft</button>
                            <button>google</button>

                            <p>Ou avec votre identifiant et mot de passe</p>

                            <form onSubmit={handleLogin}>
                                <label>Email du compte</label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    value={loginData.mot_de_passe}
                                    onChange={(e) => setLoginData({ ...loginData, mot_de_passe: e.target.value })}
                                />
                                <button type="submit">Se connecter</button>
                                {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                            </form>

                            <button onClick={() => setOpen(true)}>S'enregistrer</button>

                            <VersionApp />

                            <p>Un problème ?</p>

                            <button>Netoyer le cache</button>

                            <Sheet isOpen={isOpen} onClose={() => {
                                setOpen(false);
                                setRegisterError(null);
                            }}>
                                <Sheet.Container>
                                    <Sheet.Header />
                                    <Sheet.Content>
                                        <form onSubmit={handleRegister}>
                                            <label>Nom</label>
                                            <input type="text" value={registerData.nom} onChange={e => setRegisterData({ ...registerData, nom: e.target.value })} />

                                            <label>Prénom</label>
                                            <input type="text" value={registerData.prenom} onChange={e => setRegisterData({ ...registerData, prenom: e.target.value })} />

                                            <label>Adresse</label>
                                            <input type="text" value={registerData.adresse} onChange={e => setRegisterData({ ...registerData, adresse: e.target.value })} />

                                            <label>Email</label>
                                            <input type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />

                                            <label>Mot de passe</label>
                                            <input type="password" value={registerData.mot_de_passe} onChange={e => setRegisterData({ ...registerData, mot_de_passe: e.target.value })} />

                                            <button type="submit">S'enregistrer</button>
                                            <button type="button" onClick={() => setOpen(false)}>Annuler</button>

                                            {registerError && <p style={{ color: 'red' }}>{registerError}</p>}
                                        </form>
                                    </Sheet.Content>
                                </Sheet.Container>
                                <Sheet.Backdrop />
                            </Sheet>

                        </div>
                    )
                }
            </div>
        </Layout >
    );
};

export default User;