import React from 'react';
import { Container, Menu } from 'semantic-ui-react';

export const BaseWrapper = React.createClass({
    render() {
        return (
            <Container fluid>
                <Menu>
                    <Menu.Item
                        name='Home'
                        active={false}
                    >
                        Home
                    </Menu.Item>
                </Menu>
                {this.props.children}
            </Container>
        );
    },
});
