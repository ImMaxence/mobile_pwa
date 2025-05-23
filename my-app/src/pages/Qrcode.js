import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import Layout from "../components/Layout";
import { Sheet } from "react-modal-sheet";
import { addHiveToGroup, getGroups } from "../services/hiveService";
import { useNavigate } from "react-router-dom";

const Qrcode = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const scanInterval = useRef(null);
    const streamRef = useRef(null);

    const [cameraStarted, setCameraStarted] = useState(false);
    const [error, setError] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [scanResult, setScanResult] = useState("");
    const [passwordRuche, setPasswordRuche] = useState("");
    const [apiHiveValue, setApiHiveValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const startScanLoop = () => {
        const video = videoRef.current;
        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
            setTimeout(startScanLoop, 300);
            return;
        }
        if (scanInterval.current) clearInterval(scanInterval.current);
        scanInterval.current = setInterval(scanQRCode, 100);
        console.log("✅ Scan démarré");
    };

    const stopScanLoop = () => {
        if (scanInterval.current) {
            clearInterval(scanInterval.current);
            scanInterval.current = null;
            console.log("⏹️ Scan arrêté");
        }
    };

    const scanQRCode = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (canvas.width === 0 || canvas.height === 0) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            stopScanLoop();
            console.log("📸 QR détecté:", code.data);

            let result = "non valide";
            let apiHiveValue = null;

            try {
                const data = JSON.parse(code.data);
                if (data.APIHIVE) {
                    result = "valide";
                    apiHiveValue = data.APIHIVE;
                }
            } catch (err) {
                console.warn("QR invalide:", err);
            }

            setScanResult(result);
            setApiHiveValue(apiHiveValue);
            setErrorMessage(null);
            setIsSheetOpen(true);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    console.log("🎥 Vidéo prête");
                    startScanLoop();
                };
            }
            setCameraStarted(true);
        } catch (err) {
            setError("Impossible d'accéder à la caméra: " + err.message);
        }
    };

    const stopCamera = () => {
        const stream = streamRef.current;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        stopScanLoop();
        console.log("🎞️ Caméra arrêtée");
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                stopCamera();
            }
        };

        window.addEventListener("beforeunload", stopCamera);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            stopCamera();
            window.removeEventListener("beforeunload", stopCamera);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setTimeout(() => {
            console.log("🔁 Redémarrage du scan");
            startScanLoop();
        }, 500);
    };

    const sendData = async () => {
        setErrorMessage(null);
        try {
            const myGroupe = await getGroups();
            const defaultGroup = myGroupe.find((group) => group.default === true);
            if (!defaultGroup) {
                setErrorMessage("Aucun groupe par défaut trouvé.");
                return;
            }

            const defaultGroupId = defaultGroup.id;
            await addHiveToGroup(defaultGroupId, {
                rucheId: apiHiveValue,
                ruchePassword: passwordRuche,
            });

            setIsSheetOpen(false);
            setErrorMessage(null);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.message || err.toString());
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
                        top: "50%",
                        left: "50%",
                        width: "250px",
                        height: "250px",
                        border: "4px solid #FFCE10",
                        borderRadius: "12px",
                        transform: "translate(-50%, -50%)",
                        zIndex: 3,
                        boxSizing: "border-box",
                    }}
                />
                {!cameraStarted && (
                    <div
                        style={{
                            zIndex: 10,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.85)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: 20,
                            textAlign: "center",
                        }}
                    >
                        <p style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
                            Pour lancer le scan, autorisez l'accès à la caméra
                        </p>
                        <button className="general_btn" onClick={startCamera}>
                            Démarrer la caméra
                        </button>
                    </div>
                )}
                {error && (
                    <div
                        style={{
                            position: "absolute",
                            padding: "20px",
                            bottom: "20px",
                            width: "100%",
                            textAlign: "center",
                            zIndex: 4,
                        }}
                        className="error_lab"
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
                            <div style={{ padding: "20px" }}>
                                <h3 style={{ textAlign: "center", padding: "20px" }}>
                                    ✅ QR code officiel
                                </h3>
                                <label>
                                    Rentrez le mot de passe de la ruche (reçu par email lors de l'achat)
                                </label>
                                <input
                                    type="password"
                                    value={passwordRuche}
                                    onChange={(e) => setPasswordRuche(e.target.value)}
                                    className="general_input"
                                    style={{ marginBottom: "40px" }}
                                />
                                <button className="general_btn" onClick={sendData}>
                                    Associer la ruche
                                </button>
                                <button
                                    style={{ marginLeft: "20px" }}
                                    className="cancel_btn"
                                    onClick={() => setIsSheetOpen(false)}
                                >
                                    Annuler
                                </button>
                                {errorMessage && (
                                    <div className="error_lab" style={{ textAlign: "center" }}>
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ padding: "20px" }}>
                                <h3 className="error_lab" style={{ textAlign: "center", padding: "20px" }}>
                                    ❌ QR code non officiel
                                </h3>
                                <button className="general_btn w100" onClick={() => setIsSheetOpen(false)}>
                                    Fermer
                                </button>
                            </div>
                        )}
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </Layout>
    );
};

export default Qrcode;
