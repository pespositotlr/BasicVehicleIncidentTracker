import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface VehicleIncidentsState {
    isLoading: boolean;
    startDateIndex?: number;
    vehicleIncidents: VehicleIncident[];
}

export interface VehicleIncident {
    id: number;
    vin: string;
    dateTime: Date;
    note: string;
    make: string;
    model: string;
    year: number;
}

export interface CreateVehicleIncidentForm {
    vin: string;
    dateTime: Date;
    note: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestVehicleIncidentsAction {
    type: 'REQUEST_VEHICLE_INCIDENTS';
    startDateIndex: number;
}

interface ReceiveVehicleIncidentsAction {
    type: 'RECEIVE_VEHICLE_INCIDENTS';
    startDateIndex: number;
    vehicleIncidents: VehicleIncident[];
}

interface CreateVehicleIncidentAction {
    type: 'CREATED_VEHICLE_INCIDENT';
    startDateIndex: number;
    vehicleIncidents: VehicleIncident[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestVehicleIncidentsAction | ReceiveVehicleIncidentsAction | CreateVehicleIncidentAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestVehicleIncidents: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicleIncidents && startDateIndex !== appState.vehicleIncidents.startDateIndex) {
            console.log('fetching get-vehicle-incidents');
            fetch(`api/get-vehicle-incidents`)
                .then(response => response.json() as Promise<VehicleIncident[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_VEHICLE_INCIDENTS', startDateIndex: startDateIndex, vehicleIncidents: data });
                });

            dispatch({ type: 'REQUEST_VEHICLE_INCIDENTS', startDateIndex: startDateIndex });
        }
    },
    createVehicleIncident: (request: CreateVehicleIncidentForm, startDateIndex: number): AppThunkAction<KnownAction> => (dispatch) => {
        if (request) {
            fetch(`api/create-vehicle-incident`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vin: request.vin,
                    dateTime: request.dateTime,
                    note: request.note
                })
            }).then((resp) => {
                // handle bad exceptions and get the right error message
                if (resp.status !== 200) {
                    fetch(`api/get-vehicle-incidents`)
                        .then(response => response.json() as Promise<VehicleIncident[]>)
                        .then(data => {
                            console.log("data", data);
                            dispatch({ type: 'CREATED_VEHICLE_INCIDENT', startDateIndex: startDateIndex, vehicleIncidents: data });
                        });
                }
            })

            dispatch({ type: 'REQUEST_VEHICLE_INCIDENTS', startDateIndex: startDateIndex + 1 });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: VehicleIncidentsState = { vehicleIncidents: [], isLoading: false };

export const reducer: Reducer<VehicleIncidentsState> = (state: VehicleIncidentsState | undefined, incomingAction: Action): VehicleIncidentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_VEHICLE_INCIDENTS':
            return {
                startDateIndex: action.startDateIndex,
                vehicleIncidents: state.vehicleIncidents,
                isLoading: true
            };
        case 'RECEIVE_VEHICLE_INCIDENTS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    vehicleIncidents: action.vehicleIncidents,
                    isLoading: false
                };
            }
            break;
        case 'CREATED_VEHICLE_INCIDENT':
            return {
                startDateIndex: action.startDateIndex,
                vehicleIncidents: action.vehicleIncidents,
                isLoading: false
            }
            break;
    }

    return state;
};
