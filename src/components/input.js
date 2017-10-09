import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI } from 'semantic-ui-react';

export const Input = React.createClass({
    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
        toValue: React.PropTypes.func,
        fromValue: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            toValue: _.identity,
            fromValue: _.identity,
        };
    },

    getInitialState() {
        const value = this.props.cursor.get();
        return {
            value,
        };
    },

    componentWillMount() {
        this.props.cursor.on('update', this.updateState);
    },

    componentWillUnmount() {
        this.cancelDebounced();
        this.props.cursor.off('update', this.updateState);
    },

    updateState(e) {
        this.cancelDebounced();
        const value = e.data.currentData;
        this.setState({ value });
    },

    _syncState() {
        this.props.cursor.set(this.state.value);
    },

    syncState() {
        this.cancelDebounced();
        this.debounced = _.debounce(this._syncState, 200);
        this.debounced();
    },

    cancelDebounced() {
        if (this.debounced) {
            this.debounced.cancel();
        }
    },

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
    },
});

