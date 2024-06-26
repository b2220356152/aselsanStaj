import React from "react";

function ConnectionList(props){
        return(

                <ul className="list-group">
                    {
                        props.connections.map(item => <li className="list-group-item">{item}</li>)
                    }
                </ul>
        )





}
export default ConnectionList;