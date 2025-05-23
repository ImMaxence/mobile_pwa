import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getNote } from '../services/hiveService';
import { Skeleton } from 'antd';

const DetailReportHisto = () => {
    const [error, setError] = useState('');
    const [dateError, setDateError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const idHive = localStorage.getItem('currentHiveId');
                const res = await getNote(idHive);
                const sortedData = [...res].sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(sortedData);
                setFilteredData(sortedData);
                console.log(res)
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        setTimeout(fetchData, 650);
    }, []);

    useEffect(() => {
        if (!startDate || !endDate) {
            setDateError('');
            setFilteredData(data);
            return;
        }

        const from = new Date(startDate);
        const to = new Date(endDate);

        if (to < from) {
            setDateError("❌ La date de fin ne peut pas être antérieure à la date de début.");
            setFilteredData([]);
            return;
        }

        setDateError('');
        const filtered = data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= from && itemDate <= to;
        });
        setFilteredData(filtered);
    }, [startDate, endDate, data]);

    const renderItem = (item) => (
        <div
            key={item.id}
            style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9'
            }}
        >
            <h3>{item.ruche?.nom || 'Inconnu'}</h3>
            <p><strong>Date :</strong> {new Date(item.date).toLocaleString()}</p>
            <p><strong>Comportement :</strong> {item.comportement_abeille || 'Non spécifié'}</p>
            <p><strong>Cellule royale observée :</strong> {item.cellule_royale_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Couvain observé :</strong> {item.couvain_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Oeufs observés :</strong> {item.oeuf_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Reine observée :</strong> {item.reine_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Cellules royales détruites :</strong> {item.cellule_royale_detruite_nombre || 'Non spécifié'}</p>
            <p><strong>Commentaire :</strong> {item.commentaire_general || 'Aucun'}</p>
            <p style={{ margin: '20px 0' }}></p>
            <p><strong>Publié par :</strong> {item.redacteur_name || 'Inconnu'}</p>
            <p><strong>Le :</strong> {item.createdAt || 'Date non trouvée'}</p>
        </div>
    );

    return (
        <LayoutStackNav back_name="Retour" back_url="/detail/hive">
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div>
                        <label><strong>Date de début :</strong></label><br />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div>
                        <label><strong>Date de fin :</strong></label><br />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                {dateError && (
                    <p style={{ color: 'red', marginBottom: '10px' }}>{dateError}</p>
                )}

                {loading && <Skeleton active paragraph={{ rows: 6 }} />}

                {!loading && error && (
                    <p className="error_lab">{error}</p>
                )}

                {!loading && !error && filteredData.length === 0 && !dateError && (
                    <p>Aucun rapport trouvé dans cette plage de dates.</p>
                )}

                {!loading && filteredData.map(renderItem)}
            </div>
        </LayoutStackNav>
    );
};

export default DetailReportHisto;
