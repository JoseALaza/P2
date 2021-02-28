import React, { useState } from 'react'; // Most likely not needed

// Utilizes props that are passed down to determine index and onClick function
export function Square(props) {
    
    // Renders a single square with index property at id, the passed down onClick function, and the associated value
    return ( 
        <div className={'box '+'tile'+props.idx} id={props.idx} onClick={props.onClick}>
            {props.val}
        </div>
    );
}
