import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import Layout from "../components/Layout";
import { Sheet } from "react-modal-sheet";
import { addHiveToGroup, getGroups } from "../services/hiveService";
import { useNavigate } from "react-router-dom";

const Qrcode = () => {
    const navigate = useNavigate()
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const scanInterval = useRef(null);
    const [error, setError] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [scanResult, setScanResult] = useState("");

    const startScanLoop = () => {
        const video = videoRef.current;
        if (!video) {
            console.log("startScanLoop: vidéo non définie, on retente dans 300ms");
            setTimeout(startScanLoop, 300);
            return;
        }
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.log("startScanLoop: vidéo pas prête (width ou height = 0), on retente dans 300ms");
            setTimeout(startScanLoop, 300);
            return;
        }
        if (scanInterval.current) clearInterval(scanInterval.current);
        scanInterval.current = setInterval(scanQRCode, 100);
        console.log("Scan démarré");
    };

    const stopScanLoop = () => {
        if (scanInterval.current) {
            clearInterval(scanInterval.current);
            scanInterval.current = null;
            console.log("Scan arrêté");
        }
    };

    const scanQRCode = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Vérifie que la vidéo est bien initialisée
        if (canvas.width === 0 || canvas.height === 0) {
            return; // La vidéo n’est pas encore prête
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            stopScanLoop(); // ⛔️ Stopper le scan après détection
            console.log("QR détecté:", code.data);

            let result = "non valide";
            let apiHiveValue = null;

            try {
                const data = JSON.parse(code.data);
                if (data.APIHIVE) {
                    result = "valide";
                    apiHiveValue = data.APIHIVE; // 🐝 Récupère la valeur de APIHIVE
                }
            } catch (err) {
                console.warn("QR invalide:", err);
                result = "non valide";
            }

            setScanResult(result);
            setApiHiveValue(apiHiveValue);
            setErrorMessage(null)// 🟩 Stocker la valeur dans le state
            setIsSheetOpen(true);          // 👇 Ouvre le Sheet
        }
    };


    useEffect(() => {
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    videoRef.current.onloadedmetadata = () => {
                        console.log("Vidéo prête, démarrage du scan");
                        startScanLoop();
                    };
                }
            } catch (err) {
                setError("Impossible d'accéder à la caméra: " + err.message);
            }
        }

        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
            stopScanLoop();
            console.log("Composant démonté, caméra arrêtée");
        };
    }, []);

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        // Restart scan après délai pour être sûr que tout est prêt
        setTimeout(() => {
            console.log("Redémarrage du scan après fermeture du sheet");
            startScanLoop();
        }, 500);
    };

    const [passwordRuche, setPasswordRuche] = useState("");
    const [apiHiveValue, setApiHiveValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const sendData = async () => {
        setErrorMessage(null);
        try {


            const myGroupe = await getGroups()

            const defaultGroup = myGroupe.find((group) => group.default === true);

            if (!defaultGroup) {
                setErrorMessage("Aucun groupe par défaut trouvé.");
                return;
            }
            const defaultGroupId = defaultGroup.id;

            console.log("QRCODE ASSOCIATION");
            console.log("defaultGroupId", defaultGroupId);
            console.log("apiHiveValue", apiHiveValue);
            console.log("passwordRuche", passwordRuche);

            await addHiveToGroup(defaultGroupId, { rucheId: apiHiveValue, ruchePassword: passwordRuche });
            setIsSheetOpen(false);
            setErrorMessage(null);
            navigate('/')
        } catch (err) {
            setErrorMessage(err)
        }
    };

    return (
        <Layout>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "black",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 1,
                    }}
                />

                <canvas ref={canvasRef} style={{ display: "none" }} />

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 2,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "250px",
                        height: "250px",
                        border: "3px solid #00ff00",
                        borderRadius: "12px",
                        transform: "translate(-50%, -50%)",
                        zIndex: 3,
                        boxSizing: "border-box",
                    }}
                />

                {error && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "20px",
                            width: "100%",
                            textAlign: "center",
                            color: "red",
                            zIndex: 4,
                        }}
                    >
                        {error}
                    </div>
                )}
            </div>
            <Sheet isOpen={isSheetOpen} onClose={handleCloseSheet}>
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        {scanResult === "valide" ? (
                            <>
                                ✅ QR code officiel
                                <label>
                                    Rentrez le mot de passe de la ruche (reçu par email lors de l'achat)
                                </label>
                                <input
                                    type="password"
                                    value={passwordRuche}
                                    onChange={(e) => setPasswordRuche(e.target.value)}

                                />
                                <button
                                    onClick={sendData}
                                >
                                    Associer la ruche
                                </button>

                                <button onClick={() => setIsSheetOpen(false)}>Annuler</button>

                                {errorMessage && (
                                    <div style={{ color: "red", textAlign: "center" }}>
                                        {errorMessage}
                                    </div>
                                )}
                            </>
                        ) : (
                            <h3 style={{ color: "red", textAlign: "center" }}>
                                ❌ QR code non officiel
                                <button onClick={() => setIsSheetOpen(false)}>Fermer</button>
                            </h3>
                        )}
                    </Sheet.Content>

                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

        </Layout>
    );
};

export default Qrcode;
