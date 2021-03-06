import _ from 'lodash';
import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Table, Grid, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Input } from 'components';
import schema from 'libs/state';


const model = {
    tree: {
        data: [],
        status: '',
        search: '',
    },
};


export const StudyListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <StudyList {...this.props} />;
    },
});


const StudyList = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        isCoordinator: React.PropTypes.bool,
    },

    renderTable() {
        const status = this.props.tree.status.get();
        if (status !== 'Succeed') {
            return (
                <div>Loading...</div>
            )
        }

        const studies = this.props.tree.data.get();
        const filteredStudies = _.filter(studies, (study) => {
            const search = _.toLower(this.props.tree.search.get());
            return _.isEmpty(search) ||
                _.includes(_.toLower(study.title), search) ||
                _.includes(_.toString(study.pk), search);
        });

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{width: "20%"}}>Study ID</Table.HeaderCell>
                        <Table.HeaderCell style={{width: "80%"}}>Title</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(filteredStudies, (study) => (
                        <Table.Row key={study.pk}>
                            <Table.Cell style={{width: '20%'}}>
                                <Link to={`/studies/${study.pk}`}>
                                    {study.pk}
                                </Link>
                            </Table.Cell>
                            <Table.Cell style={{width: '80%'}}>
                                <Link to={`/studies/${study.pk}`}>
                                    {study.title}
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    },

    render() {
        const { isCoordinator } = this.props;

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Study list</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Input
                                fluid
                                icon="search"
                                placeholder="Search..."
                                cursor={this.props.tree.search}
                            />
                        </Grid.Column>
                        {isCoordinator ?
                            <Grid.Column width={12}>
                                <div style={{textAlign: 'right'}}>
                                    <Link to="/studies/add/">
                                        <Button
                                            type="button"
                                            color="green"
                                        >
                                            Start a new study
                                        </Button>
                                    </Link>
                                </div>
                            </Grid.Column>
                        : null}
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
