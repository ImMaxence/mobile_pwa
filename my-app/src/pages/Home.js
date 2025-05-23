import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/manageStorage';
import { createGroup, getGroups } from '../services/hiveService';
import { Sheet } from 'react-modal-sheet';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';
import { MdGroups } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { Avatar } from 'antd';


// const defaultAvatar = '/assets/def.png';

const getAvatar = (avatar) => {

    const avatarNum = parseInt(avatar, 10);
    if (avatarNum >= 1 && avatarNum <= 16) {
        return `/assets/user/${avatarNum}.jpeg`;
    }
    return null;
};

const Home = () => {
    const [trigger, setTrigger] = useState(false);
    const [token, setToken] = useState(null);
    const [group, setGroup] = useState([]);
    const [errorGroup, setErrorGroup] = useState(null);
    const [errorCreate, setErrorCreate] = useState(null);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingGroupsNonDefaut, setIsLoadingGroupsNonDefaut] = useState(false);


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
        const fetchData = async () => {
            // Ne gère QUE les loaders côté useEffect,
            // et surtout ne touche pas à isLoading ici au refresh
            if (!trigger) {
                // chargement initial → loader global
                setIsLoading(true);
                setIsLoadingGroupsNonDefaut(false);
            }
            // au refresh, on part du principe que isLoadingGroupsNonDefaut est déjà true
            // donc pas besoin de le remettre à true ici

            try {
                const resToken = await getToken();
                setToken(resToken);

                const resGroups = await getGroups();
                setGroup(resGroups);

                // Ton code ruches ici
                const ruchesMap = new Map();

                resGroups.forEach(group => {
                    const proprietaire = group.Liste_utilisateur_partage[0];
                    group.Liste_ruche.forEach(ruche => {
                        ruchesMap.set(ruche.id, {
                            id: ruche.id,
                            nom: ruche.nom,
                            latitude: ruche.latitude,
                            longitude: ruche.longitude,
                            proprietaire_nom: proprietaire ? `${proprietaire.prenom} ${proprietaire.nom}` : null,
                        });
                    });
                });

                const updatedRuches = Array.from(ruchesMap.values());
                localStorage.setItem('ruches_localisees', JSON.stringify(updatedRuches));

                setErrorGroup(null);
            } catch (err) {
                setErrorGroup(err.message || "Erreur lors du chargement");
            } finally {
                if (!trigger) {
                    // Fin du chargement initial
                    setIsLoading(false);
                }
                // Au refresh, on éteint juste le loader partiel
                if (trigger) {
                    setIsLoadingGroupsNonDefaut(false);
                }
            }
        };

        setTimeout(fetchData, 650);
    }, [trigger]);




    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setErrorCreate(null);
        try {
            await createGroup(formData);
            setTrigger(!trigger);
            setIsLoading(true)
            setOpen(false);
        } catch (err) {
            setErrorCreate(err)
        }
    };
    return (
        <Layout>
            <div style={{ padding: "20px" }}>
                {isLoading ? (
                    <>

                        <div style={{ paddingTop: "20px" }}>
                            <Skeleton active style={{ marginBottom: "60px" }} />
                            <Skeleton active />
                        </div>


                    </>
                ) : token ? (
                    <>
                        {errorGroup && <p className='error_lab'>{errorGroup}</p>}

                        {group.filter((item) => item.default).length > 0 ? (
                            group
                                .filter((item) => item.default)
                                .map((item) => (
                                    <button className='container_solo' key={item.id} onClick={() => {
                                        localStorage.setItem("currentGroupId", item.id);
                                        localStorage.setItem("currentGroupType", "solo");
                                        localStorage.setItem("currentGroupName", item.Nom);
                                        navigate('/detail/group');
                                    }}>
                                        <div className="container_img_group_solo">
                                            <img src="./assets/logo.png" alt="" />
                                        </div>
                                        <p>{item.Nom}</p>
                                    </button>
                                ))
                        ) : (
                            <p>Aucun groupement par défaut trouvé</p>
                        )}


                        <div className="middle_home_btn">
                            <h4>Vos groupes</h4>

                            <div className='home_group_icons'>
                                <button onClick={() => setOpen(true)} className='icon_btn'>
                                    <MdGroups />
                                </button>

                                <button
                                    className='icon_btn cancel_back'
                                    onClick={() => {
                                        setIsLoadingGroupsNonDefaut(true)
                                        setTrigger(!trigger)
                                    }}
                                >
                                    <IoMdRefresh className={isLoadingGroupsNonDefaut ? 'spin-smooth' : ''} />
                                </button>
                            </div>
                        </div>


                        {/* Groupes non par défaut */}
                        {isLoadingGroupsNonDefaut ? (
                            <Skeleton active paragraph={{ rows: 3 }} />
                        ) : group.filter((item) => !item.default).length === 0 ? (
                            <p>Vous n'avez pas de groupe 🐝</p>
                        ) : (
                            group
                                .filter((item) => !item.default)
                                .map((item) => {
                                    const liste = item.Liste_utilisateur_partage || [];
                                    return (
                                        <button key={item.id} className='container_solo' onClick={() => {
                                            localStorage.setItem("currentGroupId", item.id);
                                            localStorage.setItem("currentGroupType", "group");
                                            localStorage.setItem("currentGroupName", item.Nom);
                                            navigate('/detail/group');
                                        }}>
                                            <Avatar.Group size={48} max={{
                                                count: 3,
                                                style: { color: '#f56a00', backgroundColor: '#fde3cf' },
                                            }}>
                                                {liste.slice(0, 500).map((user, index) => {
                                                    const avatarUrl = getAvatar(user?.avatar);
                                                    return (
                                                        <Avatar
                                                            key={index}
                                                            src={avatarUrl}
                                                            alt={`avatar ${index + 1}`}
                                                            size={48}
                                                        >
                                                            {!avatarUrl && user?.prenom?.[0]}
                                                        </Avatar>
                                                    );
                                                })}
                                            </Avatar.Group>
                                            <p style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '150px'
                                            }}>
                                                {item.Nom}
                                            </p>
                                        </button>
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
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ marginBottom: "20px" }}>Créer un groupe</h3>
                                        <form onSubmit={handleCreateGroup}>
                                            <label>Nom du groupe</label>
                                            <input
                                                type="text"
                                                onChange={(e) => handleInputChange('Nom', e.target.value)}
                                                value={formData.Nom}
                                                className='general_input'
                                            />
                                            <div style={{ marginBottom: "20px" }}></div>
                                            <label>Description groupe</label>
                                            <textarea
                                                onChange={(e) => handleInputChange('Description', e.target.value)}
                                                value={formData.Description}
                                                className='general_input'
                                            ></textarea>

                                            <div className="container_btn_home_form">
                                                <button className='general_btn' type="submit">Créer</button>
                                                <button className='cancel_btn' type="button" onClick={() => setOpen(false)}>
                                                    Annuler
                                                </button>
                                            </div>

                                            {errorCreate && <p className='error_lab'>{errorCreate}</p>}
                                        </form>
                                    </div>
                                </Sheet.Content>
                            </Sheet.Container>
                            <Sheet.Backdrop />
                        </Sheet>
                    </>
                ) : (
                    <>
                        <h4>
                            Bienvenue sur l'application Apihive !<br />
                        </h4>
                        <p style={{ marginTop: "20px" }}>Veuillez vous connecter pour accéder à toutes les fonctionnalités 🐝</p>
                        <button className='general_btn' style={{ marginTop: "20px" }} onClick={() => navigate('/user')}>Se connecter</button>
                    </>
                )}
            </div>

        </Layout>
    );

};

export default Home;
