import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoQrCodeOutline, IoQrCode } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import { HiOutlineLocationMarker, HiLocationMarker } from "react-icons/hi";
import { FaRegUser, FaUser } from "react-icons/fa";

const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    return (
        <div className="layout-navbar">
            <div className="btn_nav">
                <button onClick={() => navigate('/qrcode')} className='z1'>
                    {isActive('/qrcode') ? <IoQrCode size={24} style={{ color: "#FFCE10" }} /> : <IoQrCodeOutline size={24} />}
                </button>
                <button onClick={() => navigate('/alert')}>
                    {isActive('/alert') ? <IoNotifications size={24} style={{ color: "#FFCE10" }} /> : <IoMdNotificationsOutline size={26} />}
                </button>

                <button className={`custom_home ${isActive('/') ? 'active_home' : ''}`} onClick={() => navigate('/')}>
                    {isActive('/') ? <IoHomeSharp size={24} /> : <IoHomeOutline size={24} />}
                </button>


                <button onClick={() => navigate('/map')}>
                    {isActive('/map') ? <HiLocationMarker size={26} style={{ color: "#FFCE10" }} /> : <HiOutlineLocationMarker size={24} />}
                </button>
                <button onClick={() => navigate('/user')} className='z2'>
                    {isActive('/user') ? <FaUser size={22} style={{ color: "#FFCE10" }} /> : <FaRegUser size={22} />}
                </button>
            </div>
        </div>
    );
};

export default Nav;
