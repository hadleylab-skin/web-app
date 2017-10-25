import React from 'react';
import { BaseWrapper } from 'components';
import { Container, Header, Image, Grid } from 'semantic-ui-react';
import step1 from './assets/step1.png';
import step2 from './assets/step2.png';
import step3 from './assets/step3.png';
import settings from './assets/settings.png';


export function HowToShare() {
    return (
        <BaseWrapper>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Container text>
                            <Header as="h1">You don't export your private key yet</Header>
                            <p>Please follow the instruction to export your private key from the iOS app.</p>
                        </Container>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={2} />
                    <Grid.Column width={4}>
                        <p>
                            Ensure that you are using your personal device
                            and check that application setting "Shared mode" is turned off.
                        </p>
                        <Image size="medium" src={settings} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <p>Then log into the iOS app and open "My Profile" tab.</p>
                        <Image size="medium" src={step1} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <p>Tap on "Cryptography configuration" and enable the switch.</p>
                        <Image size="medium" src={step2} />
                        <p>If you see this</p>
                        <Image size="medium" src={step3} />
                        <p>Your key is successfully exported</p>
                    </Grid.Column>
                    <Grid.Column width={2} />
                </Grid.Row>
            </Grid>
        </BaseWrapper>
    );
}
