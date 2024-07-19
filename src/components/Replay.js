import React from "react";

function Replay(props){
    if(props.isReplay)
   return(
       <div id="myModal2" className="modal"  style={{display:'inline-block',width:'200px',left: '10px',top: '80%'}}>
           <div className="modal-content" style={{backgroundColor: '#C0C0C0'}}>
               <div >
                   <tr style={{display:'inline-block'}}>Enter Id</tr>
                   <input style={{display:'inline-block'}}
                          type="text"
                          id="message"
                          name="message"
                          onChange={props.handleChange}
                   />
               </div >

               <button  data-toggle="collapse" data-target="#navbarNavDropdown">
                   <span style={{display:'inline-block',width:'200px'}} className="close" onClick={props.replay}>Replay</span>
               </button>
           </div>
       </div>

   )
    else
        return null;


}
export default Replay;