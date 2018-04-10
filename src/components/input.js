import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI } from 'semantic-ui-react';
import { BasicInput } from "./basic-input";


export class Input extends BasicInput {
    render() {
        const { cursor, toValue, fromValue, ...props } = this.props;
        return (
            <InputUI
                value={toValue(this.state.value)}
                onBlur={this.syncState}
                onChange={(e) => {
                    const value = fromValue(e.target.value);
                    this.setState({ value });
                    this.syncState();
                }}
                {...props}
            />
        );
    }
}

Input.propTypes = {
    cursor: BaobabPropTypes.cursor.isRequired,
    toValue: React.PropTypes.func,
    fromValue: React.PropTypes.func,
};

Input.defaultProps = {
    toValue: _.identity,
    fromValue: _.identity,
};
