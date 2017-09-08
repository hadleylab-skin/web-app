import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';


export const GridWrapper = React.createClass({
    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={1} />
                    <Grid.Column width={14}>
                        <Segment>
                            {this.props.children}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={1} />
                </Grid.Row>
            </Grid>
        );
    },
});
