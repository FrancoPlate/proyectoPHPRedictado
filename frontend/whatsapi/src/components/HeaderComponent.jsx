import React, { useState } from "react";
import { Link } from "react-router-dom";
//import '../assets/styles/header.css'
import ajoloteN from '../assets/ajolote.png'
import ajoloteA from '../assets/ajolote_boca_abierta.png'
 function Header(){

    const [currentImg, setCurrentImg] = useState(ajoloteN);
    return(
        <div className="flex flex-row items-center">
            <div className="logo">
                <Link to='/'>
                    <img 
                        className=" h-25 w-auto "
                        src={currentImg} 
                        onMouseEnter={() => setCurrentImg(ajoloteA)}
                        //backdrop-brightness-[0] invert invertir del css
                        // Al salir el cursor, volvemos a la imagen original
                        onMouseLeave={() => setCurrentImg(ajoloteN)}
                        alt="logo" />
                </Link>
            </div>
            <div className="brr">
            </div>
            <div className="">
                <Link to='/'><h2 className="text-2xl font-medium">WhapsAjo</h2></Link>
            </div>
        </div>
    )
}

export default Header