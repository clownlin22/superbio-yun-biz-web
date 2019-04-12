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
  Upload,
  message,
  Icon,
  Tooltip,
  Popconfirm,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './EntrustList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const confirms = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const chargeProjects = [
  'X染色体STR检验',
  'Y染色体STR检验',
  '酒精检验',
  '车辆痕迹检验',
];
/*新增委托弹窗内容*/
const CreateForm = Form.create()(props => {
  const { modalVisible, form: { validateFields, resetFields, getFieldDecorator }, handleAdd, handleModalVisible, Category } = props;

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
      title='新增委托事项 '
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="专业类别">
        {getFieldDecorator('category', {
          rules: [{ required: true, message: '必填' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {Category.map(item => (
              <Option key={item.id}>{item.value}</Option>
            ))}
          </Select>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="委托事项名称">
        {getFieldDecorator('entrustName', {
          rules: [{ required: true, message: '必填' }],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收费项目">
        {getFieldDecorator('chargeProject', {
          rules: [{ required: true, message: '必填' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="1">X染色体STR检验</Option>
            <Option value="2">Y染色体STR检验</Option>
            <Option value="3">酒精检验</Option>
            <Option value="4">车辆痕迹检验</Option>
          </Select>)
        }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="细项">
        {getFieldDecorator('detail', {
          rules: [{ required: false }],
        })(<TextArea placeholder="细项" autosize={{ minRows: 4, maxRows: 8 }}/>)}
      </FormItem>
    </Modal>
  );
});

/*编辑编辑弹窗内容*/
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
    const { form, updateModalVisible, handleUpdateModalVisible, Category } = this.props;
    const { currentStep, formVals } = this.state;
    const category = Category.filter(item => item.id);
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改委托事项"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem key="category" {...this.formLayout} label="专业类别">
          {form.getFieldDecorator('category', {
            rules: [{ required: true, message: '专业类别！' }],
            initialValue: category[formVals.category].value,
          })(
            <Select  placeholder="请选择" style={{ width: '100%' }}>
              {Category.map(item => (
                <Option key={item.id}>{item.value}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem key="entrustName" {...this.formLayout} label="委托事项名称">
          {form.getFieldDecorator('entrustName', {
            rules: [{ required: true, message: '委托事项名称！' }],
            initialValue: formVals.entrustName,
          })(
            <Input placeholder="委托事项名称"/>,
          )}
        </FormItem>
        <FormItem key="chargeProject" {...this.formLayout} label="收费项目">
          {form.getFieldDecorator('chargeProject', {
            rules: [{ required: true, message: '收费项目！' }],
            initialValue: chargeProjects[formVals.chargeProject],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              <Option value="1">X染色体STR检验</Option>
              <Option value="2">Y染色体STR检验</Option>
              <Option value="3">酒精检验</Option>
              <Option value="4">车辆痕迹检验</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem key="detail" {...this.formLayout} label="细项">
          {form.getFieldDecorator('detail', {
            rules: [{ required: false, message: '细项！' }],
            initialValue: formVals.detail,
          })(
            <TextArea placeholder="细项" autosize={{ minRows: 4, maxRows: 8 }}/>,
          )}
        </FormItem>
      </Modal>
    );
  }
}
@connect(({ Entrust, loading }) => ({
  Entrust,
  loading: loading.models.Entrust,
}))
@Form.create()
class EntrustList extends PureComponent {

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
      type: 'Entrust/fetch',
    });
    dispatch({
      type: 'Entrust/fetchCategorys',
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
      type: 'Entrust/fetch',
      payload: params,
    });
  };
  /*导入弹窗*/
  showImport = () => {
    this.setState({
      importvisible: true,
    });
  };
  handleOk = () => {
    this.setState({
      importvisible: false,
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
      type: 'Entrust/fetch',
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
      type: 'Entrust/add',
      payload: {
        category: fields.category,
        entrustName: fields.entrustName,
        detail: fields.detail,
        chargeProject: fields.chargeProject,
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
        type: 'Entrust/fetch',
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
          type: 'Entrust/updateStatus',
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
  showRemove = (record) => {
    let self = this;
    const { selectedRows } = this.state;
    const { dispatch, Entrust: {Category }, } = this.props;

    const conte = '您将删除专业类别为   ';
    const conten = '    的数据！';
    const category = record.category;
    console.log(record.key,selectedRows.map(row => row.key),'http://localhost:8000/')
    const categorys=Category.filter(item => parseInt(item.id, 10) === parseInt(category, 10));
    const contents = conte +categorys[0].value + conten;
    if (!selectedRows) return;
    const id = selectedRows.map(row => row.idString);
    confirms({
      title: '确定要删除数据吗?',
      content: contents,

      onOk() {
        dispatch({
          type: 'Entrust/remove',
          payload: {
            key: [record.key]
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
  /*批量删除*/
  showRemoves = () => {
    let self = this;
    const { selectedRows } = this.state;
    const { dispatch, Entrust: {Category }, } = this.props;

    const conte = '您将删除专业类别为';
    const conten = '    的数据！';
    const category = selectedRows.category;
    const categorys=Category.filter(item => parseInt(item.id, 10) === parseInt(category, 10));
    console.log(categorys,'categorys')
    const contents = conte +categorys + conten;
    console.log(selectedRows.map(row => row.key),'selectedRows.map(row => row.key)')
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,

      onOk() {
        dispatch({
          type: 'Entrust/remove',
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

  /*修改*/
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Entrust/update',
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
      Entrust:{Category}
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="委托事项名">
              {getFieldDecorator('entrustName')(
                <Input placeholder="请输入"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('category')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {Category.map(item => (
                    <Option key={item.id} value={item.id}>{item.value}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      Entrust: { data, Category },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, stepFormValues, updateModalVisible, importvisible } = this.state;
    const columns = [

      {
        title: '专业类别',
        dataIndex: 'category',
        align: 'center',
        width: '23%',
        render: (val, record) => {
          if (Category.length > 0) {
            const category = Category.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            const value = category.length > 0 ? category[0].value : val;
            return (
              <Fragment>
                <a onClick={() => this.handleUpdateModalVisible(true, record)}>{value}</a>
              </Fragment>
            );
          }
          return val;
        },
      },
      {
        title: '委托事项名称',
        dataIndex: 'entrustName',
        align: 'center',
        width: '23%',
      },
      {
        title: '收费项目',
        dataIndex: 'chargeProject',
        align: 'center',
        width: '23%',
        render(val) {
          const project = chargeProjects[val];
          return project;
        },
      },
      {
        title: '细项',
        dataIndex: 'detail',
        align: 'center',
        width: '23%',
      },

      {
        title: '操作',
        align: 'center',
        width: '8%',
        render: (text, record) => (
          <Fragment>
            <Tooltip title="修改">
              <a onClick={() => this.handleUpdateModalVisible(true, record)}><Icon type="edit"/></a>
            </Tooltip>
            <Divider type="vertical"/>
            <Tooltip title="删除" >
              <Popconfirm  placement="bottom" title="确定要删除该项?" onConfirm={() => this.showRemove(record)} okText="是" cancelText="否">
                <a ><Icon type="delete" /></a>
              </Popconfirm>
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
      <PageHeaderWrapper title="委托事项列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <Button  type="primary"
                         onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
                 <Button  type="danger"
                          disabled={selectedRows.length===0}
                          onClick={() => this.showRemoves()}>
                删除
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
          Category={Category}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            Category={Category}
          />
        ) : null}


      </PageHeaderWrapper>
    );
  }
}

export default EntrustList;
