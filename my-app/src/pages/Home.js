import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getToken } from '../utils/manageStorage';
import { createGroup, getGroups } from '../services/hiveService';
import { Sheet } from 'react-modal-sheet';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';

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
    const [isLoading, setIsLoading] = useState(true);


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
            setIsLoading(true);
            try {
                const resToken = await getToken();
                setToken(resToken);

                const resGroups = await getGroups();
                setGroup(resGroups);
            } catch (err) {
                setErrorGroup(err);
            } finally {
                setIsLoading(false);
            }
        };

        setTimeout(() => { fetchData(); }, 1000)
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
                        <Skeleton active />
                        <div style={{ padding: "10px" }}></div>
                        <Skeleton active />
                    </>
                ) : token ? (
                    <>
                        {errorGroup && <p className='error_lab'>{errorGroup}</p>}

                        {/* Groupes par défaut */}
                        {group
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

                            ))}

                        <div className="middle_home_btn">
                            <h4>Vos groupes</h4>
                            <button onClick={() => setOpen(true)} className='general_btn'>Créer un groupe</button>
                        </div>

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

                                        <button key={item.id} className='container_solo' onClick={() => {
                                            localStorage.setItem("currentGroupId", item.id);
                                            localStorage.setItem("currentGroupType", "group");
                                            localStorage.setItem("currentGroupName", item.Nom);
                                            navigate('/detail/group');
                                        }}>

                                            <div className='grouped_img_group'>
                                                {/* {[img1, img2, img3, img4].map((imgSrc, i) => (
                                                    <img
                                                        key={i}
                                                        src={imgSrc}
                                                        alt={`avatar ${i + 1}`}

                                                        onError={(e) => (e.currentTarget.src = defaultAvatar)}
                                                    />
                                                ))} */}

                                                <img src={img1} alt="" />
                                                <img src={img2} alt="" style={{ position: 'relative', left: '-15px' }} />
                                                <img src={img3} alt="" style={{ position: 'relative', left: '-30px' }} />
                                                <img src={img4} alt="" style={{ position: 'relative', left: '-45px' }} />

                                            </div>
                                            <p>{item.Nom}</p>
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
