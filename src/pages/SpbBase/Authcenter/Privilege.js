import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Modal, message,Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Authcenter.less';

const FormItem = Form.Item;
const { Option } = Select;
const confirms = Modal.confirm;
const CreateForm = Form.create()(props => {
  /* 上下互相调用的方法以及字典等 */
  const { modalVisible, form, handleAdd, fileStatuss, handleModalVisible } = props;
  /* 添加确认 */
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    // 添加弹出框
    <Modal
      destroyOnClose
      title="添加权限信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限编号">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入权限编号！' }],
        })(<Input placeholder="请输入权限编号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入权限名称！' }],
        })(<Input placeholder="请输入权限名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请输入权限类型！' }],
        })(
          <Select allowClear placeholder="请选择权限类型" style={{ width: '100%' }}>
            {fileStatuss.map(item => (
              <Option key={item.id}>{item.experState}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限描述">
        {form.getFieldDecorator('description', {
          rules: [{ required: true, message: '请输入权限描述！' }],
        })(<Input placeholder="请输入权限描述！" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        ...props.values
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
        }
      );
    });
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext()}>
        完成
      </Button>,
    ];
  };

  render() {
    const { form:{getFieldDecorator}, updateModalVisible, handleUpdateModalVisible, fileStatuss } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改部门信息"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem key="code" {...this.formLayout} label="权限编号">
          {getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入权限编号！' }],
            initialValue: formVals.code,
          })(<Input placeholder="请输入权限编号" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="权限名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入权限名称' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入权限名称" />)}
        </FormItem>
        <FormItem key="type" {...this.formLayout} label="权限类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择权限类型！' }],
            initialValue: parseInt(formVals.type,10),
          })(
            <Select allowClear placeholder="请选择权限类型" style={{ width: '100%' }}>
              {fileStatuss.map(item => (
                <Option key={item.id} value={item.id}>{item.experState}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="description" {...this.formLayout} label="权限描述">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入权限描述！' }],
            initialValue: formVals.description,
          })(<Input placeholder="请输入权限描述！" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* 装饰器加载 */
/* eslint react/no-multi-comp:0 */
@connect(({ privilege, loading }) => ({
  privilege,
  loading: loading.models.privilege,
}))
@Form.create()
class Privilege extends PureComponent {
  /* 初始状态 */
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
  };

  /* 页面加载 */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'privilege/fetch',
    });
    dispatch({
      type: 'privilege/fetchExperimental',
    });
    dispatch({
      type: 'privilege/fetchExperResult',
    });
    dispatch({
      type: 'privilege/fetchConfState',
    });
    dispatch({
      type: 'privilege/fetchReagent',
    });
    dispatch({
      type: 'privilege/queryExperimental',
    });
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'privilege/fetch',
      payload: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.handleForm();
  };

  handleSearchs = () => {
    this.handleForm();
  };

  handleForm = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        ExperDate: fieldsValue.ExperDate && fieldsValue.ExperDate.format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'privilege/fetch',
        payload: values,
      });
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const self = this;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'privilege/add',
        payload: {
          ...fields,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if(sta===true){
        message.success('添加成功');
        self.handleSearchs();
      }else{
        message.success('添加失败');
      }
    });
    self.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const self = this;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'privilege/update',
        payload: {
          ...fields,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if(sta===true){
        message.success('修改成功');
        self.handleSearchs();
      }
    });
    self.handleUpdateModalVisible();
  };

  /* 删除数据弹窗 */
  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const conte = '您将删除编号为  ';
    const conten = '  的数据！';
    const html1 = selectedRows.map(row => row.name);
    const contents = conte + html1 + conten;
    const id = selectedRows.map(row => row.id);
    const self = this;
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'privilege/remove',
            payload: {
              ids: id,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta!==null) {
            self.handleSearchs();
            message.success('删除成功');
          }
        });
        self.setState({ selectedRows: [] });
      },
      onCancel() {},
    });
  };

  /* 简单查询的查询条件 */
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      privilege: { fileStatuss },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="权限名称">
              {getFieldDecorator('name')(<Input placeholder="请输入权限名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择权限类型" style={{ width: '100%' }}>
                  {fileStatuss.map(item => (
                    <Option key={item.id}>{item.experState}</Option>
                  ))}
                </Select>
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

  /* 查询条件的切换 */
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  render() {
    const {
      privilege: { data, fileStatuss },
      loading,
    } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const { selectedRows, modalVisible, stepFormValues, updateModalVisible } = this.state;
    const columns = [
      {
        title: '权限编号',
        align: 'center',
        dataIndex: 'code',
        width: '20%',
      },
      {
        title: '权限名称',
        align: 'center',
        dataIndex: 'name',
        width: '20%',
      },
      {
        title: '权限类型',
        align: 'center',
        dataIndex: 'type',
        width: '23%',
        render(val) {
          if (fileStatuss.length > 0) {
            const category = fileStatuss.filter(item => parseInt(item.id, 10) === parseInt(val, 10)
            );
            return category.length > 0 ? category[0].experState : val;
          }
          return val;
        },
      },
      {
        title: '权限描述',
        dataIndex: 'description',
        width: '23%',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <Tooltip title="修改">
              <a onClick={() => this.handleUpdateModalVisible(true, record)}><Icon type="edit"/></a>
            </Tooltip>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="权限管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                添加权限
              </Button>
              <Button onClick={this.showConfirms} disabled={!selectedRows.length > 0}>删除</Button>
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.componentDidMount}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} fileStatuss={fileStatuss} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            fileStatuss={fileStatuss}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Privilege;
