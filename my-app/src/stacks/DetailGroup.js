import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getCurrentGroupId, getCurrentGroupType } from '../utils/manageStorage';
import { Sheet } from 'react-modal-sheet';
import { addHiveToGroup, addUserToGroup, deleteHiveToGroup, getDataFromGroup, getGroups, leaveGroup, updateGroup, updateInfoHive } from '../services/hiveService'
import { useNavigate } from 'react-router-dom';
import { Collapse, Switch } from 'antd';
import { getUserId } from '../utils/manageStorage';
import { searchUserByName } from '../services/userService';
import { Skeleton } from 'antd';
import { IoSettings } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { FaBoxArchive } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";

const { Panel } = Collapse;

const DetailGroup = () => {

    const navigate = useNavigate();

    const [type, setType] = useState(null);
    const [trigger, setTrigger] = useState(false);

    const [hive, setHive] = useState([]);
    const [description, setDescription] = useState("");
    const [errorHive, setErrorHive] = useState(null);
    const [userInHive, setUserinHive] = useState([])
    const [loading, setLoading] = useState(true)

    const [openSetting, setOpenSetting] = useState(false);
    const [errorSetting, setErrorSetting] = useState(null);

    const [newNameGroup, setNewNameGroup] = useState("");
    const [newDescriptionGroup, setNewDescriptionGroup] = useState("");
    const [errorUpdateUser, setErrorUpdateUser] = useState(null);
    const [errorUpdateGroup, setErrorUpdateGroup] = useState(null);
    const [errorLeaveGroup, setErrorLeaveGroup] = useState(null);

    const [openSaveHive, setOpenSaveHive] = useState(false);
    const [errorSaveHive, setErrorSaveHive] = useState(null);
    const [rucheIDSaveHive, setRucheIDSaveHive] = useState("");
    const [ruchePasswordSaveHive, setRuchePasswordSaveHive] = useState("");

    const [openUpdateHive, setOpenUpdateHive] = useState(false);
    const [errorUpdateHive, setErrorUpdateHive] = useState(null);
    const [hiveUser, setHiveUser] = useState([]);

    const [newHiveUpdateName, setNewHiveUpdateName] = useState("");
    const [newOrigin, setNewOrigin] = useState("");
    const [newRace, setNewRace] = useState("");
    const [newNbrCadran, setNewNbrCadran] = useState();
    const [newNbrHausse, setNewNbrHausse] = useState();
    const [newCouleurReine, setNewCouleurReine] = useState("");
    const [newConcentementRGPD, setNewConcentementRGPD] = useState(false);
    const [newConcentementPartage, setNewConcentementPartage] = useState(false);

    const [openAddHive, setOpenAddHive] = useState(false);
    const [errorAddHive, setErrorAddHive] = useState(null);

    const [openAddUser, setOpenAddUser] = useState(false);
    const [errorAddUser, setErrorAddUser] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchGroupType = async () => {

            try {
                const res = await getCurrentGroupType();
                setType(res);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchInfoGroup = async () => {
            setLoading(true);
            const currentId = localStorage.getItem("currentGroupId")
            if (!currentId) {
                setHive([]);
                return;
            }

            try {
                const data = await getDataFromGroup(currentId)

                if (data) {
                    setDescription(data.Description)
                    setHive(data.Liste_ruche)
                    setUserinHive(data.Liste_utilisateur_partage)
                    // localStorage.setItem('idHive3', data.Liste_ruche[0].id)
                    setLoading(false)
                } else {
                    setHive([])
                    setLoading(false)
                }
            } catch (err) {
                setErrorHive(err)
                setHive([])
            }
        }

        const fecthHiveUser = async () => {
            try {
                const res = await getGroups()

                const hiveWithDefaultTrue = res.filter((group) => group.default === true)
                const allDefaultTrueHives = hiveWithDefaultTrue.filter(hive => hive.default === true);
                const allRuches = allDefaultTrueHives.flatMap(hive => hive.Liste_ruche ?? []);

                setHiveUser(allRuches)
            } catch (err) {
                setErrorUpdateHive(err)
            }
        }

        fetchGroupType();
        fecthHiveUser()
        setTimeout(() => { fetchInfoGroup(); }, 1000)
    }, [trigger])

    const handleSaveHive = async (e) => {
        e.preventDefault();
        try {
            const currentIdGroup = localStorage.getItem("currentGroupId")
            await addHiveToGroup(currentIdGroup, { rucheId: rucheIDSaveHive, ruchePassword: ruchePasswordSaveHive })
            setTrigger(!trigger)
            setOpenSaveHive(false);
            setErrorSaveHive(null)
        } catch (err) {
            setErrorSaveHive(err)
        }
    }

    const handleLeaveGroup2 = async (id) => {
        try {
            const idG = await getCurrentGroupId()
            await leaveGroup(idG, { userId: id })
            setTrigger(!trigger)
            setOpenSetting(false)
            setLoading(true)
        } catch (err) {
            setErrorSetting(err)
        }
    }

    const handleUpdateGroup = async (e) => {
        e.preventDefault()
        setErrorUpdateGroup(null)

        try {
            const idG = await getCurrentGroupId()
            await updateGroup(idG, { Nom: newNameGroup, Description: newDescriptionGroup })
            setLoading(true)
            setTrigger(!trigger)
            setOpenSetting(false)
        } catch (err) {
            setErrorUpdateGroup(err)
        }
    }

    const handleLeaveGroup = async () => {
        try {
            const userId = await getUserId()
            const groupId = await getCurrentGroupId()
            await leaveGroup(groupId, { userId: userId })
            setErrorLeaveGroup(null)
            navigate('/')
        } catch (err) {
            setErrorLeaveGroup(err)
        }
    }

    const handleUpdateHive = async (e, id) => {
        e.preventDefault();
        setErrorUpdateHive(null);
        try {
            const id_ruche = id

            await updateInfoHive(id_ruche, {
                nom: newHiveUpdateName,
                origin_abeille: newOrigin,
                race_reine: newRace,
                nbr_cadran: newNbrCadran,
                nbr_hausse: newNbrHausse,
                couleur_reine: newCouleurReine,
                concentement_rgpd: newConcentementRGPD,
                concentement_partage: newConcentementPartage
            });
            setTrigger(!trigger);
            setErrorUpdateHive(null);
            setOpenUpdateHive(false);
        } catch (err) {
            setErrorUpdateHive(err);
        }
    };

    const handleAddHiveToGroupV2 = async (id) => {
        try {
            setErrorAddHive(null)
            const currentID = localStorage.getItem("currentGroupId")
            await addHiveToGroup(currentID, { rucheId: id, ruchePassword: "none" })
            setTrigger(!trigger)
            setLoading(true)
            setOpenAddHive(false)
            setErrorAddHive(null)
        } catch (err) {
            setErrorAddHive(err)
        }
    }

    const handleDeleteHiveFromGroup = async (id) => {
        try {
            setErrorAddHive(null)
            const currentID = localStorage.getItem("currentGroupId")
            await deleteHiveToGroup(currentID, { rucheId: id })
            setTrigger(!trigger)
            setOpenAddHive(false)
            setLoading(true)
            setErrorAddHive(null)
        } catch (err) {
            setErrorAddHive(err)
        }
    }

    const handleSearchUser = async () => {
        try {
            setErrorAddUser(null)
            const results = await searchUserByName(searchQuery)
            setSearchResults(results);
            setErrorAddUser(null)
        } catch (err) {
            setErrorAddUser(err)
        }
    };

    const handleAddUser = async (id) => {
        try {
            const groupId = await getCurrentGroupId()
            setErrorAddUser(null)

            console.log(groupId, id)

            await addUserToGroup(groupId, id)
            setTrigger(!trigger)
            setOpenAddUser(false)
            setErrorAddUser(null)
            setLoading(true)
        } catch (err) {
            setErrorAddUser(err)
        }
    }

    return (
        <LayoutStackNav back_url="/" back_name="Mes groupes">
            <div style={{ padding: "20px" }}>
                <h4 style={{ padding: '20px 0 20px 0' }}>
                    {localStorage.getItem('currentGroupName')}
                </h4>

                {loading ? (
                    <>
                        <Skeleton.Button active style={{ marginBottom: "40px" }} />
                    </>
                ) : (
                    <>
                        <p style={{ marginBottom: "40px", color: 'gray' }}>{description ? description : "Aucune description de groupe trouvée"}</p>
                    </>
                )}


                {type === 'solo' ? (
                    <div className='detailg_btn_action'>
                        <button className='icon_btn' onClick={() => setOpenSaveHive(true)}><FiPlusCircle /></button>

                        <button className='icon_btn' onClick={() => setOpenUpdateHive(true)}><FaBoxArchive /></button>

                        <button className='icon_btn cancel_back' onClick={() => {
                            setTrigger(!trigger)
                            setLoading(true)
                        }}>
                            <IoMdRefresh />
                        </button>

                        <button className='icon_btn ios_back' onClick={() => setOpenSetting(true)}><IoSettings className='rotate' /></button>

                    </div>
                ) : (
                    <div className='detailg_btn_action'>
                        <button className='icon_btn' onClick={() => { setOpenAddHive(true) }}><FaBoxArchive /></button>

                        <button className='icon_btn' onClick={() => setOpenAddUser(true)}><IoPersonAdd /></button>

                        <button className='icon_btn cancel_back' onClick={() => {
                            setTrigger(!trigger)
                            setLoading(true)
                        }}>
                            <IoMdRefresh />
                        </button>

                        <button className='icon_btn ios_back' onClick={() => setOpenSetting(true)}><IoSettings className='rotate' /></button>

                    </div>
                )}

                {loading ? (
                    <Skeleton active />
                ) : Array.isArray(hive) && hive.length > 0 ? (
                    hive.map((item) => (
                        <button style={{ marginTop: "40px" }} className='container_solo' onClick={() => {
                            localStorage.setItem('currentHiveId', item.id)
                            localStorage.setItem('currentHiveName', item.nom)
                            navigate('/detail/hive')
                        }}>
                            <p>{item.nom}</p>
                        </button>
                    ))
                ) : (
                    <p>Aucune ruche trouvée</p>
                )}

            </div>
            <Sheet isOpen={openUpdateHive} onClose={() => {
                setErrorUpdateHive(null)
                setOpenUpdateHive(false)
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div style={{ padding: "20px" }}>
                                <h3 style={{ marginBottom: "20px" }}>Modifier mes ruches</h3>
                                {Array.isArray(hiveUser) && hiveUser.length > 0 ? (
                                    hiveUser.map((item) => (
                                        <>
                                            <form onSubmit={(e) => handleUpdateHive(e, item.id)} key={item.id}>

                                                <label htmlFor="">Nouveau nom</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="text" onChange={(e) => setNewHiveUpdateName(e.target.value)} />

                                                <label htmlFor="">Nouvelle origin abeille</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="text" onChange={(e) => setNewOrigin(e.target.value)} />

                                                <label htmlFor="">Nouvelle race reine</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="text" onChange={(e) => setNewRace(e.target.value)} />

                                                <label htmlFor="">Nouveau nomre cadran</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="number" onChange={(e) => setNewNbrCadran(parseInt(e.target.value))} />

                                                <label htmlFor="">Nouveau nombre hausse</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="number" onChange={(e) => setNewNbrHausse(parseInt(e.target.value))} />

                                                <label htmlFor="">Nouvelle couleur reine</label>
                                                <input style={{ marginBottom: "20px" }} className='general_input' type="text" onChange={(e) => setNewCouleurReine(e.target.value)} />

                                                <div className='wrapper_detailg'>
                                                    <div className='swi_det'>
                                                        <label htmlFor="">Concentement RGPD</label>
                                                        <Switch defaultChecked onChange={(checked) => setNewConcentementRGPD(checked)} />

                                                    </div>
                                                    <div className='swi_det'>
                                                        <label htmlFor="">Partage Localisation</label>
                                                        <Switch defaultChecked onChange={(checked) => setNewConcentementPartage(checked)} />
                                                    </div>

                                                </div>
                                                {errorUpdateHive && <p className='error_lab' style={{ marginBottom: "20px" }}>{errorUpdateHive}</p>}
                                                <button className='general_btn w100' type='submit'>
                                                    Modifier
                                                </button>


                                            </form>
                                            <button type='button' style={{ marginTop: "20px", marginBottom: "200px" }} className='cancel_btn w100' onClick={() => setOpenUpdateHive(false)}>Annuler</button>
                                        </>
                                    ))
                                ) : (
                                    <p>Aucune ruche trouvée</p>
                                )}
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >

            <Sheet isOpen={openSaveHive} onClose={() => {
                setOpenSaveHive(false);
                setErrorSaveHive(null);
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <form onSubmit={handleSaveHive} style={{ padding: "20px" }}>
                            <h3 style={{ marginBottom: "20px" }}>Les champs ruches ID et password vous ont été envoyé par email</h3>
                            <label htmlFor="">ID ruche</label>
                            <input style={{ marginBottom: "20px" }} className='general_input' type="text" onChange={(e) => setRucheIDSaveHive(e.target.value)} />
                            <label htmlFor="">Mot de passe ruche</label>
                            <input style={{ marginBottom: "40px" }} className='general_input' type="password" onChange={(e) => setRuchePasswordSaveHive(e.target.value)} />
                            <button className='general_btn' type='submit'>Ajouter la ruche</button>
                            <button style={{ marginLeft: "20px" }} className='cancel_btn' onClick={() => setOpenSaveHive(false)}>Annuler</button>
                            {errorSaveHive && <p className='error_lab'>{errorSaveHive}</p>}
                        </form>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >

            <Sheet isOpen={openSetting} onClose={() => {
                setOpenSetting(false);
                setErrorUpdateUser(null);
                setErrorSetting(null);
                setErrorUpdateGroup(null);
                setErrorLeaveGroup(null);
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div style={{ padding: "20px" }}>

                                <Collapse accordion>
                                    <Panel header="Utilisateur(s) dans le groupe" key="1">
                                        {
                                            userInHive.map((item) => (
                                                <div className='det_del_user'>
                                                    <p>{item.prenom} {item.nom}</p>
                                                    <button className='del_btn' onClick={() => { handleLeaveGroup2(item.id) }}>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            ))
                                        }
                                        {errorSetting && <p className='error_lab'>{errorSetting}</p>}
                                    </Panel>
                                    <Panel header="Modifier ce groupe" key="2">
                                        <form onSubmit={handleUpdateGroup}>
                                            <label htmlFor="">Nouveau nom du groupe</label>
                                            <input className='general_input' type="text" onChange={(e) => setNewNameGroup(e.target.value)} />
                                            <label htmlFor="">Nouvelle description</label>
                                            <textarea style={{ margin: "20px 0 20px" }} className='general_input' name="" id="" onChange={(e) => setNewDescriptionGroup(e.target.value)}></textarea>
                                            <button className='general_btn' type='submit'>Modifier</button>
                                            {errorUpdateGroup && <p className='error_lab'>{errorUpdateGroup}</p>}
                                        </form>
                                    </Panel>
                                </Collapse>
                                {errorLeaveGroup && <p className='error_lab'>{errorLeaveGroup}</p>}
                                <button style={{ marginTop: "40px", marginBottom: "20px" }} className='del_btn w100' onClick={handleLeaveGroup}>Quitter le groupe</button>
                                <button className='cancel_btn w100' onClick={() => setOpenSetting(false)}>Annuler</button>

                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >

            <Sheet isOpen={openAddHive} onClose={() => {
                setErrorAddHive(null)
                setOpenAddHive(false)
                setErrorUpdateHive(null)
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div style={{ padding: "20px" }}>
                                <h3 style={{ marginBottom: '40px' }}>Gérer mes ruches</h3>

                                {
                                    Array.isArray(hiveUser) && hiveUser.length > 0 ? (
                                        <>
                                            {errorAddHive && <p className='error_lab'>{errorAddHive}</p>}
                                            {
                                                hiveUser.map((item) => (

                                                    <div key={item.id} className='manage_hive_gr'>
                                                        <p>{item.nom}</p>
                                                        <div>
                                                            <button className='general_btn' onClick={() => handleAddHiveToGroupV2(item.id)}>Ajouter</button>
                                                            <button style={{ marginLeft: "10px" }} className='del_btn' onClick={() => handleDeleteHiveFromGroup(item.id)}>Enlever</button>
                                                        </div>
                                                    </div>

                                                ))}
                                            {/* <Text style={{ color: 'red' }}>{errAddG}</Text>
                                    <Text style={{ color: 'red' }}>{errReG}</Text> */}

                                        </>
                                    ) : (
                                        <p>Aucune ruche trouvée</p>
                                    )
                                }
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >

            <Sheet isOpen={openAddUser} onClose={() => {
                setErrorAddUser(null)
                setOpenAddUser(false)
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <Sheet.Scroller>
                            <div style={{ padding: "20px" }}>
                                <label htmlFor="search">Rechercher un utilisateur</label>
                                <input
                                    id="search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='general_input'
                                />
                                <button
                                    onClick={handleSearchUser}
                                    className='general_btn w100'
                                    style={{ marginTop: "20px" }}
                                >
                                    Rechercher
                                </button>

                                <button style={{ marginTop: "20px" }} className='cancel_btn w100' onClick={() => setOpenAddUser(false)}>Annuler</button>

                                {searchResults.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                        {searchResults.map((user) => (
                                            <div key={user.id} className='container_search_user_add_del'>
                                                <span>{user.prenom} {user.nom}</span>
                                                <button
                                                    onClick={() => handleAddUser(user.id)}
                                                    className='general_btn'
                                                >
                                                    Ajouter
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {errorAddUser && <p className='error_lab'>{errorAddUser}</p>}
                            </div>
                        </Sheet.Scroller>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >
        </LayoutStackNav >
    );
};

export default DetailGroup;