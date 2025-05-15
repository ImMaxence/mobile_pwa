import React from 'react';

const VersionApp = () => {
    return (
        <div>
            <p>v{process.env.REACT_APP_VERSION}</p>
        </div>
    );
};

export default VersionApp;