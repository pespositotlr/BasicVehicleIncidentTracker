import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import ViewIncidents from './components/ViewIncidents';
import AddNewIncident from './components/AddNewIncident';

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/view-incidents/:startDateIndex?' component={ViewIncidents} />
        <Route exact path='/add-new-incident/' component={AddNewIncident} />
    </Layout>
);
