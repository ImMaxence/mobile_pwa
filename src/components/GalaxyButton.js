import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GalaxyButton = ({ text = "Explore", onClick }) => {

    const navigate = useNavigate()

    useEffect(() => {
        const random = (min, max) =>
            Math.floor(Math.random() * (max - min + 1) + min);
        const particles = document.querySelectorAll('.galaxy-button .star');

        particles.forEach((p) => {
            p.setAttribute(
                'style',
                `
        --angle: ${random(0, 360)};
        --duration: ${random(6, 20)};
        --delay: ${random(1, 10)};
        --alpha: ${random(40, 90) / 100};
        --size: ${random(2, 6)};
        --distance: ${random(40, 200)};
      `
            );
        });
    }, []);

    return (
        <div className="galaxy-button just_sha" onClick={() => navigate('/detail/ia')}>
            <button onClick={onClick}>
                <span className="spark"></span>
                <span className="backdrop"></span>

                <span className="galaxy__container">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span key={`static-${i}`} className="star star--static"></span>
                    ))}
                </span>

                <span className="galaxy">
                    <span className="galaxy__ring">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <span key={`ring-${i}`} className="star"></span>
                        ))}
                    </span>
                </span>

                {/* Nouveau wrapper autour du texte */}
                <span className="galaxy-content">
                    <span className="text">{text}</span>
                </span>
            </button>

            <div className="bodydrop"></div>
        </div>
    );
};

export default GalaxyButton;
