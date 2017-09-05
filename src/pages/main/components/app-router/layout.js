import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';

export const InnerLayout = React.createClass({
    render() {
        return (
            <Route
                children={({ location }) => (
                    <Container fluid>
                        <Menu>
                            <Menu.Item
                                active={location.pathname === '/'}
                            >
                                <Link to="/">
                                    Patients list
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                active={location.pathname === '/doctor-info'}
                            >
                                <Link to="/doctor-info">
                                    Doctor info
                                </Link>
                            </Menu.Item>
                        </Menu>
                        {this.props.children}
                    </Container>
                )}
            />
        );
    },
});
