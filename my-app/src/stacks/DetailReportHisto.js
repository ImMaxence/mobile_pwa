import React, { useEffect, useState } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getNote } from '../services/hiveService';
import { Skeleton } from 'antd';

const DetailReportHisto = () => {
    const [error, setError] = useState('');
    const [searchDate, setSearchDate] = useState('');
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
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        setTimeout(fetchData, 1000);
    }, []);

    useEffect(() => {
        if (!searchDate) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.date.startsWith(searchDate)
            );
            setFilteredData(filtered);
        }
    }, [searchDate, data]);

    const renderItem = (item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '10px' }}>
            <h3>{item.ruche?.nom || 'Inconnu'}</h3>
            <p><strong>Date :</strong> {new Date(item.date).toLocaleString()}</p>
            <p><strong>Comportement :</strong> {item.comportement_abeille || 'Non spécifié'}</p>
            <p><strong>Cellule royale observée :</strong> {item.cellule_royale_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Couvain observé :</strong> {item.couvain_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Oeufs observés :</strong> {item.oeuf_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Reine observée :</strong> {item.reine_observe ? 'Oui' : 'Non'}</p>
            <p><strong>Cellules royales détruites :</strong> {item.cellule_royale_detruite_nombre || 'Non spécifié'}</p>
            <p><strong>Commentaire :</strong> {item.commentaire_general || 'Aucun'}</p>
        </div>
    );

    return (
        <LayoutStackNav back_name="Retour" back_url="/detail/hive">
            <div style={{ padding: '20px' }}>
                <div className="histo_repo" style={{ marginBottom: '15px' }}>
                    <label htmlFor="search-date"><strong>Rechercher par date :</strong></label>
                    <input
                        id="search-date"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        style={{ marginLeft: '10px', padding: '5px' }}
                    />
                </div>

                {loading && <Skeleton active />}

                {!loading && error && (
                    <p className="error_lab">{error}</p>
                )}

                {!loading && !error && filteredData.length === 0 && (
                    <p>Aucun rapport trouvé pour cette date.</p>
                )}

                {!loading && filteredData.map(renderItem)}
            </div>
        </LayoutStackNav>
    );
};

export default DetailReportHisto;
