import React from 'react';
import version from "../../package.json"

const VersionApp = () => {
    return (
        <div>
            <p style={{ color: 'grey' }}>v{version.version}</p>
        </div>
    );
};

export default VersionApp;