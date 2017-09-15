import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI } from 'semantic-ui-react';

export function Input({ cursor, toValue, fromValue, ...props }) {
    const _toValue = toValue || _.identity;
    const _fromValue = fromValue || _.identity;
    return (
        <InputUI
            value={_toValue(cursor.get())}
            onChange={(e) => cursor.set(_fromValue(e.target.value))}
            {...props}
        />
    );
}

Input.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
    toValue: React.PropTypes.func,
    fromValue: React.PropTypes.func,
};
