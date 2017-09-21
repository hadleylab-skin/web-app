import React from 'react';
import _ from 'lodash';
import { Container, Message, Form, Icon, Button } from 'semantic-ui-react';
import { BaseWrapper, FormErrorMessages, prepareErrorTexts, Input } from 'components';
import { resetPasswordService } from 'services/auth';
import schema from 'libs/state';
import { Link } from 'react-router-dom';

const model = {
    tree: {
        form: {
            newPassword: '',
        },
        resetResult: {},
    },
};

function mapTitle(title) {
    switch (title) {
    case 'newPassword':
        return 'New Password';
    case 'nonFieldErrors':
        return '';
    default:
        return `${_.capitalize(title)}:`;
    }
}

export const PasswordResetPage = schema(model)(({ tree, uid, token }) => {
    const formCursor = tree.form;
    const newPasswordCursor = formCursor.newPassword;
    const resetResultCursor = tree.resetResult;
    const errors = resetResultCursor.error.get('data') || [];
    const errorTexts = prepareErrorTexts(errors, mapTitle);
    return (
        <BaseWrapper>
            <Container text>
                {
                    resetResultCursor.get('status') === 'Succeed'
                ?
                    <Message positive>
                        <Message.Header>
                            Password reset is succeed
                        </Message.Header>
                        <p>
                            Now you can use your new password to login iOS app or <Link to="/">Web app</Link>
                        </p>
                    </Message>
                :
                    <Form
                        onSubmit={() => resetPasswordService(
                                resetResultCursor,
                                { uid, token, newPassword: newPasswordCursor.get() })
                        }
                    >
                        <Form.Field>
                            <label>New password</label>
                            <Input
                                iconPosition="left"
                                placeholder="Password"
                                error={!!errors.newPassword}
                                cursor={newPasswordCursor}
                            >
                                <input
                                    type="password"
                                />
                                <Icon name="lock" />
                            </Input>
                        </Form.Field>
                        <Button
                            type="submit"
                            color="pink"
                        >
                            Submit
                        </Button>
                        <FormErrorMessages
                            header="Password recovery error"
                            errorTexts={errorTexts}
                        />
                    </Form>
                }
            </Container>
        </BaseWrapper>
    );
});
