import React, {useState} from "react";
import {Marker} from "react-leaflet";

function Alert(props){
    if(props.alert)
        return (

            <div id="myModal4" className="modal"  style={{display:'inline-block',width:'200px',height:'30px', left: '750px',top: '10px' } }>
                <div className="modal-content" style={{backgroundColor: '#091B32',color:'white'}}>
                    {props.dev} {props.message}

                </div>
            </div>


        )
    else return  null



}
export default Alert;
