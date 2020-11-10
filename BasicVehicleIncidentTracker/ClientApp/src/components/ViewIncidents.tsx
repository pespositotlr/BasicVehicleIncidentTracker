import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as VehicleIncidentsStore from '../store/VehicleIncidents';
import { VehicleIncident } from '../store/VehicleIncidents';
import DatePicker from 'react-datepicker';
import { FormGroup, Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

// At runtime, Redux will merge together...
type VehicleIncidentProps =
    VehicleIncidentsStore.VehicleIncidentsState // ... state we've requested from the Redux store
    & typeof VehicleIncidentsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

interface VehicleIncidentState {
    globalSearch: string
    startDateFilter: Date | null | undefined,
    endDateFilter: Date | null | undefined
}

class ViewIncidents extends React.Component<VehicleIncidentProps, VehicleIncidentState> {

  constructor(props: VehicleIncidentProps) {
    super(props);
    this.state = {
        globalSearch: '',
        startDateFilter: null,
        endDateFilter: null
    }
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  handleKeyUp(event: React.ChangeEvent<HTMLInputElement>) {
     event.preventDefault()
     this.setState({ globalSearch: event.target.value })
  }

  setStartDate(startDate: any) {
      this.setState({ startDateFilter: startDate })
  }

  setEndDate(endDate: any) {
      this.setState({ endDateFilter: endDate.setHours(23, 59, 59, 999) })
  }

  private ensureDataFetched() {
      const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
      this.props.requestVehicleIncidents(startDateIndex);
  }

  private getFilteredIncidents(incidents: VehicleIncident[]) {
      incidents = incidents.filter(x => x.vin.includes(this.state.globalSearch));
      if (this.state.startDateFilter) {
          incidents = incidents.filter(d => new Date(d.dateTime) >= this.state.startDateFilter!);
      }
      if (this.state.endDateFilter) {
          incidents = incidents.filter(d => new Date(d.dateTime) <= this.state.endDateFilter!);
      }
      return incidents;
  }

  public render() {
      return (
          <React.Fragment>
              <h1 id="tabelLabel">Vehicle Incidents</h1>
              {this.renderFilters()}
              {this.renderVehicleIncidentsTable()}
              {this.renderPagination()}
          </React.Fragment>
      );
    }

  private renderFilters() {
        return (
            <React.Fragment>
                <FormGroup>
                    <Col sm={2}>
                        Search
                    </Col>
                    <Col sm={3}>
                        <input type="text" placeholder="Search..." name="search" className="searchInput" onChange={this.handleKeyUp} value={this.state.globalSearch} id="search_txt" />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col sm={2}>
                        Filter By Start Date:
                    </Col>
                    <Col sm={3}>
                        <DatePicker
                            selected={this.state.startDateFilter}
                            onChange={startDate => this.setStartDate(startDate)} />
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col sm={2}>
                        Filter By End Date:
                    </Col>
                    <Col sm={3}>
                        <DatePicker
                            selected={this.state.endDateFilter}
                            onChange={endDate => this.setEndDate(endDate)}/>
                    </Col>
                </FormGroup>
            </React.Fragment>
        );
  }

  private renderVehicleIncidentsTable() {
    let incidents = this.getFilteredIncidents(this.props.vehicleIncidents);
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>VIN</th>
            <th>Date and Time</th>
            <th>Note</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
         {incidents.map((vehicleIncident: VehicleIncidentsStore.VehicleIncident) =>
            <tr key={vehicleIncident.id}>
                <td>{vehicleIncident.vin}</td>
                <td>{new Date(vehicleIncident.dateTime).toLocaleString()}</td>
                <td style={{ maxWidth: 300, wordWrap: 'break-word' }}>{vehicleIncident.note !== "" ? vehicleIncident.note : "(None)"}</td>
                <td>{vehicleIncident.make !== null ? vehicleIncident.make : "N/A"}</td>
                <td>{vehicleIncident.model !== null ? vehicleIncident.model : "N/A"}</td>
                <td>{vehicleIncident.year > 0 ? vehicleIncident.year : "N/A"}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  private renderPagination() {
    return (
      <div className="d-flex justify-content-between">
        {this.props.isLoading && <span>Loading...</span>}
      </div>
    );
  }
}

export default connect(
(state: ApplicationState) => state.vehicleIncidents, // Selects which state properties are merged into the component's props
  VehicleIncidentsStore.actionCreators // Selects which action creators are merged into the component's props
)(ViewIncidents as any);
