import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Form,
  Row,
  Radio,
  Col,
  Input,
  Select,
  Card,
  Button,
  Modal,
  Table,
  Cascader,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './District.less';

const {TextArea} = Input;
const RadioGroup = Radio.Group;
const confirms = Modal.confirm;
const FormItem = Form.Item;
const {Option} = Select;

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

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = (e) => {
    const {editing} = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({...record, ...values});
    });
  };

  render() {
    const {editing} = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
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
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
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
class RenderSimpleSearchForm extends PureComponent {
  selectDistrict = () => {
    const {form, handleSearch} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        code: fieldsValue.select_code,
        name: fieldsValue.select_name,
      };

      this.setState(() => {
        handleSearch(values);
      });
    });
  };

  handleFormReset = () => {
    const {form, handleFormReset} = this.props;
    form.resetFields();
    this.setState(() => {
      handleFormReset();
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
    } = this.props;

    return (
      <Form layout="inline" className={styles.searchForm}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="区域代码">
              {getFieldDecorator('select_code')(<Input placeholder="请输入区域代码"/>)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="区域名称">
              {getFieldDecorator('select_name')(<Input placeholder="请输入区域名称"/>)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <div style={{float: 'right', marginBottom: 24, paddingRight: 16}}>
              <Button type="primary" onClick={this.selectDistrict}>
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
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

  loadData = selectedOptions => {
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

        if (data.length !== 0 && action !== '修改')
          callback("该地区编码已存在");

      } else {
        callback("该项不可为空")
      }
      callback();
    });
  };

  render() {
    const {form, areaModalVisible, action, selectRow, data} = this.props;

    const {buildTreeTest} = this.props;

    const temp = [];

    for (const i in data) {
      if (data[i].type !== 3) {
        temp.push(data[i])
      }
    }

    for (const i in temp) {

      if (temp[i].type !== 2) {
        temp[i].key = temp[i].code;
        temp[i].isLeaf = !temp[i].treeLeaf;
      }
    }

    const opt = buildTreeTest(JSON.stringify(temp));


    return (
      <Modal
        changeOnSelect
        title={action + '地区信息'}
        visible={areaModalVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form layout="inline" className={styles.searchForm}>
          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label={'上级区域'}>
                {form.getFieldDecorator('selectTreeNames', {
                  initialValue: selectRow.selectTreeNames,
                })(
                  <Cascader
                    options={opt}
                    changeOnSelect
                    fieldNames={{label: 'name', value: 'code', children: 'children'}}
                    disabled={selectRow.isEdit !== 1 ? false : true}
                    onChange={this.onchange}
                    loadData={this.loadData}
                    placeholder={'上级区域'}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              {form.getFieldDecorator('isEdit', {
                initialValue: selectRow.isEdit === 1 ? true : false,
              })(<Input type='hidden' />)}

              {form.getFieldDecorator('parentCode', {
                initialValue: selectRow.parentCode,
              })(<Input type='hidden' />)}
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label="区划代码">
                {form.getFieldDecorator('code', {
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                  initialValue: selectRow.code,
                  rules: [
                    {
                      validator: this.check
                    },
                  ],
                })(
                  <Input
                    disabled={selectRow.isEdit === 1 ? true : false}
                    placeholder="行政区划代码"
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label="区域名称">
                {form.getFieldDecorator('name', {
                  initialValue: selectRow.name,
                  rules: [
                    {
                      required: true,
                      message: '该项不可为空'
                    },
                  ],
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label="区域类型">
                {form.getFieldDecorator('type', {
                  initialValue: selectRow.type,
                })(
                  <RadioGroup disabled placeholder="请选择" style={{width: '100%'}} allowClear>
                    <Radio key={1} value={1}>
                      省
                    </Radio>
                    <Radio key={2} value={2}>
                      市
                    </Radio>
                    <Radio key={3} value={3}>
                      区
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label="排序号">
                {form.getFieldDecorator('treeSort', {
                  initialValue: selectRow.treeSort,
                  rules: [
                    {
                      required: true,
                      message: '该项不可为空'
                    },
                  ],
                })(<Input placeholder="请输入名称"/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{md: 8, lg: 24, xl: 48}}>
            <Col md={23} sm={24}>
              <FormItem label="区域备注">
                {form.getFieldDecorator('remark', {
                  initialValue: selectRow.remark,
                })(<TextArea rows={4} placeholder="请输入备注"/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

}

@connect(({DistrictModel, loading}) => ({
  DistrictModel,
  loading: loading.models.DistrictModel,
}))
@Form.create()
class District extends PureComponent {
  state = {
    selectRow: {},
    selectedRows: [],
    formValues: {},
    areaModalVisible: false,
    action: '',
    isRepetitive: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'DistrictModel/getDistrict',
      payload: {
        parentCode: 0
      },
    });
  }

  handleSearch = values => {
    const {dispatch} = this.props;

    const data = {
      code: values.code === '' ? undefined : values.code,
      name: values.name === '' ? undefined : values.name
    };

    if (data.code === undefined && data.name === undefined) {
      dispatch({
        type: 'DistrictModel/getDistrict',
        payload: {
          parentCode: 0
        },
      });
    } else {
      dispatch({
        type: 'DistrictModel/getDistrict',
        payload: data
      });
    }

  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'DistrictModel/getDistrict',
      payload: {
        parentCode: 0
      },
    });
    this.setState({
      formValues: {},
    });
  };

  showAreaModal = (e, act) => {
    const {selectedRows} = this.state;

    if (act === '修改') {
      const treeNames = selectedRows[0].treeNames.split('/');
      treeNames.pop();

      const selectTreeNames = selectedRows[0].parentCodes.split(',');
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
      const firstRow = {
        selectTreeNames: temp,
        treeNames: selectedRows[0].treeNames,
        type: selectedRows[0].type + 1,
        parentCode: selectedRows[0].code,
      };
      this.setState({
        selectRow: firstRow,
      });
    }

    if (act === '新增省级') {
      const firstRow = {
        type: 1,
      };
      this.setState({
        selectRow: firstRow,
      });
    }

    this.setState({
      areaModalVisible: true,
    });
  };

  handleOk = values => {
    const {dispatch} = this.props;

    if (values.isEdit) {
      dispatch({
        type: 'DistrictModel/updateDistrictByCode',
        payload: {
          ...values
        },
      });
    } else {
      dispatch({
        type: 'DistrictModel/addDistrict',
        payload: {
          ...values
        }
      });
    }

    this.setState({
      selectRow: {},
      areaModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      areaModalVisible: false,
      selectRow: [],
    });
  };

  remove = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (selectedRows[0].treeLeaf !== false) {
      const name = selectedRows[0].name;
      confirms({
        title: name + '下有其他地区，不可直接删除',
        onOk() {
        },
        onCancel() {
        },
      });
    } else {
      confirms({
        title: '确定删除该区域?',
        onOk() {
          const codes = selectedRows.map(item => item.code);
          dispatch({
            type: 'DistrictModel/removeBatch',
            payload: codes,
          });
          message.success('删除成功');
        },
        onCancel() {
        },
      });
    }
  };

  forceDelete = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    const codes = selectedRows.map(item => item.code);
    confirms({
      title: '确定要删除该区域及其下级区域?',
      onOk() {
        dispatch({
          type: 'DistrictModel/forceDelete',
          payload: codes,
        });
        message.success('删除成功');
      },
      onCancel() {
      },
    });
  };

  onExpand = (expanded, record) => {
    const {dispatch} = this.props;

    //record.children.length===0
    if (expanded) {
      dispatch({
        type: 'DistrictModel/selectDistrictChilendByCode',
        payload: {
          parentCode: record.code,
        }
      });
    }
  };


  loadData = values => {
    const {dispatch} = this.props;
    if (values.type == 1) {
      dispatch({
        type: 'DistrictModel/selectDistrictChilendByCode',
        payload: {
          parentCode: values.code,
        }
      });
    }
  };

  onchange = value => {
    if (value == null) {
      this.setState({
        selectRow: {
          type: 1,
        },
      });
    } else {
      this.setState({
        selectRow: {
          type: value.type + 1,
          parentCode: value.code,
        },
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  buildTree=(data, total)=> {

    if (data == null) return;
    const temp1 = [...Array.from(new Set(JSON.parse(data)))];
    const temp = {};
    const tree = [];

    for (const i in temp1) {
      if (temp1[i].treeLeaf === true) {
        temp1[i].children = new Array();
      }
      temp[temp1[i].code] = temp1[i];
    }

    for (const i in temp) {
      if (temp[i].parentCode && temp[temp[i].parentCode]) {
        if (temp[temp[i].parentCode] !== null && !temp[temp[i].parentCode].children) {
          temp[temp[i].parentCode].children = new Array();
        }
        temp[temp[i].parentCode].children.push(temp[i]);
      } else {
        tree.push(temp[i]);
      }
    }

    const result = {
      list: tree,
      total: total
    };
    return result;
  }

  buildTreeTest=(list)=> {
    if (list == null) return;
    const temp1 = [...Array.from(new Set(JSON.parse(list)))];
    const temp = {};
    const tree = [];

    for (const i in temp1) {
      temp[temp1[i].code] = temp1[i];
    }

    for (const i in temp) {
      if (temp[i].parentCode && temp[temp[i].parentCode]) {
        if (temp[temp[i].parentCode] !== null && !temp[temp[i].parentCode].children) {
          temp[temp[i].parentCode].children = new Array();
        }
        temp[temp[i].parentCode].children.push(temp[i]);
      } else {
        tree.push(temp[i]);
      }
    }
    return tree;
  }

  render() {
    const {
      DistrictModel: {data},
      dispatch
    } = this.props;
    const {selectedRows, areaModalVisible, action, selectRow, isRepetitive} = this.state;

    console.log(data);

    const type = [
      {
        dataIndex: 1,
        title: '省',
      },
      {
        dataIndex: 2,
        title: '市',
      },
      {
        dataIndex: 3,
        title: '区',
      },
    ];
    const columns = [
      {
        title: '行政区划代码',
        dataIndex: 'code',
        key: 'code',
        width: '20%',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '区域类型',
        dataIndex: 'type',
        key: 'type',
        render(val) {
          return type[val - 1].title;
        },
      },
      {
        title: '排序号',
        dataIndex: 'treeSort',
        key: 'treeSort',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.treeSort - b.treeSort,
        width: '15%',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows: selectedRows,
        });
      },
    };
    const updateMethods = {
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
    };
    const areaMethods = {
      handleCancel: this.handleCancel,
      handleOk: this.handleOk,
      buildTreeTest: this.buildTreeTest,
      checkCode: this.checkCode,
      onchange: this.onchange,
      loadData: this.loadData,
    };
    const handleSave = (row) => {
      const {dispatch} = this.props;
      dispatch({
        type: 'DistrictModel/updateDistrictByCode',
        payload: {
          ...row
        }
      });
      console.log("row", row)
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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
          handleSave: handleSave,
        }),
      };
    });

    return (
      <PageHeaderWrapper>
        <Card>
          <RenderSimpleSearchForm {...updateMethods} />

          <div className={styles.tableListOperator}>
            <Button type="primary" disabled={selectedRows.length === 1 && selectedRows[0].type === 3 ? true : false}
                    onClick={e => this.showAreaModal(e, selectedRows.length === 1 ? '添加下级' : '新增省级')}>{selectedRows.length === 1 ? '添加下级' : '新增'}</Button>

            <Button disabled={selectedRows.length === 1 ? false : true} onClick={e => this.showAreaModal(e, '修改')}>修改</Button>

            <Button disabled={selectedRows.length > 0 ? false : true} onClick={this.remove}>删除</Button>

            <Button type="danger" disabled={selectedRows.length > 0 ? false : true}
                    onClick={this.forceDelete}>强制删除</Button>

            {data && data.list.length !== 0 ? (
              <AreaModal
                {...areaMethods}
                selectRow={selectRow}
                areaModalVisible={areaModalVisible}
                action={action}
                isRepetitive={isRepetitive}
                data={data.list}
                dispatch={dispatch}
              />
            ) : null}

          </div>

          {data && data.list.length !== 0 ? (
            <StandardTable
              rowKey="code"
              components={components}
              selectedRows={selectedRows}
              onExpand={(expanded, record) => this.onExpand(expanded, record)}
              data={this.buildTree(JSON.stringify(data.list), data.total)}
              columns={column}
              onSelectRow={this.handleSelectRows}
            />
          ) : null}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default District;
