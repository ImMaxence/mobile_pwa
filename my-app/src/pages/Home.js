import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/manageStorage';
import { createGroup, getGroups } from '../services/hiveService';
import { Sheet } from 'react-modal-sheet';
import { useNavigate } from 'react-router-dom';

const defaultAvatar = '/assets/def.png';

const getAvatar = (avatar) => {
    // avatar est censé être un numéro en string ou number (ex: '1', 1)
    // On vérifie si avatar est dans 1..16 et construit le chemin, sinon default
    const avatarNum = parseInt(avatar, 10);
    if (avatarNum >= 1 && avatarNum <= 16) {
        return `/assets/user/${avatarNum}.jpeg`;
    }
    return defaultAvatar;
};

const Home = () => {
    const [trigger, setTrigger] = useState(false);
    const [token, setToken] = useState(null);
    const [group, setGroup] = useState([]);
    const [errorGroup, setErrorGroup] = useState(null);
    const [errorCreate, setErrorCreate] = useState(null);
    const [isOpen, setOpen] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        default: false,
        Nom: '',
        Description: '',
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await getToken();
                setToken(res);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchGroup = async () => {
            try {
                const res = await getGroups();
                setGroup(res);
            } catch (error) {
                setErrorGroup(error.message || 'Erreur lors du chargement des groupes');
            }
        };

        fetchToken();
        fetchGroup();
    }, [trigger]);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setErrorCreate(null);
        try {
            await createGroup(formData);
            setTrigger(!trigger);
            setOpen(false);
        } catch (err) {
            setErrorCreate(err.message || 'Erreur lors de la création');
        }
    };

    return (
        <Layout>
            <div style={{ padding: "20px" }}>
                {token ? (
                    <>
                        {errorGroup && <p style={{ color: 'red' }}>{errorGroup}</p>}

                        {/* Groupes par défaut */}
                        {group
                            .filter((item) => item.default)
                            .map((item) => (
                                <div key={item.id}>
                                    {/* <p>{item.id}</p> */}
                                    <img src="./assets/logo.png" alt="" style={{ width: '64px' }} />
                                    <p>{item.Nom}</p>
                                    <button onClick={() => {
                                        localStorage.setItem("currentGroupId", item.id)
                                        localStorage.setItem("currentGroupType", "solo")
                                        localStorage.setItem("currentGroupName", item.Nom)
                                        navigate('/detail/group')
                                    }}>SEE MORE</button>
                                </div>
                            ))}

                        <h4>Vos groupes</h4>
                        <button onClick={() => setOpen(true)}>Créer un groupe</button>

                        {/* Groupes non par défaut */}
                        {group.filter((item) => !item.default).length === 0 ? (
                            <p>Vous n'avez pas de groupe 🐝</p>
                        ) : (
                            group
                                .filter((item) => !item.default)
                                .map((item) => {
                                    const liste = item.Liste_utilisateur_partage || [];

                                    const img1 = getAvatar(liste[0]?.avatar);
                                    const img2 = getAvatar(liste[1]?.avatar);
                                    const img3 = getAvatar(liste[2]?.avatar);
                                    const img4 = getAvatar(liste[3]?.avatar);

                                    return (
                                        <div key={item.id}>
                                            {/* <p>{item.id}</p> */}
                                            <p>{item.Nom}</p>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={img1}
                                                    alt="avatar 1"
                                                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 5 }}
                                                    onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                                />
                                                <img
                                                    src={img2}
                                                    alt="avatar 2"
                                                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 5 }}
                                                    onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                                />
                                                <img
                                                    src={img3}
                                                    alt="avatar 3"
                                                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 5 }}
                                                    onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                                />
                                                <img
                                                    src={img4}
                                                    alt="avatar 4"
                                                    style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 5 }}
                                                    onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                                />
                                            </div>

                                            <button onClick={() => {
                                                localStorage.setItem("currentGroupId", item.id)
                                                localStorage.setItem("currentGroupType", "group")
                                                localStorage.setItem("currentGroupName", item.Nom)
                                                navigate('/detail/group')
                                            }}>SEE MORE</button>
                                        </div>
                                    );
                                })
                        )}

                        <Sheet
                            isOpen={isOpen}
                            onClose={() => {
                                setOpen(false);
                                setErrorCreate(null);
                            }}
                        >
                            <Sheet.Container>
                                <Sheet.Header />
                                <Sheet.Content>
                                    <h3>Créer un groupe</h3>
                                    <form onSubmit={handleCreateGroup}>
                                        <label>Nom du groupe</label>
                                        <input
                                            type="text"
                                            onChange={(e) => handleInputChange('Nom', e.target.value)}
                                            value={formData.Nom}
                                        />
                                        <label>Description groupe</label>
                                        <textarea
                                            onChange={(e) => handleInputChange('Description', e.target.value)}
                                            value={formData.Description}
                                        ></textarea>

                                        <button type="submit">Créer</button>
                                        <button type="button" onClick={() => setOpen(false)}>
                                            Annuler
                                        </button>

                                        {errorCreate && <p style={{ color: 'red' }}>{errorCreate}</p>}
                                    </form>
                                </Sheet.Content>
                            </Sheet.Container>
                            <Sheet.Backdrop />
                        </Sheet>
                    </>
                ) : (
                    <>
                        <h5>
                            Bienvenue sur l'application Apihive !<br />
                        </h5>
                        <p>Veuillez vous connecter pour accéder à toutes les fonctionnalités 🐝</p>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Home;
