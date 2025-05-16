import React from 'react';

const Tutorial = () => {
    return (
        <div style={{ padding: '10px' }}>
            <h2>Comment installer notre PWA sur IOS</h2>
            <p>Suivez ces étapes simples pour ajouter notre PWA à votre écran d'accueil :</p>

            <div className='container_card_tuto'>
                <h4>Cliquez sur le bouton de partage :</h4>
                <p>En bas de l'ecran, repérez l'icône de partage, symbolisée par un carré avec une flèche vers le haut.</p>

                <div className="center_div_tuto">
                    <img src="./assets/tuto/image.png" alt="share" className='img_tuto' />
                </div>

                <h4>Sélectionnez "Ajouter à l'écran d'accueil" :</h4>
                <p>Dans le menu qui s'affiche, faites défiler vers le bas et appuyer sur l'option "Ajouter à l'écran d'accueil".</p>

                <div className="center_div_tuto">
                    <img src="./assets/tuto/2.png" alt="share" className='img_tuto' />
                </div>

                <h4>Confirmer l'installation :</h4>
                <p>Donnez un nom à l'application si vous le souhaitez, puis appuyez sur "Ajouter" en haut à droite de l'écran.</p>

                <div className="center_div_tuto">
                    <img src="./assets/tuto/3.png" alt="share" className='img_tuto' />
                </div>

                <h2>C'est fait ! :</h2>
                <p>Vous verrez maintenant l'icône de notre PWA sur votre écran d'accueil, prête à être utilisé à tout moment.</p>
            </div>

            <h4>Pourquoi installer une PWA sur votre appareil ?</h4>
            <p>Une Progressive Web App (PWA) est une application web qui offre une expérience utilisateur enrichie, semblable à celle d'une application native, sans nécessiter de téléchargement depuis un store.
                Voici quelques raisons pour lesquelles vous devriez envisager d'installer notre PWA sur votre appareil iOS :</p>

            <div className='container_card_tuto'>
                <h3 className='italic'>Accès rapide :</h3>
                <p>Une fois installée, l'application est accessible directement depuis votre écran d'accueil, comme n'importe quelle autre application.</p>

                <h3 className='italic'>Expérience utilisateur optimisée :</h3>
                <p>Notre PWA est conçue pour offrir une navigation fluide, rapide, et optimisée, même avec une connexion internet limitée.</p>

                <h3 className='italic'>Mises à jour automatiques :</h3>
                <p>Profitez des dernières fonctionnalités et améliorations sans avoir à effectuer de mises à jour manuelles.</p>

                <h3 className='italic'>Gain de place :</h3>
                <p>Contrairement aux applications natives, une PWA occupe beaucoup moins d'espace sur votre appareil.</p>
            </div>

            <p>En installant notre PWA, vous profitez d'une navigation optimisée et d'une expérience utilisateur améliorée, directement depuis votre écran d'accueil. N'attendez plus pour faire le pas !</p>

            <h3 style={{ marginTop: "20px" }}>Installation possible sur :</h3>
            <li>IOS</li>
            <li>Android</li>
            <li>PC</li>

            <div className="center_div_tuto">
                <img src="./logo192.png" alt="share" style={{ width: '140px' }} />
            </div>
        </div>
    );
};

export default Tutorial;