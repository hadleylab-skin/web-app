import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import schema from 'libs/state';

const Doctor = schema({})(React.createClass({
    propTypes: {
        doctorCursor: BaobabPropTypes.cursor.isRequired,
    },

    render() {
        return (
            <div>
                {JSON.stringify(this.props.doctorCursor)}
            </div>
        );
    },
}));

export const DoctorPage = React.createClass({
    contextTypes: {
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
        }),
    },
    render() {
        return (
            <Doctor
                doctorCursor={this.context.cursors.doctor}
            />
        );
    },
});
