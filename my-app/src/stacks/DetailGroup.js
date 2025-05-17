import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getCurrentGroupId, getCurrentGroupType } from '../utils/manageStorage';
import { Sheet } from 'react-modal-sheet';
import { addHiveToGroup, addUserToGroup, deleteHiveToGroup, getDataFromGroup, getGroups, leaveGroup, updateGroup, updateInfoHive } from '../services/hiveService'
import { useNavigate } from 'react-router-dom';
import { Collapse, Switch } from 'antd';
import { getUserId } from '../utils/manageStorage';
import { LayersControl } from 'react-leaflet';
import { searchUserByName } from '../services/userService';
import { Skeleton } from 'antd';

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
        setTimeout(() => { fetchInfoGroup() }, 1000)
    }, [trigger])

    const handleSaveHive = async (e) => {
        e.preventDefault();
        try {
            const currentIdGroup = localStorage.getItem("currentGroupId")
            await addHiveToGroup(currentIdGroup, { rucheId: rucheIDSaveHive, ruchePassword: ruchePasswordSaveHive })
            setTrigger(!trigger)
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
            setOpenAddHive(false)
            setErrorAddHive(null)
        } catch (err) {
            setOpenAddHive(err)
        }
    }

    const handleDeleteHiveFromGroup = async (id) => {
        try {
            setErrorAddHive(null)
            const currentID = localStorage.getItem("currentGroupId")
            await deleteHiveToGroup(currentID, { rucheId: id })
            setTrigger(!trigger)
            setOpenAddHive(false)
            setErrorAddHive(null)
        } catch (err) {
            setOpenAddHive(err)
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
        } catch (err) {
            setErrorAddUser(err)
        }
    }

    return (
        <LayoutStackNav back_url="/" back_name="Mes groupes">
            <button onClick={() => setOpenSetting(true)}>setting - {localStorage.getItem('currentGroupName')}</button>

            {type === 'solo' ? (
                <div>
                    <button onClick={() => setOpenSaveHive(true)}>Enregistrer sa ruche</button>

                    <button onClick={() => setOpenUpdateHive(true)}>Modifier votre ruche</button>
                </div>
            ) : (
                <div>
                    <button onClick={() => setOpenAddHive(true)}>Ajouter sa ruche</button>

                    <button onClick={() => setOpenAddUser(true)}>Ajouter un user</button>
                </div>
            )}

            {loading ? (
                <Skeleton active />
            ) : Array.isArray(hive) && hive.length > 0 ? (
                hive.map((item) => (
                    <button onClick={() => {
                        localStorage.setItem('currentHiveId', item.id)
                        localStorage.setItem('currentHiveName', item.nom)
                        navigate('/detail/hive')
                    }}>
                        {item.nom}
                    </button>
                ))
            ) : (
                <p>Aucune ruche trouvée</p>
            )}


            <Sheet isOpen={openUpdateHive} onClose={() => {
                setErrorUpdateHive(null)
                setOpenUpdateHive(false)
            }}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <h3>Modifier mes ruches</h3>
                        {Array.isArray(hiveUser) && hiveUser.length > 0 ? (
                            hiveUser.map((item) => (
                                <form onSubmit={(e) => handleUpdateHive(e, item.id)} key={item.id}>
                                    <p>{item.nom}</p>
                                    <label htmlFor="">Nouveau nom</label>
                                    <input type="text" onChange={(e) => setNewHiveUpdateName(e.target.value)} />

                                    <label htmlFor="">Nouvelle origin abeille</label>
                                    <input type="text" onChange={(e) => setNewOrigin(e.target.value)} />

                                    <label htmlFor="">Nouvelle race reine</label>
                                    <input type="text" onChange={(e) => setNewRace(e.target.value)} />

                                    <label htmlFor="">Nouveau nomre cadran</label>
                                    <input type="number" onChange={(e) => setNewNbrCadran(parseInt(e.target.value))} />

                                    <label htmlFor="">Nouveau nombre hausse</label>
                                    <input type="number" onChange={(e) => setNewNbrHausse(parseInt(e.target.value))} />

                                    <label htmlFor="">Nouvelle couleur reine</label>
                                    <input type="text" onChange={(e) => setNewCouleurReine(e.target.value)} />

                                    <label htmlFor="">Concentement RGPD</label>
                                    <Switch defaultChecked onChange={(checked) => setNewConcentementRGPD(checked)} />

                                    <label htmlFor="">Partage Localisation</label>
                                    <Switch defaultChecked onChange={(checked) => setNewConcentementPartage(checked)} />

                                    <button type='submit'>
                                        Modifier
                                    </button>
                                </form>
                            ))
                        ) : (
                            <p>Aucune ruche trouvée</p>
                        )}

                        {errorUpdateHive && <p>{errorUpdateHive}</p>}
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
                        <form onSubmit={handleSaveHive}>
                            <h3>Les champs ruches ID et password vous ont été envoyé par email</h3>
                            <label htmlFor="">ID ruche</label>
                            <input type="text" onChange={(e) => setRucheIDSaveHive(e.target.value)} />
                            <label htmlFor="">Mot de passe ruche</label>
                            <input type="password" onChange={(e) => setRuchePasswordSaveHive(e.target.value)} />
                            <button type='submit'>Ajouter la ruche</button>
                            <button onClick={() => setOpenSaveHive(false)}></button>
                            {errorSaveHive && <p>{errorSaveHive}</p>}
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
                        <p>{description ? description : "Pas de description de groupe"}</p>

                        <Collapse accordion>
                            <Panel header="Utilisateur(s) dans le groupe" key="1">
                                {
                                    userInHive.map((item) => (
                                        <div>
                                            <p>{item.prenom} {item.nom}</p>
                                            <button onClick={() => { handleLeaveGroup2(item.id) }}>
                                                Supprimer
                                            </button>
                                        </div>
                                    ))
                                }
                                {errorSetting && <p>{errorSetting}</p>}
                            </Panel>
                            <Panel header="Modifier ce groupe" key="2">
                                <form onSubmit={handleUpdateGroup}>
                                    <label htmlFor="">Nouveau nom du groupe</label>
                                    <input type="text" onChange={(e) => setNewNameGroup(e.target.value)} />
                                    <label htmlFor="">Nouvelle description</label>
                                    <textarea name="" id="" onChange={(e) => setNewDescriptionGroup(e.target.value)}></textarea>
                                    <button type='submit'>Modifier</button>
                                    {errorUpdateGroup && <p>{errorUpdateGroup}</p>}
                                </form>
                            </Panel>
                        </Collapse>
                        <button onClick={handleLeaveGroup}>Quitter le groupe</button>
                        {errorLeaveGroup && <p>{errorLeaveGroup}</p>}
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
                        <h4>Gérer mes ruches</h4>

                        {
                            Array.isArray(hiveUser) && hiveUser.length > 0 ? (
                                <>
                                    {
                                        hiveUser.map((item) => (

                                            <div key={item.id}>
                                                <p>{item.nom}</p>
                                                <div>
                                                    <button onClick={() => handleAddHiveToGroupV2(item.id)}>Ajouter</button>
                                                    <button onClick={() => handleDeleteHiveFromGroup(item.id)}>Enlever</button>
                                                </div>
                                            </div>

                                        ))}
                                    {/* <Text style={{ color: 'red' }}>{errAddG}</Text>
                                    <Text style={{ color: 'red' }}>{errReG}</Text> */}
                                </>
                            ) : (
                                errorAddHive && <p>{errorAddHive}</p>
                            )
                        }
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
                        <div >
                            <label htmlFor="search">Rechercher un utilisateur</label>
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}

                            />
                            <button
                                onClick={handleSearchUser}

                            >
                                Rechercher
                            </button>

                            {searchResults.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    {searchResults.map((user) => (
                                        <div key={user.id} >
                                            <span>{user.prenom} {user.nom}</span>
                                            <button
                                                onClick={() => handleAddUser(user.id)}

                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errorAddUser && <p style={{ color: 'red' }}>{errorAddUser}</p>}
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet >
        </LayoutStackNav >
    );
};

export default DetailGroup;