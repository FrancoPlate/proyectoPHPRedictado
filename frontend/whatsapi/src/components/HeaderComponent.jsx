import React from "react";
import { Link } from "react-router-dom";
//import '../assets/styles/header.css'
//import heroImg from '../assets/react.svg'
 function Header(){
    return(
        <div className="header">
            <div className="logo">
                <Link to='/'><img alt="logo"  /></Link>
            </div>
            <div className="brr">
            </div>
            <div className="titulo">
                <Link to='/'><h2>WhapsAjo</h2></Link>
            </div>
        </div>
    )
}

export default Header