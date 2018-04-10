import React from 'react';
import { TextArea as TextAreaUI } from 'semantic-ui-react';
import { BasicInput } from "./basic-input";


export class TextArea extends BasicInput {
    render() {
        const { cursor, ...props } = this.props;
        const { value } = this.state;

        return (
            <TextAreaUI
                value={value}
                onChange={(e, data) => {
                    this.setState({ value: data.value });
                    this.syncState();
                }}
                {...props}
            />
        );
    }
}
