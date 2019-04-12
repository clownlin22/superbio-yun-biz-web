import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import {
  Form,
  Card,
  Input,
  Row,
  Col,
  Select,
  Button,
  Modal,
  Tooltip,
  Icon,
  Divider,
  message,
} from 'antd';
import styles from './FinanceList.less';
import { connect } from 'dva';

const confirms = Modal.confirm;
const FormItem = Form.Item;

@Form.create()
class SearchForm extends PureComponent {

  category = [
    '亲子鉴定',
    '文书鉴定',
    '酒精鉴定',
    '车辆痕迹鉴定',
    '法医临床鉴定',
    '法医病理鉴定',
  ];
  refundType = [
    '全部',
    '鉴定费',
    '附加费',
    '会诊费',
    '现勘费',
    '出庭费',
    '服务费',
    '加急费',
  ];

  handleSearch = e => {

    const { form, handleSearch } = this.props;
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState(
        () => {
          handleSearch(values);
        },
      );

    });
  };

  handleFormReset = () => {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    this.setState(
      () => {
        handleFormReset();
      },
    );
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.searchForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('caseCategoryId')(
                <Select placeholder="请选择" allowClear>
                  <Select.Option value="0">亲子鉴定</Select.Option>
                  <Select.Option value="1">文书鉴定</Select.Option>
                  <Select.Option value="2">酒精鉴定</Select.Option>
                  <Select.Option value="3">车辆痕迹鉴定</Select.Option>
                  <Select.Option value="4">法医临床鉴定</Select.Option>
                  <Select.Option value="5">法医病理鉴定</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="收费类型">
              {getFieldDecorator('chargingType')(
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>鉴定费</Select.Option>
                  <Select.Option value={1}>附加费</Select.Option>
                  <Select.Option value={2}>会诊费</Select.Option>
                  <Select.Option value={3}>现勘费</Select.Option>
                  <Select.Option value={4}>出庭费</Select.Option>
                  <Select.Option value={5}>服务费</Select.Option>
                  <Select.Option value={6}>加急费</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入项目名称"/>,
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <div style={{ float: 'right', marginBottom: 24, paddingRight: 16 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div>{this.renderSearchForm()}</div>
    );
  }
}

@Form.create()
class UpdataModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  onOk = () => {
    const { form: { validateFields }, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };

      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        },
      );

    });

  };

  onCancel = () => {
    const { updataModalonCancel } = this.props;

    this.setState(
      () => {
        updataModalonCancel();
      },
    );
  };

  render() {
    const { form, NoteModalVisable } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        title={`${formVals.name}项目修改`}
        visible={NoteModalVisable}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >

        <Form layout="inline" className={styles.searchForm}>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'收费项目'}>
                {form.getFieldDecorator('name', {
                  // initialValue: selectedRows[0].name
                  initialValue: formVals.name,
                })(<Input placeholder="请输入收费项目名称"></Input>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'专业类别'}>
                {form.getFieldDecorator('caseCategoryId', {
                  // initialValue: selectedRows[0].caseCategoryId
                  initialValue: formVals.caseCategoryId,
                })(<Select placeholder="请选择">
                  <Select.Option value={0}>亲子鉴定</Select.Option>
                  <Select.Option value={1}>文书鉴定</Select.Option>
                  <Select.Option value={2}>酒精鉴定</Select.Option>
                  <Select.Option value={3}>车辆痕迹鉴定</Select.Option>
                  <Select.Option value={4}>法医临床鉴定</Select.Option>
                  <Select.Option value={5}>法医病理鉴定</Select.Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'收费类型'}>
                {form.getFieldDecorator('chargingType', {
                  // initialValue: selectedRows[0].chargingType
                  initialValue: formVals.chargingType,
                })(<Select placeholder="请选择">
                  <Select.Option value={0}>鉴定费</Select.Option>
                  <Select.Option value={1}>附加费</Select.Option>
                  <Select.Option value={2}>会诊费</Select.Option>
                  <Select.Option value={3}>现勘费</Select.Option>
                  <Select.Option value={4}>出庭费</Select.Option>
                  <Select.Option value={5}>服务费</Select.Option>
                  <Select.Option value={6}>加急费</Select.Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'单价'}>
                {form.getFieldDecorator('unitPrice', {
                  rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入数字!' }],
                  // initialValue:(selectedRows[0].unitPrice/100).toFixed(2)
                  initialValue: formVals.unitPrice,
                })(<Input addonAfter={'分'}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

/*新增收费项目*/
const CreateForm = Form.create()(props => {
  const { modalVisible, form: { validateFields, resetFields, getFieldDecorator }, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    validateFields((err, fieldsValue) => {
      if (err) return;
      resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title='新增收费项目'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收费项目">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '必填' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专业类别">
        {getFieldDecorator('caseCategoryId', {
          rules: [{ required: true, message: '必填' }],
        })(
          <Select placeholder="请选择" style={{ maxWidth: 290, width: '100%' }}>
            <Option value={0}>亲子鉴定</Option>
            <Option value={1}>文书鉴定</Option>
            <Option value={2}>酒精鉴定</Option>
            <Option value={3}>车辆痕迹鉴定</Option>
            <Option value={4}>法医临床鉴定</Option>
            <Option value={5}>法医病理鉴定</Option>
          </Select>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收费类型">
        {getFieldDecorator('chargingType', {
          rules: [{ required: true, message: '必填' }],
        })(
          <Select placeholder="请选择" style={{ maxWidth: 290, width: '100%' }}>
            <Option value={0}>鉴定费</Option>
            <Option value={1}>附加费</Option>
            <Option value={2}>会诊费</Option>
            <Option value={3}>现勘费</Option>
            <Option value={4}>出庭费</Option>
            <Option value={5}>服务费</Option>
            <Option value={6}>加急费</Option>
          </Select>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单价">
        {getFieldDecorator('unitPrice', {
          rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入数字!' }],
        })(<Input addonAfter={'分'}/>)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class AddModal extends PureComponent {
  onOk = () => {
    const { addModalonOk } = this.props;
    this.setState(
      () => {
        addModalonOk();
      },
    );
  };

  onCancel = () => {
    const { addModalonCancel } = this.props;

    this.setState(
      () => {
        addModalonCancel();
      },
    );
  };

  render() {
    const { form, AddModalVisable, selectedRows } = this.props;
    return (
      <Modal
        title={'新增收费项目'}
        visible={AddModalVisable}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >

        <Form layout="inline" className={styles.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'收费项目'}>
                {form.getFieldDecorator('projectName', {
                  rules: [{ required: true }],
                })(<Input placeholder="请输入收费项目名称"></Input>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'专业类别'}>
                {form.getFieldDecorator('category', {})(
                  <Select placeholder="请选择">
                    <Select.Option value={0}>亲子鉴定</Select.Option>
                    <Select.Option value={1}>文书鉴定</Select.Option>
                    <Select.Option value={2}>酒精鉴定</Select.Option>
                    <Select.Option value={3}>车辆痕迹鉴定</Select.Option>
                    <Select.Option value={4}>法医临床鉴定</Select.Option>
                    <Select.Option value={5}>法医病理鉴定</Select.Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'收费类型'}>
                {form.getFieldDecorator('refundType', {})(<Select placeholder="请选择">
                  <Select.Option value={0}>鉴定费</Select.Option>
                  <Select.Option value={1}>附加费</Select.Option>
                  <Select.Option value={2}>会诊费</Select.Option>
                  <Select.Option value={3}>现勘费</Select.Option>
                  <Select.Option value={4}>出庭费</Select.Option>
                  <Select.Option value={5}>服务费</Select.Option>
                  <Select.Option value={6}>加急费</Select.Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'单价'}>
                {form.getFieldDecorator('money', {
                  rules: [{ required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入数字!' }],
                })(<Input addonAfter={'分'}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

@connect(({ ChargesNotesModal, loading }) => ({
  ChargesNotesModal,
  loading: loading.models.ChargesNotesModal,
}))
@Form.create()
class ChargesNotes extends PureComponent {
  state = {
    selectedRows: [],
    NoteModalVisable: false,
    AddModalVisable: false,
    formValues: {},
    stepFormValues: {},
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChargesNotesModal/fetch',
      payload: {},
    });
  }

  /*重置*/
  handleFormReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChargesNotesModal/fetch',
      payload: {},
    });
  };
  /*修改*/
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      NoteModalVisable: true,
      stepFormValues: record || {},
    });
  };
  /*添加弹窗*/
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });

  };
  /*添加*/
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChargesNotesModal/add',

      payload: {
        ...fields,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
  };
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'ChargesNotesModal/fetch',
      payload: params,
    });
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  add = () => {
    this.setState({
      AddModalVisable: true,
    });
  };
  remove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.idString);
    const self = this;
    confirms({
      title: '确定要删除数据吗?',
      onOk() {
        dispatch({
          type: 'ChargesNotesModal/remove',
          payload: ids,
        });
        message.success('删除成功');
        self.setState({ selectedRows: [] });
        self.handleFormReset();
      },
      onCancel() {
      },
    });
  };
  /*修改*/
  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChargesNotesModal/update',
      payload: {
        id: fields.idString,
        name: fields.name,
        caseCategoryId: fields.caseCategoryId,
        chargingType: fields.chargingType,
        unitPrice: fields.unitPrice,
      },
    });
    message.success('修改成功');
    this.updataModalonOk();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
  };
  /*更新*/
  updataModalonOk = () => {
    this.setState({
      NoteModalVisable: false,
    });
  };
  updataModalonCancel = () => {
    this.setState({
      NoteModalVisable: false,
    });
  };

  addModalonOk = () => {
    this.setState({
      AddModalVisable: false,
    });
  };
  addModalonCancel = () => {
    this.setState({
      AddModalVisable: false,
    });
  };

  handleSearch = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChargesNotesModal/fetch',
      payload: { ...values },
    });

  };


  render() {

    const {
      ChargesNotesModal: { data },
      loading,
    } = this.props;

    const { selectedRows, NoteModalVisable, AddModalVisable, stepFormValues, modalVisible } = this.state;

    const category = [
      '亲子鉴定',
      '文书鉴定',
      '酒精鉴定',
      '车辆痕迹鉴定',
      '法医临床鉴定',
      '法医病理鉴定',
    ];
    const refundType = [
      '全部',
      '鉴定费',
      '附加费',
      '会诊费',
      '现勘费',
      '出庭费',
      '服务费',
      '加急费',
    ];
    const columns = [
      {
        title: '收费项目',
        // dataIndex:'projectName',
        dataIndex: 'name',
        align: 'center',
      },

      {
        title: '专业类别',
        // dataIndex:'category',
        dataIndex: 'caseCategoryId',
        align: 'center',
        render(val) {
          return category[val];
        },

      },
      {
        title: '收费类别',
        // dataIndex:'refundType',
        dataIndex: 'chargingType',
        align: 'center',
        render(val) {
          return refundType[val];
        },
      },
      {
        title: '单价',
        // dataIndex:'money',
        dataIndex: 'unitPrice',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        width: '110px',
        render: (text, record) => (
          <Fragment>

            <Tooltip title="编辑">
              <a onClick={() => this.handleUpdateModalVisible(true, record)}><Icon type="edit"/></a>
            </Tooltip>
          </Fragment>

        ),
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const SearchMethods = {
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
    };
    const ChargesNotesMethods = {
      updataModalonOk: this.updataModalonOk,
      updataModalonCancel: this.updataModalonCancel,
      handleUpdate: this.handleUpdate,
    };
    const AddMethods = {
      addModalonOk: this.addModalonOk,
      addModalonCancel: this.addModalonCancel,
    };

    return (
      <PageHeaderWrapper title="收费项目">
        <Card bordered={false}>

          <SearchForm
            {...SearchMethods}
          />

          <AddModal
            {...AddMethods}
            AddModalVisable={AddModalVisable}
          />
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdataModal
              {...ChargesNotesMethods}
              NoteModalVisable={NoteModalVisable}
              values={stepFormValues}
            />
          ) : null}

          <div className={styles.tableListOperator}>

            <Button type="primary" onClick={() => this.handleModalVisible(true)}>新增</Button>


            <Button type="danger" disabled={selectedRows.length > 0 ? false : true} onClick={this.remove}>删除</Button>

          </div>

          <StandardTable
            rowKey="idString"
            selectedRows={selectedRows}
            columns={columns}
            data={data}
            loading={loading}
            onChange={this.handleStandardTableChange}
            onSelectRow={this.handleSelectRows}
          />
          <CreateForm
            {...parentMethods}
            modalVisible={modalVisible}
          />

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ChargesNotes;
