import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Card,
  Col,
  Row,
  Modal,
  Select,
  TreeSelect,
  Button,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './Authcenter.less';

const confirms = Modal.confirm;
const { Option } = Select;
const FormItem = Form.Item;
const deptType = [
  {
    key: 0,
    value: "部门类型"
  }, {
    key: 1,
    value: "部门类型1"
  }, {
    key: 2,
    value: "部门类型2"
  }, {
    key: 3,
    value: "部门类型3"
  }
];

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {

    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  handleClickOutside = (e) => {
    const {editing} = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  render() {
    const {editing} = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{margin: 0}}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input ref={node => (this.input = node)} onPressEnter={this.save}/>
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{paddingRight: 24}}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

@Form.create()
class AreaModal extends PureComponent {
  onOk = () => {
    const {form, handleOk} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState(() => {
        handleOk(values);
      });

      form.resetFields();
    });
  };

  onCancel = () => {
    const {form, handleCancel} = this.props;
    this.setState(() => {
      handleCancel();
    });
    form.resetFields();
  };

  onchange = (value, selectedOptions) => {
    const {onchange} = this.props;

    this.setState(() => {
      onchange(selectedOptions[selectedOptions.length - 1]);
    });
  };

/*  loadData = selectedOptions => {
    const {loadData} = this.props;

    this.setState(() => {
      loadData(selectedOptions[selectedOptions.length - 1]);
    });
  };

  check = (rule, value, callback) => {
    const {dispatch, action} = this.props;

    new Promise((resolve, reject) => {
      dispatch({
        type: 'DistrictModel/checkCode',
        payload: {
          code: value,
          resolve,
          reject
        },
      });
    }).then((data) => {
      if (value.length !== 0) {
        if (!/^\d{1,}$/.test(value)) {
          callback("请输入数字")
        }

        if (data.length != 0 && action !== '修改')
          callback("该地区编码已存在");

      } else {
        callback("该项不可为空")
      }
      callback();
    });
  }; */

  render() {
    const {form, areaModalVisible, action, selectRow, dataList,type,treeNames} = this.props;
    const buildTree = () => {
      if (dataList === null) return;
      const temp1 = JSON.parse(JSON.stringify(dataList));
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

    return (
      <Modal
        title={`${action}信息`}
        visible={areaModalVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="部门名称">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '请选择部门名称！'}],
            initialValue: selectRow.name,
          })(<Input placeholder="请输入部门名称" />)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="上级部门">
          {form.getFieldDecorator('parentId', {
            initialValue: parseInt(selectRow.parentId, 10) === parseInt(0, 10) ? "" : selectRow.parentId,
          })(
            <TreeSelect
              // disabled={parseInt(selectRow.parentId, 10) === parseInt(0, 10) ? true : false}
              disabled={selectRow.isEdit === 1 ? true : false}
              style={{width: 300}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={buildTree(JSON.stringify(dataList))}
              placeholder="上级部门"
            />
          )}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="部门类型">
          {form.getFieldDecorator('type', {
            rules: [{required: true, message: '请选择部门类型！'}],
            initialValue: selectRow.type
          })(
            <Select placeholder="请选择部门类型" style={{width: '100%'}}>
              {deptType.map(item => (
                <Option key={item.key} value={item.key}>{item.value}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="排序号">
          {form.getFieldDecorator('treeSort', {
            rules: [{required: true, message: '请输入排序号！'}],
            initialValue: action === '排序号' ? type : selectRow.treeSort,
          })(<Input placeholder="请输入排序号" />)}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({departMent, loading}) => ({
  departMent,
  loading: loading.models.departMent,
}))
@Form.create()
class Department extends PureComponent {
  state = {
    selectRow: {},
    selectedRows: [],
    areaModalVisible: false,
    action: '',
    treeNames: '',
    type: '',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'departMent/getDistrict',
      payload: {
        parentId: 0
      },
    });
    dispatch({
      type: 'departMent/fetchDistrict',
    });
  }

  // 11
  buildTree = (data, total) => {
    if (data === null) return;
    const temp1 = [...Array.from(new Set(JSON.parse(data)))];
    const temp = {};
    const tree = [];

    for (const i in temp1) {
      if (temp1[i].treeLeaf === 1) {
        temp1[i].children = new Array();
      }
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

    const result = {
      list: tree,
      total
    };
    return result;
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const data = {
        type:fieldsValue.type ===''?undefined:fieldsValue.type,
        name:fieldsValue.name ===''?undefined:fieldsValue.name
      };

      if (data.type===undefined&&data.name===undefined){
        dispatch({
          type: 'departMent/getDistrict',
          payload: {
            parentId:0
          },
        });
      } else {
        dispatch({
          type: 'departMent/getDistrict',
          payload: data
        });
      }
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'departMent/fetch',
      payload: {
        parentId:0
      },
    });
    dispatch({
      type: 'departMent/fetchDistrict',
    });
  };

  buildTreeTest = (list) => {
    if (list === null) return;
    const temp1 = [...Array.from(new Set(JSON.parse(list)))];
    const temp = {};
    const tree = [];
    for (const i in temp1) {
      temp[temp1[i].code] = temp1[i];
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showAreaModal = (e, act) => {
    const {selectedRows} = this.state;
    if (act === '修改') {
      const treeNames = selectedRows[0].treeNames.split('/');
      treeNames.pop();

      const selectTreeNames = selectedRows[0].parentIds.split(',');
      selectTreeNames.shift();

      const firstRow = {
        ...selectedRows[0],
        selectTreeNames,
        treeNames: treeNames.join('/'),
        isEdit: 1,
      };
      this.setState({
        action: act,
        selectRow: firstRow,
      });
    }
    if (act === '添加下级') {
      const selectTreeNames = selectedRows[0].parentCodes + ',' + selectedRows[0].code;
      const temp = selectTreeNames.split(',');

      temp.shift();
      const firstRows = {
        selectTreeNames: temp,
        parentId: selectedRows[0].id,
      };
      this.setState({
        selectRow: firstRows,
      });
    }
    if (act === '新增部门') {
      this.setState({
        action: act,
        selectRow: {},
      });
    }
    this.setState({
      areaModalVisible: true,
    });
  };

  remove = () => {
    const self = this;
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    const id = selectedRows.map(item => item.id);
    confirms({
      title: '确定要删除该部门及其下级部门?',
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'departMent/remove',
            payload: {
              ids: id,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta!==null) {
            self.handleFormReset();
            message.success('删除成功');
            self.setState({  selectedRows: [] });
          }
        });
      },
      onCancel() {},
    });
  };

  handleOk = (values) => {
    const { dispatch, form } = this.props;
    const { action } = this.state;
    const { selectedRows } = this.state;
    const self = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // let values = '';
      if (action === '修改') {
        const value = {
          ...values,
          id: selectedRows[0].id,
        };
        new Promise((resolve, reject) => {
          dispatch({
            type: 'departMent/update',
            payload: {
              ...value,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if(sta!==null){
            self.setState({  selectedRows: [] });
            self.handleFormReset();
            message.success('修改成功');
          }
        });
      }
      if (action === '添加下级') {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'departMent/add',
            payload: {
              ...fieldsValue,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if(sta!==null){
            message.success('添加成功');
            self.handleFormReset();
          }
        });
      }
      if (action === '新增部门') {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'departMent/add',
            payload: {
              ...values,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if(sta!==null){
            message.success('添加成功');
            self.handleFormReset();
          }
        });
      }
    });
    // form.resetFields();
    self.setState({
      selectRow: {},
      selectedRows: [],
      areaModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      areaModalVisible: false,
      selectRow: {},
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="部门名称">
              {getFieldDecorator('name')(<Input placeholder="请输入部门名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门类型">
              {getFieldDecorator('type')(
                <Select allowClear placeholder="请选择部门类型" style={{ width: '100%' }}>
                  {deptType.map(item => (
                    <Option key={item.key}>{item.value}</Option>
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
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      departMent: {data,dataList},
      dispatch
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '部门类型',
        dataIndex: 'type',
        key: 'type',
        render(val) {
          if (deptType.length > 0) {
            const category = deptType.filter(item => item.key === val);
            return category.length > 0 ? category[0].value : val;
          }
          return val;
        },
      },
      {
        title: '排序号',
        dataIndex: 'treeSort',
        key: 'treeSort',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.treeSort - b.treeSort,
        editable: true,
      },
    ];

    // 11
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    // 11
    const column = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    });

    const {selectedRows, areaModalVisible, action, selectRow, isRepetitive,treeNames,type} = this.state;
    const areaMethods = {
      buildTree:this.buildTree,
      handleCancel: this.handleCancel,
      handleOk: this.handleOk,
      buildTreeTest: this.buildTreeTest,
      checkCode: this.checkCode,
      onchange: this.onchange,
      loadData: this.loadData,
    };


    if (data !== undefined) {
      if (data.list !== undefined) {
        return (
          <PageHeaderWrapper title="部门管理">
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
                <div className={styles.tableListOperator}>
                  {/* 按钮 */}
                  <Button type="primary" onClick={e => this.showAreaModal(e, selectedRows.length === 1 ? '添加下级' : '新增部门')}>
                    {selectedRows.length === 1 ? '添加下级' : '新增'}
                  </Button>
                  <Button onClick={e => this.showAreaModal(e, '修改')} disabled={selectedRows.length !== 1}>
                    修改
                  </Button>
                  <Button onClick={this.remove} disabled={!selectedRows.length > 0}>
                    删除
                  </Button>

                  <AreaModal
                    {...areaMethods}
                    selectRow={selectRow}
                    areaModalVisible={areaModalVisible}
                    treeNames={treeNames}
                    type={type}
                    action={action}
                    isRepetitive={isRepetitive}
                    dataList={dataList}
                    dispatch={dispatch}
                  />
                </div>
              </div>
              <StandardTable
                rowKey="id"
                columns={column}
                components={components}
                selectedRows={selectedRows}
                data={this.buildTree(JSON.stringify(data.list), data.total)}
                onSelectRow={this.handleSelectRows}
              />
            </Card>
          </PageHeaderWrapper>
        );
      }
    }
    return null;
  }
}

export default Department;
