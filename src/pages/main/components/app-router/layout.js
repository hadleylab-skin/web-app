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
                                    Patients
                                </Link>
                            </Menu.Item>
                            {
                            this.props.isCoordinator
                            ?
                                <Menu.Item
                                    active={location.pathname === '/site-join-requests'}
                                >
                                    <Link to="/site-join-requests">
                                        Site join requests
                                    </Link>
                                </Menu.Item>
                            :
                            null
                            }
                            <Menu.Item
                                active={location.pathname === '/studies'}
                            >
                                <Link to="/studies">
                                    Studies
                                </Link>
                            </Menu.Item>
                            <Menu.Item
                                position="right"
                            >
                                <a onClick={this.props.logout} href="#/">
                                    Logout
                                </a>
                            </Menu.Item>
                        </Menu>
                        {this.props.children}
                    </Container>
                )}
            />
        );
    },
});
