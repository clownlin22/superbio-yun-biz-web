import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Icon,
  Radio,
  Divider,
  Table,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Authcenter.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
const confirms = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;

// 添加角色
const CreateForm = Form.create()(props => {
  /* 上下互相调用的方法以及字典等 */
  const { modalVisible, form, handleAdd, ConfState, handleModalVisible } = props;
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
      title="添加角色信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色编号">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: '请输入角色编号！' }],
        })(<Input placeholder="请输入角色编号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序">
        {form.getFieldDecorator('sort', {
          rules: [{ required: true, message: '排序！' }],
        })(<Input placeholder="排序" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入角色名称！' }],
        })(<Input placeholder="请输入角色名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="系统角色">
        {form.getFieldDecorator('systemic', {
          rules: [{ required: true, message: '请选择是否为系统角色！' }],
        })(
          <Select placeholder="请选择是否为系统角色" style={{ maxWidth: 290, width: '100%' }}>
            {ConfState.map(item => (
              <Option key={item.id}>{item.experState}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否启用">
        {form.getFieldDecorator('enabled', {
          rules: [{ required: true, message: '请选择是否启用！' }],
        })(
          <RadioGroup name="enabled" initialValue={1}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色描述">
        {form.getFieldDecorator('description', {
          rules: [{ required: false, message: '请输入角色描述！' }],
        })(<TextArea rows={4} placeholder="请输入角色描述" />)}
      </FormItem>
    </Modal>
  );
});

// 修改角色
@Form.create()
class UpdateForm extends PureComponent {
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
    const { updateModalVisible, ConfState, handleUpdateModalVisible, form } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改角色信息"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem key="code" {...this.formLayout} label="角色编号">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入角色编号！' }],
            initialValue: formVals.code,
          })(<Input placeholder="请输入角色编号" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
        <FormItem key="enabled" {...this.formLayout} label="是否启用">
          {form.getFieldDecorator('enabled', {
            rules: [{ required: true, message: '请选择是否启用！' }],
            initialValue: formVals.enabled,
          })(
            <RadioGroup name="enabled" initialValue={1}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem key="systemic" {...this.formLayout} label="是否为系统角色">
          {form.getFieldDecorator('systemic', {
            rules: [{ required: true, message: '请选择是否为系统角色！' }],
            initialValue: formVals.systemic,
          })(
            <Select allowClear placeholder="请选择是否为系统角色" style={{ width: '100%' }}>
              {ConfState.map(item => (
                <Option key={item.id} value={item.id}>{item.experState}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem key="description" {...this.formLayout} label="角色描述">
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入角色描述！' }],
            initialValue: formVals.description,
          })(<TextArea rows={4} placeholder="请输入角色描述" />)}
        </FormItem>
      </Modal>
    );
  }
}

// 分配用户
@Form.create()
class DistrForms extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      },
      selectedRowKeys:props.values.userIds
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleInsertUser } = this.props;
    const { formVals: oldValue, selectedRowKeys } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue, selectedRowKeys };
      handleInsertUser(formVals);
    });
  };

  renderFooter = () => {
    const { handleInsertModalVisibles } = this.props;
    return [
      <Button key="cancel" onClick={() => handleInsertModalVisibles()}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext()}>
        完成
      </Button>,
    ];
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { updateModalVisibles, handleInsertModalVisibles, form, user } = this.props;
    const { formVals,selectedRowKeys } = this.state;
    const columns = [
      {
        title: '登录名称',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '用户手机',
        dataIndex: 'phone',
        key: 'phone',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="分配用户信息"
        visible={updateModalVisibles}
        footer={this.renderFooter()}
        onCancel={() => handleInsertModalVisibles()}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem key="name" {...this.formLayout} label="角色名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入角色名称！' }],
                initialValue: formVals.name,
              })(<Input disabled placeholder="请输入角色名称！" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem key="code" {...this.formLayout} label="角色编码">
              {form.getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入角色编码！' }],
                initialValue: formVals.code,
              })(<Input disabled placeholder="请输入角色编码！" />)}
            </FormItem>
          </Col>
        </Row>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={user}
        />
      </Modal>
    );
  }
}

// 菜单授权
@Form.create()
class AuthForms extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        ...props.values,
      },
      selectedRowKeys:props.values.permissionIds
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleAuth } = this.props;
    const { formVals: oldValue, selectedRowKeys } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue, selectedRowKeys };
      handleAuth(formVals);
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  renderFooter = () => {
    const { handleAuthModalVisibles } = this.props;
    return [
      <Button key="cancel" onClick={() => handleAuthModalVisibles()}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext()}>
        完成
      </Button>,
    ];
  };

  render() {
    const { authModalVisibles, handleAuthModalVisibles, form, privilege, fileStatuss } = this.props;
    const { formVals,selectedRowKeys } = this.state;
    const columns = [
      {
        title: '权限名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '权限类型',
        dataIndex: 'type',
        key: 'type',
        render(val) {
          if (fileStatuss.length > 0) {
            const category = fileStatuss.filter(
              item => parseInt(item.id, 10) === parseInt(val, 10)
            );
            return category.length > 0 ? category[0].experState : val;
          }
          return val;
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="菜单授权信息"
        visible={authModalVisibles}
        footer={this.renderFooter()}
        onCancel={() => handleAuthModalVisibles()}
      >
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={12} sm={24}>
            <FormItem key="code" {...this.formLayout} label="角色编码">
              {form.getFieldDecorator('code', {
                rules: [{required: true, message: '请输入角色编码！'}],
                initialValue: formVals.code,
              })(<Input disabled placeholder="请输入角色编码！" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem key="name" {...this.formLayout} label="角色名称">
              {form.getFieldDecorator('name', {
                rules: [{required: true, message: '请输入角色名称！'}],
                initialValue: formVals.name,
              })(<Input disabled placeholder="请输入角色名称！" />)}
            </FormItem>
          </Col>
        </Row>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={privilege}
        />
      </Modal>
    );
  }
}

/* 装饰器加载 */
/* eslint react/no-multi-comp:0 */
@connect(({ role,manageUser, loading }) => ({
  role,
  manageUser,
  loading: loading.models.role,
}))
@Form.create()
class Role extends PureComponent {
  /* 初始状态 */
  state = {
    expandForm: false,
    selectedRows: [],
  };

  /* 页面加载 */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
    // 用户与角色中间表
    dispatch({
      type: 'manageUser/fetchUserRole',
    });
    // 角色权限中间表
    dispatch({
      type: 'role/fetchRolePer',
    });
  }

  /* 重置按钮 */
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'role/fetch',
      payload: {},
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleInsertModalVisibles = (flag, record) => {
    this.setState({
      updateModalVisibles: !!flag,
      stepFormValuess: record || {},
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchUser',
    });
  };

  handleAuthModalVisibles = (flag, record) => {
    this.setState({
      authModalVisibles: !!flag,
      authFormValues: record || {},
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchPrivilege',
    });
    dispatch({
      type: 'role/fetchExperimental',
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  /* 停用数据的弹窗 */
  deleteConfirmss = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将停用角色名称为   ';
    const conten = '    的角色信息！';
    const caseNoList = [];
    const idList = [];
    const html1 = selectedRows.map(row => row.name);
    const caseId = selectedRows.map(row => row.id);
    const statu = selectedRows.map(row => row.enabled);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(1,10)){
        caseNoList.push(html1[i]);
        idList.push(caseId[i])
      }
    }
    const contents = conte + caseNoList + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要停用本角色吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'role/updateStatus',
            payload: {
              ids: idList,
              enabled: parseInt(0,10),
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1===true) {
            self.handleSearchs();
            message.success('停用成功');
          }
        });
        self.setState({ selectedRows: [] });
      },
      onCancel() {},
    });
  };

  /* 启用数据的弹窗 */
  startConfirmss = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将启用角色名称为   ';
    const conten = '    的角色信息！';
    if (!selectedRows) return;
    const caseNoList = [];
    const idList = [];
    const html1 = selectedRows.map(row => row.name);
    const caseId = selectedRows.map(row => row.id);
    const statu = selectedRows.map(row => row.enabled);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(0,10)){
        caseNoList.push(html1[i]);
        idList.push(caseId[i])
      }
    }
    const contents = conte + caseNoList + conten;
    confirms({
      title: '确定要启用数据状态吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'role/updateStatus',
            payload: {
              ids: idList,
              enabled: parseInt(1,10),
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1===true) {
            self.handleSearchs();
            message.success('启用成功');
          }
        });
        self.setState({ selectedRows: [] });
      },
      onCancel() {},
    });
  };

  /* 选中的行 */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /* 查询条件 */
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'role/fetch',
        payload: values,
      });
      // 用户与角色中间表
      dispatch({
        type: 'manageUser/fetchUserRole',
      });
      // 角色权限中间表
      dispatch({
        type: 'role/fetchRolePer',
      });
    });
  };

  /* 删除数据弹窗 */
  deleteConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将删除角色名称为   ';
    const conten = '    的数据！';
    const html1 = selectedRows.map(row => row.name);
    const contents = conte + html1 + conten;
    const id = selectedRows.map(row => row.id);
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'role/remove',
            payload: {
              ids: id,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta===true) {
            message.success('删除成功');
            self.handleSearchs();
          }
        });
        self.setState({ selectedRows: [] });
      },
      onCancel() {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const self = this;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'role/add',
        payload: {
          ...fields,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if(sta!==null){
        message.success('添加成功');
        self.handleSearchs();
      }
    });
    self.handleModalVisible();
  };

  handleUpdate = fields => {
    const self = this;
    const { dispatch } = this.props;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'role/update',
        payload: {
          ...fields,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if(sta!==null){
        message.success('修改成功');
        self.handleSearchs();
      }
    });
    self.handleUpdateModalVisible();
  };

  handleInsertUser = fields => {
    console.log(fields,'fields')
    const {dispatch} = this.props;
    const self = this;
    const role = [];
    if(fields.selectedRowKeys!==undefined){
      for (let i = 0; i < fields.selectedRowKeys.length; i += 1) {
        role.push(fields.selectedRowKeys[i])
      }
    }
    const field = {
      ...fields,
      userId: role,
    };

    new Promise((resolve, reject) => {
      dispatch({
        type: 'role/update',
        payload: {
          ...field,
          resolve,
          reject
        },
      })
    }).then((sta) => {
        message.success('分配成功');
        self.handleSearchs();
    });
    self.handleInsertModalVisibles();
    self.handleSearchs();
  };

  handleAuth = fields => {
    const {dispatch} = this.props;
    const self = this;
    const permission = [];
    if (fields.selectedRowKeys !== undefined) {
      for (let i = 0; i < fields.selectedRowKeys.length; i += 1) {
        permission.push(fields.selectedRowKeys[i])
      }
    }
    const field = {
      ...fields,
      permissionId: permission,
    };
    new Promise((resolve, reject) => {
      dispatch({
        type: 'role/update',
        payload: {
          ...field,
          resolve,
          reject
        },
      })
    }).then((sta) => {
        message.success('授权成功');
        self.handleSearchs();
    });
    self.handleAuthModalVisibles();
  };

  /* 简单查询和复杂查询的互换 */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /* 简单查询的查询条件 */
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      role: { ConfState },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色昵称">
              {getFieldDecorator('name')(<Input placeholder="请输入角色名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('enabled')(
                <Select allowClear placeholder="请选择是否为是否启用" style={{ width: '100%' }}>
                  {ConfState.map(item => (
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  /* 复杂查询的查询条件 */
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      role: { ConfState },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色编号">
              {getFieldDecorator('code')(<Input placeholder="请输入角色编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入角色名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="系统角色">
              {getFieldDecorator('systemic')(

                <Select allowClear placeholder="请选择是否为系统角色" style={{ width: '100%' }}>
                  {ConfState.map(item => (
                    <Option key={item.id} value={item.id}>{item.experState}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('enabled')(
                <Select allowClear placeholder="请选择是否为系统角色" style={{ width: '100%' }}>
                  {ConfState.map(item => (
                    <Option key={item.id}>{item.experState}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }

  /* 查询条件的切换 */
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    /* 引入字典和数据 */
    const {
      role: { data, Result, ConfState, privilege, user, fileStatuss,RolePermission },
      manageUser:{userRole},
      loading,
    } = this.props;
    /* 引入弹窗，选中行，加载等数据 */
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      updateModalVisibles,
      authModalVisibles,
      stepFormValues,
      stepFormValuess,
      authFormValues,
    } = this.state;

    /* 当前表的列头 */
    const columns = [
      {
        title: '角色编号',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        width: 150,
        render(val, record) {
          if (userRole.length > 0) {
            const catego = userRole.filter(item => item.roleId === record.id);
            const userIds = [];
            for (let i = 0; i < catego.length; i += 1) {
              userIds.push(catego[i].userId);
            }
            record.userIds = userIds;
          }
          if (RolePermission.length > 0) {
            const categos = RolePermission.filter(item => item.roleId === record.id);
            const permissionIds = [];
            for (let j = 0; j < categos.length; j += 1) {
              permissionIds.push(categos[j].permissionId);
            }
            record.permissionIds = permissionIds;
          }
          return val;
        },
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 150,
      },
      {
        title: '系统角色',
        dataIndex: 'systemic',
        key: 'systemic',
        align: 'center',
        width: 150,
        render(val) {
          if (ConfState.length > 0) {
            const category = ConfState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            return category.length > 0 ? category[0].experState : val;
          }
          return val;
        },
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        key: 'enabled',
        align: 'center',
        width: 150,
        render(val) {
          if (ConfState.length > 0) {
            const category = ConfState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            return category.length > 0 ? category[0].experState : val;
          }
          return val;
        },
      },
      {
        title: '角色描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center',
        width: 400,
      },
      {
        title: '操作',
        align: 'center',
        width: '110px',
        render: (text, record) => (
          <Fragment>
            <Tooltip title="修改">
              <a onClick={() => this.handleUpdateModalVisible(true, record)}><Icon type="edit" /></a>
            </Tooltip>
            {/* 分配用户 —— 名称，昵称 */}
            <Divider type="vertical" />
            <Tooltip title="分配用户">
              <a onClick={() => this.handleInsertModalVisibles(true, record)}><Icon type="setting" /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="菜单授权">
              <a onClick={() => this.handleAuthModalVisibles(true, record)}><Icon type="profile" /></a>
            </Tooltip>
          </Fragment>
        ),
      },
    ];
    // columns = columns.filter(item => item.key !== 'userIds');
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const updateMethodss = {
      handleInsertModalVisibles: this.handleInsertModalVisibles,
      handleInsertUser: this.handleInsertUser,
    };
    const authMethodss = {
      handleAuthModalVisibles: this.handleAuthModalVisibles,
      handleAuth: this.handleAuth,
    };
    return (
      <PageHeaderWrapper title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {/*  按钮  */}
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                添加角色信息
              </Button>
              <Button
                type="danger"
                onClick={this.deleteConfirms}
                disabled={!selectedRows.length > 0}
              >
                删除角色信息
              </Button>
              <Button
                onClick={this.deleteConfirmss}
                disabled={!selectedRows.filter(item => parseInt(item.enabled, 10) === 1).length > 0}
              >
                停用
              </Button>
              <Button
                onClick={this.startConfirmss}
                disabled={!selectedRows.filter(item => parseInt(item.enabled, 10) === 0).length > 0}
              >
                启用
              </Button>
              {/* 查看数据的弹窗 */}
            </div>
            {/* 初始数据 */}
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          Result={Result}
          ConfState={ConfState}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            Result={Result}
            ConfState={ConfState}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {stepFormValuess && Object.keys(stepFormValuess).length ? (
          <DistrForms
            {...updateMethodss}
            Result={Result}
            privilege={privilege}
            user={user}
            ConfState={ConfState}
            updateModalVisibles={updateModalVisibles}
            values={stepFormValuess}
          />
        ) : null}
        {authFormValues && Object.keys(authFormValues).length ? (
          <AuthForms
            {...authMethodss}
            privilege={privilege}
            fileStatuss={fileStatuss}
            authModalVisibles={authModalVisibles}
            values={authFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Role;
