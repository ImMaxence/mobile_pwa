import React, { useState, useEffect } from 'react';
import VersionApp from '../components/VersionApp';
import Layout from '../components/Layout';
import { getAvatarUser, getFirstNameUser, getLastNameUser, getToken, getUserEmail, getUserId } from '../utils/manageStorage';
import { Sheet } from 'react-modal-sheet';
import { register, logIn } from '../services/authService';
import { deleteUser, updatePassword, updateUser } from '../services/userService';

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
    const [errorPassword, setErrorPassword] = useState('');

    const handleRegister = async (e) => {
        setRegisterError(null);
        e.preventDefault();
        try {
            await register(registerData);
            setOpenRegister(false);
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

    return (
        <Layout>
            <div>
                {
                    token ? (
                        <div>
                            {avatar && (
                                <img
                                    src={`./assets/user/${avatar}.jpeg`}
                                    alt="Avatar utilisateur"
                                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                />
                            )}
                            <h3>{nom}</h3>
                            <h3>{prenom}</h3>
                            <h3>{email}</h3>

                            <button onClick={() => {
                                localStorage.clear()
                                setToken(null)
                            }}>Se déconnecter</button>

                            <button onClick={() => setOpenUpdate(true)}>Modifier votre profil</button>

                            <button onClick={() => setOpenPassword(true)}>Modifier mot de passe</button>

                            <button onClick={() => handleDeleteUser()}>Supprimer mon compte</button>

                            <Sheet isOpen={isOpenUpdate} onClose={() => {
                                setOpenUpdate(false);
                                setErrorNew(null);
                            }}>
                                <Sheet.Container>
                                    <Sheet.Header />
                                    <Sheet.Content>
                                        <h3>Modifier votre profil</h3>
                                        <form onSubmit={handleUpdate}>
                                            <label>Nouveau nom</label>
                                            <input
                                                type="text"
                                                value={newNom}
                                                onChange={(e) => setNewNom(e.target.value)}
                                            />

                                            <label>Nouveau prénom</label>
                                            <input
                                                type="text"
                                                value={newPrenom}
                                                onChange={(e) => setNewPrenom(e.target.value)}
                                            />

                                            <label>Nouvelle adresse</label>
                                            <input
                                                type="text"
                                                value={newAdresse}
                                                onChange={(e) => setNewAdresse(e.target.value)}
                                            />

                                            <label>Nouvelle adresse email</label>
                                            <input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />

                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                {avatarList.map((avatarId) => (
                                                    <img
                                                        key={avatarId}
                                                        src={`/assets/user/${avatarId}.jpeg`}
                                                        alt={`Avatar ${avatarId}`}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '50%',
                                                            border: selectedAvatar === avatarId ? '3px solid #007bff' : '1px solid #ccc',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => setSelectedAvatar(avatarId)}
                                                    />
                                                ))}
                                            </div>

                                            <button type="submit">Modifier profil</button>
                                            <button type="button" onClick={() => setOpenUpdate(false)}>Annuler</button>

                                            {errorNew && <p style={{ color: 'red' }}>{errorNew}</p>}
                                        </form>
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
                                        Modifier votre mot de passe
                                        <form onSubmit={handleUpdatePassword}>
                                            <label>Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                value={newPassword1}
                                                onChange={(e) => setNewPassword1(e.target.value)}
                                            />

                                            <label>Confirmer le nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />

                                            <button type="submit">Modifier mot de passe</button>
                                            <button type="button" onClick={() => setOpenPassword(false)}>Annuler</button>

                                            {errorPassword && <p style={{ color: 'red' }}>{errorPassword}</p>}
                                        </form>
                                    </Sheet.Content>
                                </Sheet.Container>
                                <Sheet.Backdrop />
                            </Sheet>
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

                            <button onClick={() => setOpenRegister(true)}>S'enregistrer</button>

                            <VersionApp />

                            <p>Un problème ?</p>

                            <button onClick={() => localStorage.clear()}>Netoyer le cache</button>

                            <Sheet isOpen={isOpenRegister} onClose={() => {
                                setOpenRegister(false);
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
                                            <button type="button" onClick={() => setOpenRegister(false)}>Annuler</button>

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