export const convertStateToArrayOfFormObjects = (formObject: { [x: string]: any; }) => {
    const formElementsArray = [];
    for (let key in formObject) {
        formElementsArray.push({
            id: key,
            config: formObject[key]
        });
    }

    return formElementsArray;
}

const checkValidity = (value: string, validation: { required: any; maxLength: string | number; maxValue: string | number; }) => {
    let validationObject = {
        isValid: true,
        errorMessage: ''
    };

    if (validation) {
        if (validation.required) {
            validationObject.isValid = value.trim() !== '';
            validationObject.errorMessage = validationObject.isValid ? '' : 'Field is required';
        }

        if (validationObject.isValid && validation.maxLength) {
            validationObject.isValid = value.length <= validation.maxLength;
            validationObject.errorMessage = 'Not allowed more than ' + validation.maxLength + ' charactes';
        }

        return validationObject;
    }
    else {
        return validationObject;
    }
}

export const executeValidationAndReturnFormElement = (event: React.ChangeEvent<HTMLInputElement>, updatedOwnerForm: { [x: string]: any; }, id: string | number) => {
    let formElement = { ...updatedOwnerForm[id] };

    if (formElement.element == "datePicker") {
        console.log("formElement: datePicker")
        formElement.value = event;
    } else {
        formElement.value = event.target.value;
    }

    formElement.touched = true;

    const validationResponse = checkValidity(formElement.value, formElement.validation);

    formElement.valid = validationResponse.isValid;
    formElement.errorMessage = validationResponse.errorMessage;

    console.log("formElement" + formElement.element)
    console.log(formElement)

    return formElement;
}

export const countInvalidElements = (ownerForm: { [x: string]: { valid: any; }; }) => {
    let countInvalidElements = 0;
    for (let element in ownerForm) {
        if (!ownerForm[element].valid && element !== "dateTime") {
            countInvalidElements = countInvalidElements + 1;
            break;
        }
    }
    return countInvalidElements;
}