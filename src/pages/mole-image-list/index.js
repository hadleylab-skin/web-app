import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Table, Grid, Header, Image, Button } from 'semantic-ui-react';
import { GridWrapper, Input, Checkbox } from 'components';
import schema from 'libs/state';

const model = (props, context) => ({
    tree: (c) => context.services.getMoleService(props.patientId, props.moleId, c),
    moleImagesCursor: (c) => context.services.getMoleService(props.patientId, props.moleId, c),
});


export const MoleImagesListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <MoleImageList {...this.props} />;
    },
});

const MoleImageList = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        patientId: React.PropTypes.string.isRequired,
        moleId: React.PropTypes.string.isRequired,
        moleImagesCursor: BaobabPropTypes.cursor.isRequired,
        updateParent: React.PropTypes.func.isRequired,
    },

    contextTypes: {
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
        }),
        services: React.PropTypes.shape({
            getMoleService: React.PropTypes.func.isRequired,
            updateMolePhotoService: React.PropTypes.func.isRequired,
        }),
    },

    componentWillMount() {
        this.props.tree.set(this.props.moleImagesCursor.get());
    },

    isButtonDiabled(id) {
        return _.isEqual(
            this.props.moleImagesCursor.data.images.select(id).data.info.data.get(),
            this.props.tree.data.images.select(id).data.info.data.get());
    },

    save(id) {
        return async () => {
            const cursor = this.props.moleImagesCursor.data.images.select(id).data.info;
            const data = _.pick(cursor.get('data'),
                                ['pathDiagnosis', 'clinicalDiagnosis', 'approved']);
            const service = this.context.services.updateMolePhotoService;
            const result = await service(this.props.patientId, this.props.moleId, id, cursor, data);
            await this.props.updateParent();
            this.props.tree.data.images.select(id).data.info.set(result);
        };
    },

    renderPhoto(photo) {
        if (_.isEmpty(photo)) {
            return null;
        }
        return (
            <Image src={photo} size="tiny" />
        );
    },

    renderAnatomicalSite(anatomicalSites) {
        return _.chain(anatomicalSites)
                .map((site) => site.name)
                .join('/')
                .value();
    },

    renderTable(mole) {
        const cursor = this.props.moleImagesCursor.data.images;
        const { isCoordinator } = this.context.cursors.doctor.data.get();
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Image</Table.HeaderCell>
                        <Table.HeaderCell>Path Diagnoses</Table.HeaderCell>
                        <Table.HeaderCell>Clinical Diagnoses</Table.HeaderCell>
                        <Table.HeaderCell>Approved</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(mole.images, (image, id) => (
                        <Table.Row
                            key={id}
                        >
                            <Table.Cell>{image.data.dateCreated}</Table.Cell>
                            <Table.Cell>{this.renderPhoto(image.data.photo.thumbnail)}</Table.Cell>
                            <Table.Cell>
                                <Input
                                    cursor={cursor.select(id).data.info.data.pathDiagnosis}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Input
                                    cursor={cursor.select(id).data.info.data.clinicalDiagnosis}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Checkbox
                                    disabled={!isCoordinator}
                                    cursor={cursor.select(id).data.info.data.approved}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    disabled={this.isButtonDiabled(id)}
                                    onClick={this.save(id)}
                                    color="pink"
                                    loading={cursor.select(id).image.data.info.status.get() === 'Loading'}
                                >
                                    Save
                                </Button>
                            </Table.Cell>
                        </Table.Row>))
                    }
                </Table.Body>
            </Table>
        );
    },

    render() {
        const mole = this.props.moleImagesCursor.get();
        if (mole.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(mole)}
                </div>
            );
        }
        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patient moles</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable(mole.data)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
