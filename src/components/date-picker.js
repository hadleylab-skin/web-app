import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import DatePickerDefault from 'react-datepicker';
import moment from 'moment';

export function DatePicker({ cursor, ...props }) {
    const date = moment(cursor.get());
    return (
        <DatePickerDefault
            selected={date.isValid() ? date : moment()}
            onChange={(newDate) => cursor.set(newDate.format())}
            {...props}
        />
    );
}

DatePicker.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
