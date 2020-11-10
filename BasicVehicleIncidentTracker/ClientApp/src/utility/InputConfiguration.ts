export const returnInputConfiguration = () => {
    return {
        vin: {
            element: 'input', type: 'text', value: '',
            validation: { required: true, maxLength: 17}, valid: false, touched: false,
            errorMessage: '', label: 'VIN:'
        },
        dateTime: {
            element: 'datePicker', type: 'text', value: new Date(),
            validation: { required: false }, valid: true, touched: false,
            errorMessage: '', label: 'Date and Time:'
        },
        note: {
            element: 'input', type: 'text', value: '',
            validation: { required: false, maxLength: 500 }, valid: true, touched: false,
            errorMessage: '', label: 'Note:'
        }
    }
}