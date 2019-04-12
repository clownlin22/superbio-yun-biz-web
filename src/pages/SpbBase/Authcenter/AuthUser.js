import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  message,
  TreeSelect,
  Radio,
  Divider,
  Table,
  Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Authcenter.less';

const FormItem = Form.Item;
const { Option } = Select;
const confirms = Modal.confirm;
const RadioGroup = Radio.Group;

// 新增用户
const CreateForm = Form.create()(props => {
  const buildTree = (Reagent) => {
    if (Reagent === null) return;
    const temp1 = [...Array.from(new Set(JSON.parse(Reagent)))];
    const temp = {};
    const tree = [];

    for (const i in temp1) {
      temp1[i].key = i-1;
      temp1[i].value = temp1[i].id;
      temp1[i].title = temp1[i].name;
      temp[temp1[i].id] = temp1[i];
    }

    for (const i in temp) {
      if (temp[i].parentId && temp[temp[i].parentId]) {
        if (temp[temp[i].parentId] !== null && !temp[temp[i].parentId].children) {
          temp[temp[i].parentId].children = new Array();
        }
        temp[temp[i].parentId].children.push(temp[i]);
      } else {
        tree.push(temp[i]);
      }
    }
    return tree;
  };

  /* 上下互相调用的方法以及字典等 */
  const { modalVisible, form, handleAdd, Reagent, handleModalVisible,role } = props;
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
      title="添加用户信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名称">
        {form.getFieldDecorator('loginName', {
          rules: [{ required: true, message: '请输入登录名称！' }],
        })(<Input placeholder="请输入登录名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户昵称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入用户昵称！' }],
        })(<Input placeholder="请输入用户昵称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
        {form.getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入联系方式！' }],
        })(<Input placeholder="请输入联系方式" />)}
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户邮箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: false, message: '请输入用户邮箱！' }],
        })(<Input placeholder="请输入用户邮箱" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所在部门">
        {form.getFieldDecorator('deptIds', {
          rules: [{ required: true, message: '请选择所在部门！' }],
        })(
          <TreeSelect
            style={{ width: 300 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={buildTree(JSON.stringify(Reagent))}
            placeholder="所在部门"
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户角色">
        {form.getFieldDecorator('roleIds', {
          rules: [{ required: true, message: '可多选！' }],
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="多选框">
            {role.map(item => (
              <Option key={item.id}>{item.name}</Option>
            ))}
          </Select>
        )}
      </FormItem>
    </Modal>
  );
});

// 修改用户
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
      handleUpdate(formVals);
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
    const buildTree = (Reagent) => {
      if (Reagent === null) return;
      const temp1 = [...Array.from(new Set(JSON.parse(Reagent)))];
      const temp = {};
      const tree = [];

      for (const i in temp1) {
        temp1[i].key = i-1;
        temp1[i].value = temp1[i].id;
        temp1[i].title = temp1[i].name;
        temp[temp1[i].id] = temp1[i];
      }

      for (const i in temp) {
        if (temp[i].parentId && temp[temp[i].parentId]) {
          if (temp[temp[i].parentId] !== null && !temp[temp[i].parentId].children) {
            temp[temp[i].parentId].children = new Array();
          }
          temp[temp[i].parentId].children.push(temp[i]);
        } else {
          tree.push(temp[i]);
        }
      }
      return tree;
    };

    const {
      form: { getFieldDecorator },
      updateModalVisible,
      handleUpdateModalVisible,
      role,
      Reagent,
    } = this.props;

    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改用户信息"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible()}
      >
        <FormItem key="loginName" {...this.formLayout} label="登录账号">
          {getFieldDecorator('loginName', {
            rules: [{ required: true, message: '请输入登录账号！' }],
            initialValue: formVals.loginName,
          })(<Input placeholder="请输入登录账号" />)}
        </FormItem>
        <FormItem key="name" {...this.formLayout} label="用户姓名">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户姓名' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入用户姓名" />)}
        </FormItem>
        <FormItem key="phone" {...this.formLayout} label="联系方式">
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入联系方式！' }],
            initialValue: formVals.phone,
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        <FormItem key="enabled" {...this.formLayout} label="是否启用">
          {getFieldDecorator('enabled', {
            rules: [{ required: true, message: '请选择是否启用！' }],
            initialValue: formVals.enabled,
          })(
            <RadioGroup name="enabled">
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem key="email" {...this.formLayout} label="用户邮箱">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入用户邮箱' }],
            initialValue: formVals.email,
          })(<Input placeholder="请输入用户邮箱" />)}
        </FormItem>
        <FormItem key="deptIds" {...this.formLayout} label="所在部门">
          {getFieldDecorator('deptIds', {
            rules: [{ required: true, message: '请选择所在部门' }],
            initialValue: formVals.deptIds,
          })(
            <TreeSelect
              style={{ width: 300 }}
              // value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={buildTree(JSON.stringify(Reagent))}
              placeholder="所在部门"
            />
          )}
        </FormItem>
        <FormItem key="roleIds" {...this.formLayout} label="用户角色">
          {getFieldDecorator('roleIds', {
            rules: [{ required: true, message: '可多选' }],
            initialValue: formVals.roleIds,
          })(
            <Select mode="multiple" style={{ width: '100%' }} placeholder="多选框">
              {role.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

// 分配角色
@Form.create()
class UpdateForms extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        ...props.values,
      },
      selectedRowKeys:props.values.roleIds
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = () => {
    const { form, handleUpdates } = this.props;
    const { formVals: oldValue, selectedRowKeys } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue, selectedRowKeys };
      handleUpdates(formVals);
    });
  };

  renderFooter = () => {
    const { handleUpdateModalVisibles } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisibles()}>
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
    const {
      form: { getFieldDecorator },
      updateModalVisibles,
      handleUpdateModalVisibles,
      role,
    } = this.props;
    const { formVals,selectedRowKeys } = this.state;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '角色编码',
        dataIndex: 'code',
        key: 'code',
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
        title="分配角色信息"
        visible={updateModalVisibles}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisibles()}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem key="loginName" {...this.formLayout} label="登录名称">
              {getFieldDecorator('loginName', {
                rules: [{ required: true, message: '请输入登录名称！' }],
                initialValue: formVals.loginName,
              })(<Input disabled />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem key="name" {...this.formLayout} label="用户昵称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入用户昵称！' }],
                initialValue: formVals.name,
              })(<Input disabled />)}
            </FormItem>
          </Col>
        </Row>
        <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={role} />
      </Modal>
    );
  }
}

/* 装饰器加载 */
/* eslint react/no-multi-comp:0 */
@connect(({ manageUser,role, loading }) => ({
  role,
  manageUser,
  loading: loading.models.manageUser,
}))
@Form.create()
class AuthUser extends PureComponent {
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
      type: 'manageUser/fetch',
    });
    // 伪角色数据
    dispatch({
      type: 'manageUser/fetchConfState',
    });
    // 用户与部门中间表
    dispatch({
      type: 'manageUser/fetchUserDept',
    });
    // 用户与角色中间表
    dispatch({
      type: 'manageUser/fetchUserRole',
    });
    // 部门
    dispatch({
      type: 'manageUser/fetchReagent',
    });
    // 用户角色
    dispatch({
      type: 'manageUser/fetchRoles',
    });
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdateModalVisibles = (flag, record) => {
    this.setState({
      updateModalVisibles: !!flag,
      stepFormValues: record || {},
    });

    const { dispatch } = this.props;
    // 用户与部门中间表
    dispatch({
      type: 'manageUser/fetchUserDept',
    });
    // 用户与角色中间表
    dispatch({
      type: 'manageUser/fetchUserRole',
    });
    // 部门
    dispatch({
      type: 'manageUser/fetchReagent',
    });
    // 用户角色
    dispatch({
      type: 'manageUser/fetchRoles',
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'manageUser/fetch',
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

  handleForm = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        ExperDate: fieldsValue.ExperDate && fieldsValue.ExperDate.format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'manageUser/fetch',
        payload: values,
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.handleForm();
  };

  handleSearchs = () => {
    this.handleForm();
  };

  handleAdd = fields => {
    const self = this;
    const {dispatch} = this.props;
    const role = [];
    for(let i=0;i<fields.roleIds.length;i+=1){
      role.push(fields.roleIds[i])
    }
    const dept = [];
    dept.push(fields.deptIds);
    const field = {
      enabled: parseInt(fields.enabled, 10),
      roleId:role,
      deptId:dept,
      password: 888888,
      ...fields,
    };
    new Promise((resolve, reject) => {
      dispatch({
        type: 'manageUser/add',
        payload: {
          ...field,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if(sta!==null){
        message.success('添加成功');
        self.handleSearchs();
        // 用户与部门中间表
        dispatch({
          type: 'manageUser/fetchUserDept',
        });
        // 用户与角色中间表
        dispatch({
          type: 'manageUser/fetchUserRole',
        });
        // 部门
        dispatch({
          type: 'manageUser/fetchReagent',
        });
        // 用户角色
        dispatch({
          type: 'manageUser/fetchRoles',
        });
      }
    });
    self.handleModalVisible();
  };

  handleUpdate = fields => {
    const {dispatch} = this.props;
    const self = this;
    const role = [];
    if(fields.roleIds.length!==undefined){
      for (let i = 0; i < fields.roleIds.length; i += 1) {
        role.push(fields.roleIds[i])
      }
    }else{
      role.push(fields.roleIds)
    }
    const dept = [];
    dept.push(fields.deptIds);
    const field = {
      ...fields,
      enabled: parseInt(fields.enabled, 10),
      roleId: role,
      deptId: dept,
    };

    new Promise((resolve, reject) => {
      dispatch({
        type: 'manageUser/update',
        payload: {
          ...field,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if (sta !== null) {
        // 用户与部门中间表
        dispatch({
          type: 'manageUser/fetchUserDept',
        });
        // 用户与角色中间表
        dispatch({
          type: 'manageUser/fetchUserRole',
        });
        // 部门
        dispatch({
          type: 'manageUser/fetchReagent',
        });
        // 用户角色
        dispatch({
          type: 'manageUser/fetchRoles',
        });
        message.success('修改成功');
        self.handleSearchs();
      }
    });
    self.handleUpdateModalVisible();
  };

  handleUpdates = fields => {
    const {dispatch} = this.props;
    const self = this;
    const dept = [];
    dept.push(fields.deptIds);
    const role = [];
    for (let i = 0; i < fields.selectedRowKeys.length; i += 1) {
      role.push(fields.selectedRowKeys[i])
    }
    const field = {
      ...fields,
      enabled: parseInt(fields.enabled, 10),
      roleId: role,
      deptId: dept,
    };
    new Promise((resolve, reject) => {
      dispatch({
        type: 'manageUser/update',
        payload: {
          ...field,
          resolve,
          reject
        },
      })
    }).then((sta) => {
      if (sta !== null) {
        // 用户与部门中间表
        dispatch({
          type: 'manageUser/fetchUserDept',
        });
        // 用户与角色中间表
        dispatch({
          type: 'manageUser/fetchUserRole',
        });
        // 部门
        dispatch({
          type: 'manageUser/fetchReagent',
        });
        // 用户角色
        dispatch({
          type: 'manageUser/fetchRoles',
        });
        message.success('修改成功');
        self.handleSearchs();
      }
    });
    self.handleUpdateModalVisible();
  };

  /* 简单查询和复杂查询的互换 */
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /* 修改数据的弹窗 */
  showConfirms = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    const self = this;
    const conte = '您将停用登录名称为';
    const conten = '    的用户信息！';
    if (!selectedRows) return;
    const caseNoList = [];
    const idList = [];
    const html1 = selectedRows.map(row => row.loginName);
    const caseId = selectedRows.map(row => row.id);
    const statu = selectedRows.map(row => row.enabled);
    for (let i = 0; i < statu.length; i += 1) {
      if (parseInt(statu[i], 10) === parseInt(1, 10)) {
        caseNoList.push(html1[i]);
        idList.push(caseId[i])
      }
    }
    const contents = conte + caseNoList + conten;
    confirms({
      title: '确定要停用数据状态吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'manageUser/updateStatus',
            payload: {
              ids: idList,
              enabled: parseInt(0, 10),
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1 === true) {
            self.handleSearchs();
            message.success('停用成功');
          }
        });
        self.setState({selectedRows: []});
      },
      onCancel() {
      }
    });
  };

  /* 修改数据的弹窗 */
  showEnabled = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将启用登录名称为';
    const conten = '    的用户信息！';
    if (!selectedRows) return;
    const caseNoList = [];
    const idList = [];
    const html1 = selectedRows.map(row => row.loginName);
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
            type: 'manageUser/updateStatus',
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

  /* 修改数据的弹窗 */
  deleteConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将删除登录名称为';
    const conten = '    的用户信息！';
    const html1 = selectedRows.map(row => row.loginName);
    const contents = conte + html1 + conten;
    const id = selectedRows.map(row => row.id);
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'manageUser/remove',
            payload: {
              ids: id,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta!==null) {
            self.handleSearchs();
          }
        });
        message.success('删除成功');
        self.setState({ selectedRows: [] });
      },
      onCancel() {
      },
    });
  };

  /* 修改密码的弹窗 */
  resetConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将修改登录名称为';
    const conten = '    的用户密码！';
    const html1 = selectedRows.map(row => row.loginName);
    const id = selectedRows.map(row => row.id);
    const contents = conte + html1 + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要修改密码吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'manageUser/updatePass',
            payload: {
              ids: id,
              password: 888888,
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1===true) {
            self.handleSearchs();
            message.success('修改成功，初始密码为888888');
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录名称">
              {getFieldDecorator('loginName')(<Input placeholder="请输入登录名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('name')(<Input placeholder="请输入用户昵称" />)}
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
      manageUser: { confState, fileStatuss, Reagent },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录名称">
              {getFieldDecorator('loginName')(<Input placeholder="请输入登录名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('name')(<Input placeholder="请输入用户昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('phone')(<Input placeholder="请输入联系方式" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('enabled')(
                <Select allowClear placeholder="请选择是否启用" style={{ width: '100%' }}>
                  {fileStatuss.map(item => (
                    <Option key={item.id}>{item.experState}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入用户邮箱" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="所在部门">
              {getFieldDecorator('dept')(
                <Select allowClear placeholder="请选择所在部门" style={{ width: '100%' }}>
                  {Reagent.map(item => (
                    <Option key={item.id}>{item.experState}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  /* 查询条件的切换 */
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      // role 角色
      manageUser: { data, role, confState, Reagent, fileStatuss,userRole,userDept },
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
    const updateMethodss = {
      handleUpdateModalVisibles: this.handleUpdateModalVisibles,
      handleUpdates: this.handleUpdates,
    };
    const {
      selectedRows,
      modalVisible,
      stepFormValues,
      updateModalVisible,
      updateModalVisibles,
    } = this.state;
    const columns = [
      {
        title: '登录名称',
        dataIndex: 'loginName',
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        width: 150,
        render(val) {
          if (fileStatuss.length > 0) {
            const category = fileStatuss.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            return category.length > 0 ? category[0].experState : val;
          }
          return val;
        },
      },
      {
        title: '用户邮箱',
        dataIndex: 'email',
      },
      {
        title: '所在部门',
        dataIndex: 'deptIds',
        render(val,record) {
          if (userDept.length > 0) {
            const category = userDept.filter(item => item.userId === record.id);
            if(category[0]!==undefined){
              const deId = category[0].deptId;
              for (let i = 0; i < Reagent.length; i += 1) {
                const categos = Reagent.filter(item => item.id === deId);
                record.deptIds = deId;
                return categos.length>0?categos[0].name:val;
              }
            }
          }
          return val;
        },
      },
      {
        title: '用户角色',
        dataIndex: 'roleIds',
        render(val, record) {
          if (userRole.length > 0) {
            const catego = userRole.filter(item => item.userId === record.id);
            const roIds = [];
            let html = '';
            const pun = ',';
            for (let j = 0; j < catego.length; j += 1) {
              roIds.push(catego[j].roleId);
            }
            for (let i = 0; i < roIds.length; i += 1) {
              const categos = role.filter(item => item.id === roIds[i]);
              const html1 = categos.length > 0 ? categos[0].name : "";
              if (i < roIds.length - 1) {
                html += html1 + pun;
              } else {
                html += html1;
              }
            }
            record.roleIds = roIds;
            return html;
          }
          return val;
        },
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
            {/* 分配角色 —— 名称，昵称 */}
            <Divider type="vertical" />
            <Tooltip title="分配角色">
              <a onClick={() => this.handleUpdateModalVisibles(true, record)}><Icon type="setting" /></a>
            </Tooltip>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                添加用户
              </Button>
              <Button
                onClick={this.showConfirms}
                disabled={!selectedRows.filter(item => parseInt(item.enabled, 10) === 1).length > 0}
              >
                停用用户
              </Button>
              <Button
                onClick={this.showEnabled}
                disabled={!selectedRows.filter(item => parseInt(item.enabled, 10) === 0).length > 0}
              >
                启用用户
              </Button>
              <Button onClick={this.deleteConfirms} disabled={!selectedRows.length > 0}>
                删除用户
              </Button>
              <Button onClick={this.resetConfirms} disabled={!selectedRows.length > 0}>
                重置密码
              </Button>
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              // onChange={this.componentDidMount}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          role={role}
          confState={confState}
          Reagent={Reagent}
          fileStatuss={fileStatuss}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            Reagent={Reagent}
            fileStatuss={fileStatuss}
            role={role}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForms
            {...updateMethodss}
            role={role}
            selectedRows={selectedRows}
            updateModalVisibles={updateModalVisibles}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default AuthUser;
