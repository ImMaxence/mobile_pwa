import React from 'react';

import { useNavigate } from 'react-router-dom';

const MyGroups = ({ type, name, img1, img2, img3, img4, desc, hive_name, groupID }) => {

    const navigate = useNavigate();

    const handleNav = () => {
        localStorage.setItem("currentGroupId", groupID)
        localStorage.setItem("currentGroupType", type)
        router.push(`/details/groupDetail/${name}`)
    }

    return (
        <div>

        </div>
    );
};

export default MyGroups;