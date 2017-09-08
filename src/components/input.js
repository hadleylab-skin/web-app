import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI } from 'semantic-ui-react';

export function Input({ cursor, ...props }) {
    return (
        <InputUI
            value={cursor.get()}
            onChange={(e) => cursor.set(e.target.value)}
            {...props}
        />
    );
}

Input.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
