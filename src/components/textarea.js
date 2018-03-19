import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { TextArea as TextAreaUI } from 'semantic-ui-react';

export function TextArea({ cursor, ...props }) {
    return (
        <TextAreaUI
            checked={cursor.get()}
            onChange={(e, data) => cursor.set(data.value)}
            {...props}
        />
    );
}

TextArea.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
};
