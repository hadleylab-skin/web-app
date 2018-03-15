import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI, Button, Label } from 'semantic-ui-react';


export const FilesInput = React.createClass({
    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
        uploadService: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            uploadedFiles: [],
            uploadPks: [],
        };
    },

    async handleOnChange(e) {
        const file = e.target.files[0];
        const { uploadedFiles, uploadPks } = this.state;
        const result = await this.props.uploadService(this.props.cursor, file);
        if (result.status === 'Succeed') {
            uploadedFiles.push(file.name);
            uploadPks.push(result.data.pk);
            this.props.cursor.set(uploadPks);
        }
    },

    render() {
        const { uploadedFiles } = this.state;
        const { cursor, ...props } = this.props;

        return (
            <div>
                <label>
                    <div className="ui blue button">Add Files</div>
                    <InputUI
                        type="file"
                        multiple
                        style={{display: 'none'}}
                        onBlur={this.syncState}
                        onChange={this.handleOnChange}
                        {...props}
                    />
                </label>
                {!_.isEmpty(uploadedFiles) ?
                    <div>List of uploaded files:</div>
                : null}
                {_.map(uploadedFiles, (item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        );
    },
});
