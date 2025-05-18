import React, { useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../services/hiveService'
import { Switch } from 'antd'

const DetailReportCreate = () => {
    const navigate = useNavigate();

    const [comportement, setComportement] = useState("😡");
    const [oeuf, setOeuf] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // format YYYY-MM-DD
    const [couvaint, setCouvaint] = useState(false);
    const [royal, setRoyal] = useState(false);
    const [reine, setReine] = useState(false);
    const [royalDet, setRoyalDet] = useState(0);
    const [comment, setComment] = useState("");

    const [error, setError] = useState(null);

    const handleCreateReport = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const idRuche = localStorage.getItem('currentHiveId');

            await createNote({
                id_ruche: idRuche,
                comportement_abeille: comportement,
                oeuf_observe: oeuf,
                couvain_observe: couvaint,
                reine_observe: reine,
                cellule_royale_observe: royal,
                cellule_royale_detruite_nombre: royalDet,
                date: date,
                commentaire_general: comment
            });

            navigate('/detail/hive');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <div style={{ padding: "20px" }}>
                <h4 style={{ marginBottom: "40px" }}>Créer un rapport</h4>
                <form onSubmit={handleCreateReport}>

                    <div className='report_date'>
                        <label>Date du rapport</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className='general_input w100'
                            style={{ marginBottom: "20px" }}
                        />
                    </div>

                    <div className='report_compo'>
                        <label>Comportement des abeilles</label>
                        <div style={{ marginBottom: "20px" }}>
                            {["😡", "🙁", "😬", "😊", "😍"].map((emoji) => (
                                <label key={emoji} htmlFor={emoji}>
                                    {emoji}
                                    <input
                                        type="radio"
                                        name="compo"
                                        value={emoji}
                                        id={emoji}
                                        checked={comportement === emoji}
                                        onChange={(e) => setComportement(e.target.value)}
                                    />
                                </label>
                            ))}
                        </div>

                    </div>

                    <div className='container_sw_repo' style={{ marginBottom: "20px" }}>

                        <div style={{ marginBottom: "20px" }}>
                            <label>Présence oeuf</label>
                            <Switch checked={oeuf} onChange={(checked) => setOeuf(checked)} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label>Présence couvain</label>
                            <Switch checked={couvaint} onChange={(checked) => setCouvaint(checked)} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label>Cellule royale</label>
                            <Switch checked={royal} onChange={(checked) => setRoyal(checked)} />
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label>Reine</label>
                            <Switch checked={reine} onChange={(checked) => setReine(checked)} />
                        </div>

                    </div>

                    <label>Nombre de cellules royales détruites</label>
                    <input
                        type="number"
                        min={0}
                        value={royalDet}
                        onChange={(e) => setRoyalDet(parseInt(e.target.value, 10) || 0)}
                        className='general_input'
                        style={{ marginBottom: "20px" }}
                    />

                    <label>Commentaire</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className='general_input'
                        style={{ marginBottom: "20px" }}
                    ></textarea>

                    <button className='general_btn' type="submit">Envoyer</button>

                    {error && <p className='error_lab'>{error}</p>}
                </form>
            </div>
        </LayoutStackNav>
    );
};

export default DetailReportCreate;
