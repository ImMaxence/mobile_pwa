import React, { useState } from 'react';
import VersionApp from './VersionApp';

const Tutorial = () => {
    const [selectedPlatform, setSelectedPlatform] = useState('ios')

    return (
        <div style={{ padding: '10px' }}>
            <h2>Comment installer notre application PWA</h2>
            <p>Suivez ces étapes simples pour ajouter notre PWA à votre écran d'accueil :</p>

            <div className="tutorial_buttons">
                <button
                    onClick={() => setSelectedPlatform('android')}
                    className={selectedPlatform === 'android' ? 'active' : ''}
                >
                    Android
                </button>
                <button
                    onClick={() => setSelectedPlatform('ios')}
                    className={selectedPlatform === 'ios' ? 'active' : ''}
                >
                    IOS
                </button>
            </div>

            {selectedPlatform === 'ios' && (
                <div className='container_card_tuto ios'>
                    <h4>Cliquez sur le bouton de partage :</h4>
                    <p>En bas de l'écran, repérez l'icône de partage, symbolisée par un carré avec une flèche vers le haut.</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/1.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h4>Sélectionnez "Ajouter à l'écran d'accueil" :</h4>
                    <p>Dans le menu qui s'affiche, faites défiler vers le bas et appuyez sur l'option "Ajouter à l'écran d'accueil".</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/2.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h4>Confirmer l'installation :</h4>
                    <p>Donnez un nom à l'application si vous le souhaitez, puis appuyez sur "Ajouter" en haut à droite de l'écran.</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/3.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h2>C'est fait ! :</h2>
                    <p>Vous verrez maintenant l'icône de notre PWA sur votre écran d'accueil, prête à être utilisée à tout moment.</p>
                </div>
            )}

            {selectedPlatform === 'android' && (
                <div className='container_card_tuto android'>
                    <h4>Cliquez sur le bouton option :</h4>
                    <p>En haut de l'écran, repérez l'icône avec 3 points l'un sur l'autre.</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/and1.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h4>Sélectionnez "Ajouter à l'écran d'accueil" :</h4>
                    <p>Dans le menu qui s'affiche, faites défiler vers le bas et appuyez sur l'option "Ajouter à l'écran d'accueil".</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/and2.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h4>Confirmer l'installation :</h4>
                    <p>Donnez un nom à l'application si vous le souhaitez, puis appuyez sur "Installer" sur l'écran.</p>
                    <div className="center_div_tuto">
                        <img src="./assets/tuto/and3.jpg" alt="share" className='img_tuto' />
                    </div>

                    <h2>C'est fait ! :</h2>
                    <p>Vous verrez maintenant l'icône de notre PWA sur votre écran d'accueil, prête à être utilisée à tout moment.</p>
                </div>
            )}

            <h4>Pourquoi installer une PWA sur votre appareil ?</h4>
            <p>Une Progressive Web App (PWA) est une application web qui offre une expérience utilisateur enrichie, semblable à celle d'une application native, sans nécessiter de téléchargement depuis un store.</p>

            <div className='container_card_tuto classic'>
                <h3 className='italic'>Accès rapide :</h3>
                <p>Une fois installée, l'application est accessible directement depuis votre écran d'accueil, comme n'importe quelle autre application.</p>

                <h3 className='italic'>Expérience utilisateur optimisée :</h3>
                <p>Notre PWA est conçue pour offrir une navigation fluide, rapide, et optimisée, même avec une connexion internet limitée.</p>

                <h3 className='italic'>Mises à jour automatiques :</h3>
                <p>Profitez des dernières fonctionnalités et améliorations sans avoir à effectuer de mises à jour manuelles.</p>

                <h3 className='italic'>Gain de place :</h3>
                <p>Contrairement aux applications natives, une PWA occupe beaucoup moins d'espace sur votre appareil.</p>
            </div>

            <p>En installant notre PWA, vous profitez d'une navigation optimisée et d'une expérience utilisateur améliorée, directement depuis votre écran d'accueil.</p>

            <h3 style={{ marginTop: "20px" }}>Installation possible sur :</h3>
            <li>IOS</li>
            <li>Android</li>
            <li>MacOs</li>
            <li>Windows</li>
            <li>TV</li>
            <li>Meta Quest</li>

            <div className="center_div_tuto">
                <img src="./logo192.png" alt="logo" style={{ width: '140px' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
                <VersionApp />
            </div>
        </div>
    );
};

export default Tutorial;
