import React from 'react';
import _ from 'lodash';
import BaobabPropTypes from 'baobab-prop-types';
import { Input as InputUI } from 'semantic-ui-react';
import s from './styles.css';
import i from './doc_icon.svg';


export const FilesInput = React.createClass({
    propTypes: {
        cursor: BaobabPropTypes.cursor.isRequired,
        initials: React.PropTypes.array,
        uploadService: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        const { initials } = this.props;

        return {
            uploadedFiles: _.map(initials, _.clone) || [],
            uploadPks: _.map(initials, (file) => file.pk) || [],
            errors: [],
        };
    },

    removeItem(uploadPk) {
        const uploadPks = _.filter(this.state.uploadPks, (pk) => pk !== uploadPk);
        const uploadedFiles = _.filter(
            this.state.uploadedFiles,
            (item) => item.pk !== uploadPk);

        this.setState({ uploadPks, uploadedFiles });
        this.props.cursor.set(uploadPks);
    },

    handleOnChange(e) {
        let errors = [];
        this.setState({ errors });

        _.map(e.target.files, async (file) => {
            const { uploadedFiles, uploadPks } = this.state;
            const result = await this.props.uploadService(this.props.cursor, file);
            if (result.status === 'Succeed') {
                uploadedFiles.push(result.data);
                uploadPks.push(result.data.pk);
                this.props.cursor.set(uploadPks);
            } else if (result.status === 'Failure') {
                errors = _.concat(errors, `${file.name}: ${result.error.data.file}`);
                this.setState({ errors });
            }
        });
    },

    render() {
        const { uploadedFiles, errors } = this.state;
        const { cursor, uploadService, initials, ...props } = this.props;

        return (
            <div>
                <label>
                    <div className="ui blue button">Add Files</div>
                    <InputUI
                        type="file"
                        multiple
                        style={{ display: 'none' }}
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
                            <a href={item.file} target="_blank">
                                <img className={s.upload_row__img} src={item.thumbnail ? item.file : i} />
                            </a>
                            <span className={s.upload_row__name}>{item.originalFilename}</span>
                            <div onClick={() => this.removeItem(item.pk)}
                                 className={s.upload_row__remove}>✘</div>
                        </div>
                    ))}
                </div>
                <div className={s.upload_errors}>
                    {_.map(errors, (error, index) => (
                        <p key={`upload_error_${index}`}>
                            {error}
                        </p>
                    ))}
                </div>
            </div>
        );
    },
});
