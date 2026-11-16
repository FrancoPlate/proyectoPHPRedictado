import React, {useState} from "react";
import ajoloteN from '../assets/ajolote.png'
import ajoloteA from '../assets/ajolote_boca_abierta.png'

function Footer(){

    const [currentImg, setCurrentImg] = useState(ajoloteN);
    const integrantes = ["Leonardo Fernandez", "Franco Plate"];
    return(
        <div className="flex flex-row justify-between">
            <div className="w-auto max-w-35 flex flex-col items-center justify-center">
                {integrantes.length >0 ? 
                    (
                        integrantes.map((inte,index) => 
                            <p key={index} className=" w-40 text-[16px] font-medium">{inte}</p>
                        )
                    ):(
                        <></>
                    )
                }
            </div>
            <div className="flex flex-col max-w-35 justify-center items-center">
                <img 
                    className=" h-35 w-auto"
                    src={currentImg} 
                    onMouseEnter={() => setCurrentImg(ajoloteA)}
                    // Al salir el cursor, volvemos a la imagen original
                    onMouseLeave={() => setCurrentImg(ajoloteN)}
                    alt="logo" />

                <div className="pb-3">
                    <h2 className="text-2xl font-medium">WhapsAjo</h2>
                </div>
                
            </div>
            <div  className="flex items-center justify-center w-35">
                
                <h4 className="text-2xl font-medium">©{new Date().getFullYear()}</h4>

            </div>
        </div>
    )
}

export default Footer