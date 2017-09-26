import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { GridWrapper } from 'components';
import schema from 'libs/state';
import { Grid, Header, Button } from 'semantic-ui-react';

export const DoctorResistrationRequestsPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <DoctorResistrationRequests {...this.props} />;
    },
});

const model = {
    tree: {
    },
};

const DoctorResistrationRequests = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },
    render() {
        return (
            <Header>Registration requests</Header>
        );
    },
}));
