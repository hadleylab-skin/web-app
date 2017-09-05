import React from 'react';
import { Container, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export const InnerLayout = React.createClass({
    render() {
        return (
            <Container fluid>
                <Menu>
                    <Menu.Item>
                        <Link to="/">Patients list</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/doctor-info">Doctor info</Link>
                    </Menu.Item>
                </Menu>
                {this.props.children}
            </Container>
        );
    },
});
