import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as VehicleIncidentsStore from '../store/VehicleIncidents';
import { CreateVehicleIncidentForm } from '../store/VehicleIncidents';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { returnInputConfiguration } from '../utility/InputConfiguration';
import * as formUtilityActions from '../utility/FormUtility';
import UIInput from '../UI/Inputs/UIInput';
import 'react-datepicker/dist/react-datepicker.css';

interface IProps { }
interface IState {
    createIncidentForm: any,
    isFormValid: boolean
}
type AddIncidentProps = IProps & RouteComponentProps
    & typeof VehicleIncidentsStore.actionCreators;

class AddIncident extends React.Component<AddIncidentProps, IState> {

    constructor(props: AddIncidentProps) {
        super(props);
        this.state = {
            createIncidentForm: null,
            isFormValid: false
        }
    }

    componentDidMount() {
        this.setState({ createIncidentForm: returnInputConfiguration() });
    }

    handleChangeEvent = (event: React.ChangeEvent<HTMLInputElement>, id: React.ReactText) => {
        const updatedIncidentForm = { ...this.state.createIncidentForm };
        updatedIncidentForm[id] = formUtilityActions.executeValidationAndReturnFormElement(event, updatedIncidentForm, id);

        const counter = formUtilityActions.countInvalidElements(updatedIncidentForm);
        console.log("valid counter: ", counter);
        console.log("updatedIncidentForm");
        console.log(updatedIncidentForm);
        this.setState({ createIncidentForm: updatedIncidentForm, isFormValid: counter === 0 })
    }

    render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel">Add Vehicle Incident</h1>
                {this.renderAddIncidentForm()}
            </React.Fragment>
        );
    }

    addNewIncident = (event: React.FormEvent) => {

        event.preventDefault();

        const incidentToCreate: CreateVehicleIncidentForm = {
            vin: this.state.createIncidentForm.vin.value,
            dateTime: this.state.createIncidentForm.dateTime.value,
            note: this.state.createIncidentForm.note.value
        }

        this.props.createVehicleIncident(incidentToCreate, 0);
        this.props.history.push("/view-incidents");
    };

    renderAddIncidentForm() {
        const formElementsArray = formUtilityActions.convertStateToArrayOfFormObjects({ ...this.state.createIncidentForm });
        return (
            <form onSubmit={this.addNewIncident} className="Add-article">
                {
                    formElementsArray.map(element => {
                        return <UIInput key={element.id} elementType={element.config.element}
                            id={element.id} label={element.config.label}
                            type={element.config.type} value={element.config.value}
                            changed={(event: any) => this.handleChangeEvent(event, element.id)}
                            errorMessage={element.config.errorMessage}
                            invalid={!element.config.valid} shouldValidate={element.config.validation}
                            touched={element.config.touched}
                            blur={(event: any) => this.handleChangeEvent(event, element.id)} />
                    })
                }
                <button disabled={!this.state.isFormValid}>
                    Add Vehicle Incident
                </button>
            </form>
        );
    }
};

export default withRouter(connect(
(state: ApplicationState) => state.vehicleIncidents, 
  VehicleIncidentsStore.actionCreators
)(AddIncident as any));
