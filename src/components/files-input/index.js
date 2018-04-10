import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI, Button, Label } from 'semantic-ui-react';
import s from './styles.css'
import i from './doc_icon.svg'


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

    handleOnChange(e) {
        _.map(e.target.files, async (file) => {
            const { uploadedFiles, uploadPks } = this.state;
            const result = await this.props.uploadService(this.props.cursor, file);
            if (result.status === 'Succeed') {
                uploadedFiles.push(result.data);
                uploadPks.push(result.data.pk);
                this.props.cursor.set(uploadPks);
            }
        });
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
                    <div className={s.uploads_label}>List of uploaded files:</div>
                : null}
                <div className={s.uploads_wrapper}>
                    {_.map(uploadedFiles, (item, index) => (
                        <div key={index} className={s.upload_row}>
                            <img className={s.upload_row__img} src={item.thumbnail ? item.thumbnail : i} />
                            <span className={s.upload_row__name}>{item.originalFilename}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
});
