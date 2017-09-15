import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Table, Grid, Header, Image, Button, Modal, Form, Label } from 'semantic-ui-react';
import { GridWrapper, Input, Checkbox } from 'components';
import schema from 'libs/state';
import { convertCmToIn, convertInToCm } from 'libs/misc';

const model = (props, context) => ({
    tree: {
        mole: {},
        requireAttention: false,
    },
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
        const moleImagesCursor = this.props.moleImagesCursor;
        if (_.isEmpty(moleImagesCursor.get()) || moleImagesCursor.status.get() === 'Loading') {
            moleImagesCursor.on('update', this.setupAndUnsubscribe);
        } else {
            this.props.tree.mole.set(moleImagesCursor.get());
        }
    },

    setupAndUnsubscribe(e) {
        this.props.tree.mole.set(e.data.currentData);
        if (e.data.currentData.status === 'Succeed') {
            this.props.moleImagesCursor.off(this.setupAndUnsubscribe);
        }
    },

    isButtonDiabled(id) {
        return _.isEqual(
            this.props.moleImagesCursor.data.images.select(id).data.info.data.get(),
            this.props.tree.mole.data.images.select(id).data.info.data.get());
    },

    save(id) {
        return async () => {
            const cursor = this.props.tree.mole.data.images.select(id).data.info;
            const data = cursor.get('data');
            const service = this.context.services.updateMolePhotoService;
            const result = await service(this.props.patientId, this.props.moleId, id, cursor, data);
            await this.props.updateParent();
            this.props.moleImagesCursor.data.images.select(id).data.info.set(result);
        };
    },

    renderPhoto(photo) {
        const thumbnail = photo.thumbnail;
        if (_.isEmpty(thumbnail)) {
            return null;
        }
        return (
            <Modal trigger={<Image src={thumbnail} size="tiny" />}>
                <Modal.Header>Picture</Modal.Header>
                <Modal.Content>
                    <Image size="massive" src={photo.fullSize} />
                </Modal.Content>
            </Modal>
        );
    },

    renderAnatomicalSite(anatomicalSites) {
        return _.chain(anatomicalSites)
                .map((site) => site.name)
                .join('/')
                .value();
    },

    renderTable(images) {
        const cursor = this.props.tree.mole.data.images;
        const { isCoordinator, unitsOfLength } = this.context.cursors.doctor.data.get();
        const toValue = (unitsOfLength === 'in') ? convertCmToIn : _.identity;
        const fromValue = (unitsOfLength === 'in') ? convertInToCm : _.identity;
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Age</Table.HeaderCell>
                        <Table.HeaderCell>Image</Table.HeaderCell>
                        <Table.HeaderCell>Diagnoses</Table.HeaderCell>
                        <Table.HeaderCell>Biopsy</Table.HeaderCell>
                        <Table.HeaderCell>Approved</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(images, (image) => (
                        <Table.Row
                            key={image.data.pk}
                        >
                            <Table.Cell>{moment(image.data.dateCreated).format('MMM D, YYYY')}</Table.Cell>
                            <Table.Cell>{image.data.age}</Table.Cell>
                            <Table.Cell>{this.renderPhoto(image.data.photo)}</Table.Cell>
                            <Table.Cell>
                                <Form>
                                    <Form.Field>
                                        <label>Pathalogical</label>
                                        <Input
                                            cursor={cursor.select(image.data.pk).data.info.data.pathDiagnosis}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Clinical</label>
                                        <Input
                                            cursor={cursor.select(image.data.pk).data.info.data.clinicalDiagnosis}
                                        />
                                    </Form.Field>
                                </Form>
                            </Table.Cell>
                            <Table.Cell>
                                <Form>
                                    <Form.Field>
                                        <label>Biopsy</label>
                                        <Checkbox
                                            cursor={cursor.select(image.data.pk).data.info.data.biopsy}
                                        />
                                    </Form.Field>
                                    {
                                    image.data.info.data.biopsy
                                    ?
                                        <Form.Group>
                                            <Form.Field>
                                                <label>Width ({unitsOfLength})</label>
                                                <Input
                                                    type="number"
                                                    toValue={toValue}
                                                    fromValue={fromValue}
                                                    cursor={cursor.select(image.data.pk).data.info.data.biopsyData.width}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Heigth ({unitsOfLength})</label>
                                                <Input
                                                    type="number"
                                                    toValue={toValue}
                                                    fromValue={fromValue}
                                                    cursor={cursor.select(image.data.pk).data.info.data.biopsyData.height}
                                                />
                                            </Form.Field>
                                        </Form.Group>
                                    :
                                    null
                                    }
                                </Form>
                            </Table.Cell>
                            <Table.Cell>
                                {
                                isCoordinator
                                ?
                                    <Checkbox
                                        label="Approved"
                                        disabled={!isCoordinator}
                                        cursor={cursor.select(image.data.pk).data.info.data.approved}
                                    />
                                :
                                (image.data.info.data.approved ? <Label color="green">Yes</Label> : <Label color="red">No</Label>)
                                }
                            </Table.Cell>
                            <Table.Cell>
                                <Button
                                    disabled={this.isButtonDiabled(image.data.pk)}
                                    onClick={this.save(image.data.pk)}
                                    color="pink"
                                    loading={cursor.select(image.data.pk).image.data.info.status.get() === 'Loading'}
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
        const images = this.props.tree.mole.data.images.get();
        const total = _.values(images).length;
        const requireAttention = this.props.tree.requireAttention.get();
        const visibleImages = _.filter(images, (image)=> {
            if (requireAttention) {
                const info = image.data.info.data;
                return info.approved === false ||
                       _.isEmpty(info.clinicalDiagnosis) ||
                       _.isEmpty(info.pathDiagnosis);
            }
            return true;
        });

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patient mole's images ({mole.data.anatomicalSite.data.name})</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Checkbox
                                cursor={this.props.tree.requireAttention}
                                label="Show only images require attention"
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {visibleImages.length} from {total}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable(visibleImages)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
