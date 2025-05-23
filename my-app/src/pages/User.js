import React, { useState, useEffect } from 'react';
import VersionApp from '../components/VersionApp';
import Layout from '../components/Layout';
import { getAvatarUser, getFirstNameUser, getLastNameUser, getToken, getUserEmail, getUserId } from '../utils/manageStorage';
import { Sheet } from 'react-modal-sheet';
import { register, logIn } from '../services/authService';
import { deleteUser, updatePassword, updateUser } from '../services/userService';
import GoogleLoginButton from "../components/GoogleLoginButton";

const User = () => {

    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [nom, setNom] = useState(null);
    const [prenom, setPrenom] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const [isOpenRegister, setOpenRegister] = useState(false);
    const [isOpenUpdate, setOpenUpdate] = useState(false);
    const [isOpenPassword, setOpenPassword] = useState(false);
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

    const [newNom, setNewNom] = useState('');
    const [newPrenom, setNewPrenom] = useState('');
    const [newAdresse, setNewAdresse] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [errorNew, setErrorNew] = useState(null);

    const avatarList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState(null);

    const handleRegister = async (e) => {
        setRegisterError(null);
        e.preventDefault();
        try {
            await register(registerData);
            setOpenRegister(false);
            setRegisterError(null);
            setTrigger(prev => !prev);
        } catch (err) {
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

    const handleUpdate = async (e) => {
        setErrorNew(null);
        e.preventDefault();
        try {
            if (selectedAvatar) {
                localStorage.setItem('avatar', selectedAvatar.toString())
                setAvatar(selectedAvatar)
            }

            if (newEmail) {
                localStorage.setItem('email', newEmail)
                setEmail(newEmail)
            }

            if (newNom) {
                localStorage.setItem('nom', newNom)
                setNom(newNom)
            }

            if (newPrenom) {
                localStorage.setItem('prenom', newPrenom)
                setPrenom(newPrenom)
            }

            const userId = await getUserId()
            await updateUser(userId, newEmail, newPrenom, newNom, selectedAvatar)
            setOpenUpdate(false);
            setErrorNew(null);
        } catch (err) {
            setErrorNew(err);
        }
    }

    const handleUpdatePassword = async (e) => {
        setErrorPassword(null)
        e.preventDefault();
        try {
            const idUser = await getUserId();
            await updatePassword(idUser, newPassword1, newPassword);
            setOpenPassword(false);
            setErrorPassword(null);
        } catch (err) {
            setErrorPassword(err);
        }
    }

    const handleDeleteUser = async () => {
        const idUser = await getUserId();
        await deleteUser(idUser);
        localStorage.clear()
        setToken(null);
    }

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

    const handleLoginSuccess = (response) => {
        // Ici tu peux envoyer le token (response.credential) au backend par exemple
        console.log("Token reçu:", response.credential);
    };

    return (
        <Layout>
            <div style={{ padding: "20px" }}>
                {
                    token ? (
                        <div>

                            <div className="container_user_ava">
                                {avatar && (

                                    <img
                                        src={`./assets/user/${avatar}.jpeg`}
                                        alt="Avatar utilisateur"

                                    />
                                )}
                                <h3>{nom} - {prenom}</h3>
                                <h3>{email}</h3>
                            </div>
                            <div className="container_buttons_user">
                                <button className='general_btn w100' onClick={() => setOpenUpdate(true)}>Modifier votre profil</button>

                                <button className='general_btn w100' onClick={() => setOpenPassword(true)}>Modifier mot de passe</button>

                                <button className='del_btn w100' onClick={() => handleDeleteUser()}>Supprimer mon compte</button>

                                <button className='cancel_btn w100' onClick={() => {
                                    localStorage.clear()
                                    setToken(null)
                                }}>Se déconnecter</button>
                            </div>


                            <Sheet isOpen={isOpenUpdate} onClose={() => {
                                setOpenUpdate(false);
                                setErrorNew(null);
                            }}>
                                <Sheet.Container>
                                    <Sheet.Header />
                                    <Sheet.Content>
                                        <Sheet.Scroller>
                                            <div style={{ padding: "20px" }}>
                                                <h3 style={{ marginBottom: "40px" }}>Modifier votre profil</h3>
                                                <form onSubmit={handleUpdate}>
                                                    <label>Nouveau nom</label>
                                                    <input
                                                        className='general_input'
                                                        type="text"
                                                        value={newNom}
                                                        onChange={(e) => setNewNom(e.target.value)}
                                                        style={{ marginBottom: '20px' }}
                                                    />

                                                    <label>Nouveau prénom</label>
                                                    <input
                                                        className='general_input'
                                                        type="text"
                                                        value={newPrenom}
                                                        onChange={(e) => setNewPrenom(e.target.value)}
                                                        style={{ marginBottom: '20px' }}
                                                    />

                                                    <label>Nouvelle adresse</label>
                                                    <input
                                                        className='general_input'
                                                        type="text"
                                                        value={newAdresse}
                                                        onChange={(e) => setNewAdresse(e.target.value)}
                                                        style={{ marginBottom: '20px' }}
                                                    />

                                                    <label>Nouvelle adresse email</label>
                                                    <input
                                                        className='general_input'
                                                        type="email"
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                        style={{ marginBottom: '20px' }}
                                                    />

                                                    <label>Nouvelle image de profil</label>
                                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: "10px", marginBottom: "40px" }}>
                                                        {avatarList.map((avatarId) => (
                                                            <img
                                                                key={avatarId}
                                                                src={`/assets/user/${avatarId}.jpeg`}
                                                                alt={`Avatar ${avatarId}`}
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    borderRadius: '50%',
                                                                    border: selectedAvatar === avatarId ? '4px solid #FFCE10' : '1px solid #ccc',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => setSelectedAvatar(avatarId)}
                                                            />
                                                        ))}
                                                    </div>

                                                    <button className='general_btn' type="submit">Modifier profil</button>
                                                    <button style={{ marginBottom: "40px", marginLeft: "20px" }} className='cancel_btn' type="button" onClick={() => setOpenUpdate(false)}>Annuler</button>



                                                    {errorNew && <p className='error_lab'>{errorNew}</p>}
                                                </form>
                                            </div>
                                        </Sheet.Scroller>
                                    </Sheet.Content>
                                </Sheet.Container>
                                <Sheet.Backdrop />
                            </Sheet>

                            <Sheet isOpen={isOpenPassword} onClose={() => {
                                setOpenPassword(false);
                                setErrorPassword(null);
                            }}>
                                <Sheet.Container>
                                    <Sheet.Header />
                                    <Sheet.Content>
                                        <div style={{ padding: "20px" }}>


                                            <h3 style={{ marginBottom: '40px' }}>   Modifier votre mot de passe</h3>

                                            <form onSubmit={handleUpdatePassword}>
                                                <label>Nouveau mot de passe</label>
                                                <input
                                                    className='general_input'
                                                    type="password"
                                                    value={newPassword1}
                                                    onChange={(e) => setNewPassword1(e.target.value)}
                                                    style={{ marginBottom: "20px" }}
                                                />

                                                <label>Confirmer le nouveau mot de passe</label>
                                                <input
                                                    className='general_input'
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    style={{ marginBottom: "40px" }}
                                                />

                                                <button className='general_btn' type="submit">Modifier mot de passe</button>
                                                <button style={{ marginLeft: "20px" }} className='cancel_btn' type="button" onClick={() => setOpenPassword(false)}>Annuler</button>

                                                {errorPassword && <p className='error_lab'>{errorPassword}</p>}
                                            </form>
                                        </div>
                                    </Sheet.Content>
                                </Sheet.Container>
                                <Sheet.Backdrop />
                            </Sheet>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ textAlign: 'center' }}>Connectez-vous à{'\n'}votre compte ici</h2>

                            <div className='oauth_btn'>
                                <button className='cancel_btn w100 alignCenter' style={{ backgroundColor: 'white' }}>
                                    <img src="./assets/microsoft.png" alt="" />
                                </button>

                                <div className='w100'>
                                    <GoogleLoginButton onSuccess={handleLoginSuccess} />
                                </div>

                            </div>

                            <p style={{ color: 'grey', marginBottom: "40px", marginTop: "20px", textAlign: "center" }}>Ou avec votre identifiant et mot de passe</p>

                            <form onSubmit={handleLogin}>
                                <label>Email du compte</label>
                                <input
                                    className='general_input'
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    style={{ marginBottom: "20px" }}
                                />
                                <label>Mot de passe</label>
                                <input
                                    className='general_input'
                                    type="password"
                                    value={loginData.mot_de_passe}
                                    onChange={(e) => setLoginData({ ...loginData, mot_de_passe: e.target.value })}
                                    style={{ marginBottom: "20px" }}
                                />
                                <button style={{ marginBottom: "20px" }} className='general_btn w100' type="submit">Se connecter</button>
                                {loginError && <p className='error_lab'>{loginError}</p>}
                            </form>

                            <p style={{ color: 'grey', marginBottom: "40px", marginTop: "20px", textAlign: "center" }}>Ou bien ...</p>


                            <button className='w100 general_btn' onClick={() => setOpenRegister(true)}>S'enregistrer</button>

                            <Sheet isOpen={isOpenRegister} onClose={() => {
                                setOpenRegister(false);
                                setRegisterError(null);
                            }}>
                                <Sheet.Container>
                                    <Sheet.Header />
                                    <Sheet.Content>
                                        <Sheet.Scroller>
                                            <div style={{ padding: '20px' }}>
                                                <h3 style={{ marginBottom: "40px" }}>Créer votre compte</h3>
                                                <form onSubmit={handleRegister}>
                                                    <label>Nom</label>
                                                    <input style={{ marginBottom: '20px' }} className='general_input' type="text" value={registerData.nom} onChange={e => setRegisterData({ ...registerData, nom: e.target.value })} />

                                                    <label>Prénom</label>
                                                    <input style={{ marginBottom: '20px' }} className='general_input' type="text" value={registerData.prenom} onChange={e => setRegisterData({ ...registerData, prenom: e.target.value })} />

                                                    <label>Adresse</label>
                                                    <input style={{ marginBottom: '20px' }} className='general_input' type="text" value={registerData.adresse} onChange={e => setRegisterData({ ...registerData, adresse: e.target.value })} />

                                                    <label>Email</label>
                                                    <input style={{ marginBottom: '20px' }} className='general_input' type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />

                                                    <label>Mot de passe</label>
                                                    <input style={{ marginBottom: '40px' }} className='general_input' type="password" value={registerData.mot_de_passe} onChange={e => setRegisterData({ ...registerData, mot_de_passe: e.target.value })} />

                                                    <button className='general_btn' type="submit">S'enregistrer</button>
                                                    <button style={{ marginLeft: '20px' }} className='cancel_btn' type="button" onClick={() => setOpenRegister(false)}>Annuler</button>

                                                    {registerError && <p className='error_lab'>{registerError}</p>}
                                                    <div style={{ padding: "200px 0" }}></div>
                                                </form>
                                            </div>
                                        </Sheet.Scroller>
                                    </Sheet.Content>
                                </Sheet.Container>
                                <Sheet.Backdrop />
                            </Sheet>
                        </div>
                    )
                }

                <div className="containe_nett">
                    <VersionApp />

                    <p>Un problème ?</p>

                    <button className='cancel_btn w100' onClick={() => localStorage.clear()}>Netoyer le cache</button>
                </div>
            </div>
        </Layout >
    );
};

export default User;