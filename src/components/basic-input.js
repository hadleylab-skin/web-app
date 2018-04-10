import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';


export const BasicInput = React.createClass({
    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
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
        return null;
    }
});
