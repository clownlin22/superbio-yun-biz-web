import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Tooltip,
  Popconfirm,
  Icon,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DictList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const confirms = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


/*新增字典弹窗*/
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
      title='新增字典类型 '
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '必填' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字典编码">
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '必填' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否系统">
        {getFieldDecorator('systemic', {
          rules: [{ required: true, message: '必填' }],
        })(
          <Select placeholder="请选择" style={{ maxWidth: 290, width: '100%' }}>
            <Option value="0">否</Option>
            <Option value="1">是</Option>
          </Select>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {getFieldDecorator('remark', {
          rules: [{ required: false }],
        })(<TextArea placeholder="备注" autosize={{ minRows: 4, maxRows: 8 }}/>)}
      </FormItem>
    </Modal>
  );
});

/*编辑字典弹窗内容*/
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
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

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
        完成
      </Button>,
    ];
  };

  render() {
    const { form, updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑字典类型"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem key="name" {...this.formLayout} label="字典名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '字典名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入字典名称"/>)}
        </FormItem>
        <FormItem key="code" {...this.formLayout} label="字典编码">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '字典编码！' }],
            initialValue: formVals.code,
          })(
            <Input placeholder="请输入字典编码"/>,
          )}
        </FormItem>
        <FormItem key="systemic" {...this.formLayout} label="系统字典">

          {form.getFieldDecorator('systemic', {

            rules: [{ required: true, message: '系统字典！' }],
            initialValue: formVals.systemic,

          })(
            <Select placeholder="请选择" style={{ maxWidth: 290, width: '100%' }}>
              <Option value="0">否</Option>
              <Option value="1">是</Option>
            </Select>,
          )}

        </FormItem>
        <FormItem key="remark" {...this.formLayout} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [{ required: false, message: '备注！' }],
            initialValue: formVals.remark,
          })(
            <TextArea placeholder="备注" autosize={{ minRows: 4, maxRows: 8 }}/>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ dictdemo, loading }) => ({
  dictdemo,
  loading: loading.models.dictdemo,
}))
@Form.create()
class DictList extends PureComponent {

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictdemo/fetch',
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dictdemo/fetch',
      payload: params,
    });
  };
  /*重置*/
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dictdemo/fetch',
      payload: {},
    });
  };
  /* 选中的行 */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
      type: 'dictdemo/add',
      payload: {
        name: fields.name,
        code: fields.code,
        systemic: fields.systemic,
        enabled: fields.enabled,
        remark: fields.remark,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
    this.handleFormReset();
  };
  searchInfo = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'dictdemo/fetch',
        payload: values,

      });
    });
  };
  /*查询*/
  handleSearch = (e) => {
    e.preventDefault();
    this.searchInfo();
  };
  /*禁用*/
  showDisable = () => {
    let self = this;
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    const conte = '您将禁用字典名称为   ';
    const conten = '    的数据！';
    const rowCaseNumber = selectedRows.map(row => row.name);
    const contents = conte + rowCaseNumber + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要禁用数据吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'dictdemo/updateStatus',
          payload: {
            key: selectedRows.map(row => row.key),
            enabled: parseInt(0, 10),
          },
        });
        message.success('禁用成功!');
        self.setState({ selectedRows: [] });
        self.searchInfo();
      },
      onCancel() {
      },
    });

  };
  /*删除*/
  showRemove = () => {
    let self = this;
    const { selectedRows } = this.state;
    const { dispatch } = this.props;

    const conte = '您将删除字典名称为   ';
    const conten = '    的数据！';
    const rowCaseNumber = selectedRows.map(row => row.name);
    const contents = conte + rowCaseNumber + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'dictdemo/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
        });
        message.success('删除成功');

        self.setState({ selectedRows: [] });
        self.searchInfo();
      },
      onCancel() {
      },
    });
  };
  /*编辑弹窗*/
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  /*编辑*/
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictdemo/update',
      payload: {
        ...fields,
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
    this.searchInfo();
  };


  /*查询*/
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="字典名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="字典编码">
              {getFieldDecorator('code')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="系统字典">
              {getFieldDecorator('systemic')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="禁用">
              {getFieldDecorator('enabled')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">否</Option>
                  <Option value="1">是</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  /*跳转*/
  handJump = (record) => {
    router.push({
      pathname: '/SpbBase/Dict/dict-data-list',
      state: { name: record.name, code: record.code, id: record.idString },
    });

  };

  render() {
    const {
      dictdemo: { data, fileStatuss },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, stepFormValues, updateModalVisible } = this.state;
    const columns = [
      {
        title: '字典名称',
        dataIndex: 'name',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>{record.name}</a>
          </Fragment>
        ),
      },
      {
        title: '字典编码',
        dataIndex: 'code',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handJump(record)}>{record.code}</a>
          </Fragment>
        ),
      },
      {
        title: '系统字典',
        dataIndex: 'systemic',
        align: 'center',
        width: '15%',
        render(val) {
          const dd = val == 0 ? '否' : '是';
          return dd;
        },
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        align: 'center',
        width: '15%',
        render(val) {
          const dd = val == 0 ? '否' : '是';
          return dd;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
        width: '22%',
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
            <Divider type="vertical"/>
            <Tooltip title="配置">
              <a onClick={() => this.handJump(record)}><Icon type="setting"/></a>
            </Tooltip>
          </Fragment>

        ),
      },
    ];
    /*添加*/
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="字典列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <Button type="primary"
                        onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              <Button type="danger"
                      disabled={selectedRows.length === 0}
                      onClick={() => this.showRemove()}>
                删除
              </Button>
              <Button type="danger"
                      disabled={selectedRows.filter(item => item.enabled === 1).length == 0}
                      onClick={this.showDisable}>
                禁用
              </Button>
              </span>

            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
        />

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}


      </PageHeaderWrapper>
    );
  }
}

export default DictList;
