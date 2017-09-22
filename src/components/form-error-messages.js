import React from 'react';
import _ from 'lodash';
import { Message, List } from 'semantic-ui-react';

export function FormErrorMessages({ errorTexts, header }) {
    if (errorTexts.length > 0) {
        return (
            <Message negative>
                <Message.Header>
                    { header || 'Please fix form errors'}
                </Message.Header>
                <List>
                    {errorTexts}
                </List>
            </Message>
        );
    }
    return null;
}

FormErrorMessages.propTypes = {
    errorTexts: React.PropTypes.arrayOf(React.PropTypes.node).isRequired,
    header: React.PropTypes.string,
};

export function prepareErrorTexts(errors, titleMap = _.identity) {
    return _.flatten(_.map(errors, (fieldErrors, field) =>
        _.map(_.isArray(fieldErrors) ? fieldErrors : [fieldErrors],
              (error, index) => (
                  <List.Item
                      key={`${field}-${index}`}
                  >
                      <b>{titleMap(field)}</b> {error}
                  </List.Item>
            ))
        ));
}
