import React, { useState } from 'react';
import { FormGroup, Col, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import DateTimePicker from 'react-datetime-picker';
import 'react-datepicker/dist/react-datepicker.css';
import './UIInput.css';


const UIInput = (props) => {
    let inputField = null;
    let errorMessage = null;

    if(props.invalid && props.shouldValidate && props.touched){
        errorMessage = (<em>{props.errorMessage}</em>);
    }

    switch (props.elementType) {
        case 'input':
            inputField = (
                <FormGroup controlId={props.id}>
                    <Col sm={2}>
                        {props.label}
                    </Col>
                    <Col sm={6}>
                        <FormControl type={props.type} value={props.value} onChange={props.changed} onBlur={props.blur} />
                    </Col>
                    <Col>
                        <em>{errorMessage}</em>
                    </Col>
                </FormGroup>
            )
            break;
        case 'datePicker':
            inputField = (
                <FormGroup controlId={props.id}>
                    <Col sm={2}>
                        {props.label}
                    </Col>
                    <Col sm={6}>
                        <DateTimePicker onChange={props.changed} value={props.value}/>
                    </Col>
                    <Col>
                        <em>{errorMessage}</em>
                    </Col>
                </FormGroup>
            )
            break;
        default: inputField = null;
    }
    
    return (
        <React.Fragment>
            {inputField}
        </React.Fragment>
    )
}
 
export default UIInput;