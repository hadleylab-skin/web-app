import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Checkbox as CheckboxUI } from 'semantic-ui-react';

export function Checkbox({ cursor, ...props }) {
    return (
        <CheckboxUI
            checked={cursor.get()}
            onChange={(e, data) => cursor.set(data.checked)}
            {...props}
        />
    );
}

Checkbox.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
