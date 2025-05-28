import React from 'react';

const VersionApp = () => {
    return (
        <div>
            <p style={{ color: 'grey' }}>v{process.env.REACT_APP_VERSION}</p>
        </div>
    );
};

export default VersionApp;