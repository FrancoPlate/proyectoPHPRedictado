import React from "react";
import { Link } from "react-router-dom";
//import '../assets/styles/header.css'
import ajoloteN from '../assets/ajolote.png'
import ajoloteA from '../assets/ajolote_boca_abierta.png'
 function Header(){
    return(
        <div className="">
            <div className="logo">
                <Link to='/'><img class=" h-25 w-auto" src={ajoloteN} alt="logo" /></Link>
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