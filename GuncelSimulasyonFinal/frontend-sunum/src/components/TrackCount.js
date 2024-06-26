import React from "react";

function TrackCount(length){
    return (<div id="myModal2" className="modal"  style={{display:'inline-block',width:'200px',  left: '1%',top: '1%',height:'50px'}}>
        <div className="modal-content" style={{backgroundColor: '#091B32'}}>

            <p style={{color:'white'}}>Track Count :{length.length}</p>
        </div>
    </div>)



}
export default TrackCount;