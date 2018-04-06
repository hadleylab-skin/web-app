import React from 'react';
import _ from 'lodash';
import { Dropdown as SelectUI } from 'semantic-ui-react';
import { BasicInput } from "./basic-input";


export class Select extends BasicInput {
    render() {
        const { cursor, ...props } = this.props;
        let value = this.state.value;

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
}
