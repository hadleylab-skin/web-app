import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Table, Grid, Header, Image, Input } from 'semantic-ui-react';
import schema from '../../libs/state';

export const PatientPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <Patient {...this.props} />;
    },
});

const Patient = schema({})(React.createClass({
    propTypes: {
        patientCursor: BaobabPropTypes.cursor.isRequired,
    },

    render() {
        return (
            <div>
                {JSON.stringify(this.props.patientCursor.get())}
            </div>
        );
    },
}));

