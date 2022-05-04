import React from 'react';

export default function Alert(props) {

    let className = "alert alert-dismissible mt-3";
    let message = "";
    if(props.alert.success !== undefined){
        className += " alert-success";
        message = props.alert.success;
    }
    else{
        className += " alert-primary";
        message = props.alert.error;
    }

    return (
        <div>
            <div className={className}>
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                <strong>{message}</strong>
            </div>
        </div>

    )
}