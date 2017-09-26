import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import DatePickerDefault from 'react-datepicker';
import moment from 'moment';

const dateRe = new RegExp('^\\d{2}\/\\d{2}\/\\d{4}');

export function DatePicker({ cursor, ...props }) {
    const date = moment(cursor.get());
    const selected = date.isValid() ? date : moment();
    const onChange = (newDate) => cursor.set(newDate ? newDate.format() : null);
    const onChangeRaw = (e) => {
        const value = e.target.value;
        if (dateRe.exec(value) != null) {
            cursor.set(value);
        } else {
            e.target.value = selected.format('MM/DD/YYYY');
        }
    };
    return (
        <DatePickerDefault
            selected={selected}
            onChange={onChange}
            onBlur={onChangeRaw}
            {...props}
        />
    );
}

DatePicker.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
