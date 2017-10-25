import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const BaseWrapper = React.createClass({
    render() {
        return (
            <Container fluid>
                <Menu>
                    <Menu.Item
                        name='Home'
                        active={false}
                    >
                        <Link to='/'>
                            Home
                        </Link>
                    </Menu.Item>
                </Menu>
                {this.props.children}
            </Container>
        );
    },
});
