import React, { useEffect, useState, useCallback } from 'react';
import LayoutStackNav from '../components/LayoutStackNav';
import { getNote } from '../services/hiveService';

const DetailReportHisto = () => {
    const [error, setError] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idHive = localStorage.getItem('currentHiveId')
                const res = await getNote(idHive);
                const sortedData = [...res].sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(sortedData);
                setFilteredData(sortedData);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchDate.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.date.startsWith(searchDate)
            );
            setFilteredData(filtered);
        }
    }, [searchDate, data]);

    const renderItem = (item) => (
        <div key={item.id}>
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
        <LayoutStackNav back_name={'Retour'} back_url={'/detail/hive'}>
            <div style={{ padding: '1rem' }}>
                <label htmlFor="">format : AAAA-MM-JJ</label>
                <input
                    type="text"
                    placeholder="Rechercher par date (AAAA-MM-JJ)"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}

                />

                {error && <p className='error_lab'>{error}</p>}

                {filteredData.length === 0 && !error && (
                    <p>Aucun rapport trouvé pour cette date.</p>
                )}

                {filteredData.map(renderItem)}
            </div>
        </LayoutStackNav>
    );
};

export default DetailReportHisto;
