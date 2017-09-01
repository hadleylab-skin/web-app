import React from 'react';
import schema from '../../libs/state';

const model = (props, context) => ({
    tree: {
        patients: context.services.patientsService,
    },
});


export const PatientList = schema(model)(React.createClass({
    contextTypes: {
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
        }),
    },

    render() {
        return (
            <div>
                {JSON.stringify(this.props.tree.patients.get())}
            </div>
        );
    },
}));
