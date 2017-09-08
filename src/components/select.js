import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Dropdown as SelectUI } from 'semantic-ui-react';

export function Select({ cursor, ...props }) {
    let value = cursor.get();
    if (!_.includes(_.map(props.options, (o) => o.value), value)) {
        value = undefined;
    }

    return (
        <SelectUI
            value={value}
            onChange={(e, data) => cursor.set(data.value)}
            {...props}
        />
    );
}

Select.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
