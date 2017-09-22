import React from 'react';
import { Container, Message } from 'semantic-ui-react';
import { BaseWrapper, FormErrorMessages, prepareErrorTexts } from 'components';
import { activateService } from 'services/auth';
import schema from 'libs/state';
import { Link } from 'react-router-dom';

const model = ({ uid, token }) => (
    {
        tree: (c) => activateService(c, { uid, token }),
    }
);

export const ActivatePage = schema(model)(({ tree }) => {
    const errors = tree.error.get('data') || [];
    const errorTexts = prepareErrorTexts(errors, () => '');
    return (
        <BaseWrapper>
            <Container text>
                {
                    tree.status.get() === 'Succeed'
                    ?
                        <Message positive>
                            <Message.Header>
                                Activation is succeed
                            </Message.Header>
                            <p>
                                Now you can use you login and passsword to login iOS app or <Link to="/">Web app</Link>
                            </p>
                        </Message>
                    :
                        <FormErrorMessages
                            header="User activation error"
                            errorTexts={errorTexts}
                        />
                }
            </Container>
        </BaseWrapper>
    );
});

