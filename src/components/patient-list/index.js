import React from 'react';
import _ from 'lodash';
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
        const patients = this.props.tree.patients.get();
        if (patients.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(this.props.tree.patients.get())}
                </div>
            );
        }
        return (
            <table>
                <tbody>
                    <tr><th>first name</th><th>last name</th></tr>
                    {_.map(patients.data, (patient) => (
                        <tr key={patient.data.pk}>
                            <td>{patient.data.firstName}</td><td>{patient.data.lastName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
}));
