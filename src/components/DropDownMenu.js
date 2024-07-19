import React from "react";

function DropDownMenu(props){
    return (
        <div className="btn-group dropup"
             style={{display: 'block', border: 'outset', position: 'fixed'}}
             data-target="#navbarNavDropdown">
            <button type="button" className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
                {props.menuType}
            </button>
            <div className="dropdown-menu">
                {props.menu.map(item => item)}
            </div>
        </div>


    )





}
export default DropDownMenu