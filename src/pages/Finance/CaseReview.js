import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  Modal,
  message,
  Badge,
  Steps,
  Radio,
  Popover,
  Table,
} from 'antd';
import Link from 'umi/link';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CaseReview.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const confirms = Modal.confirm;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class AuditFalseModal extends PureComponent {
  state = {
    caseList: [],
  };
  onOk = () => {
    const { form: { validateFields }, handleModal2Ok, selectedRows } = this.props;
    const ids = selectedRows.map(item => item.idString);
    const caseList = [];
    validateFields((err, fieldsValue) => {
      for (var i in ids) {
        const temp = {
          id: ids[i],
          reason: fieldsValue.reason,
          status: 3,
        };
        caseList.push(temp);
      }

      if (err) return;
      this.setState(
        () => {
          handleModal2Ok(caseList);
        },
      );
    });
  };

  onCancel = () => {
    const { auditeModalonCancel } = this.props;

    this.setState(
      () => {
        auditeModalonCancel();
      },
    );
  };

  render() {
    const { form: { getFieldDecorator }, AddModalVisable, selectedRows } = this.props;
    const ids = selectedRows.map(item => item.idString);
    return (
      <Modal
        title={`审核不通过原因：`}
        visible={AddModalVisable}
        width={700}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >

        <FormItem key="remark">
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: '请输入不通过原因！' }],

          })(
            <TextArea autosize={{ minRows: 4, maxRows: 8 }}/>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ casereview, Entrust, casedemo,loading }) => ({
  casereview,
  Entrust,
  casedemo,
  loading: loading.models.casereview,
}))

@Form.create()
class CaseAudit extends PureComponent {
  state = {
    modal1Visible: false,
    AddModalVisable: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    visible: false,
    stepDirection: 'horizontal',
    caseList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'casereview/fetch',
    });
    dispatch({
      type: 'casereview/remittanceStates',
    });
    dispatch({
      type: 'Entrust/fetchCategorys',
    });
    dispatch({
      type: 'casereview/getcaseDatas',
      payload: {},
    });
    dispatch({
      type: 'casedemo/caseStates',
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
      type: 'casereview/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'casereview/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        remittanceDate: fieldsValue.remittanceDate && fieldsValue.remittanceDate.format('YYYY-MM-DD'),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'casereview/fetch',
        payload: values,
      });
    });
  };

  handleDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    switch (e.key) {
      case '':
        break;
      default:
        dispatch({
          type: 'casereview/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
    }
    message.success('废除成功');
    this.handleModalVisible();
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleAudit = () => {
    this.setState({
      AddModalVisable: true,
    });
  };

  auditModalonOk = () => {
    this.setState({
      AddModalVisable: false,
    });
  };

  auditeModalonCancel = () => {
    this.setState({
      AddModalVisable: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  remove = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const conte = '您将删除汇款单号为   ';
    const conten = '    的数据！';
    const rowlengtn = selectedRows.map(row => row.length);
    const ids = selectedRows.map(row => row.idString);
    const contents = conte + ids + rowlengtn + conten;
    const self = this;
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'casereview/remove',
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

  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows, caseList } = this.state;
    const conte = '您将审核通过实验编号为   ';
    const conten = '    的数据！';
    const rowlengtn = selectedRows.map(row => row.length);
    const ids = selectedRows.map(item => item.idString);
    const contents = conte + ids + rowlengtn + conten;
    const self = this;
    if (!selectedRows) return;
    for (var i in ids) {
      const item = {
        id: ids[i],
        status: 2,
      };
      caseList.push(item);
    }
    confirms({
      title: '确定要审核通过吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'casereview/update',
          payload: caseList,
        });
        message.success('审核成功');
        self.setState({ selectedRows: [] });
        self.handleFormReset();
      },
      onCancel() {
      },
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'casereview/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };
  /*更新*/
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'casereview/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  /*审核不通过*/
  handleModal2Ok = (fields) => {

    const { dispatch } = this.props;
    dispatch({
      type: 'casereview/updateReasons',
      payload: fields,
    });
    message.success('操作成功');
    this.auditModalonOk();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      casereview: { remittanceState },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="汇款单号">
              {getFieldDecorator('id')(<Input placeholder="请输入汇款单号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="汇款状态">
              {getFieldDecorator('status')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  {remittanceState.map(item => (
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      casereview: { remittanceState },
      Entrust: { Category },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="汇款单号">
              {getFieldDecorator('id')(<Input placeholder="请输入汇款单号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="汇款状态">
              {getFieldDecorator('status')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  {remittanceState.map(item => (
                    <Option key={item.id} value={item.id}>{item.value}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="汇款日期">
              {getFieldDecorator('remittanceDate')(<DatePicker style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="汇款人" style={{ marginLeft: 12 }}>
              {getFieldDecorator('remitter')(<Input placeholder="请输入汇款人"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="汇款账户">
              {getFieldDecorator('remittanceAccount')(<Input placeholder="请输入汇款账户"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收款账户">
              {getFieldDecorator('beneficiaryAccount')(<Input placeholder="请输入收款账户"/>)}
            </FormItem>
          </Col>
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
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    const {
      form: { getFieldDecorator },
      casereview: { data1, remittanceState, caseinfos, attachmentList },
      casedemo: { caseState },
      loading,
      Entrust: { Category },
    } = this.props;
    /*点击展开图标时触发*/
    const onExpand = (expanded, record) => {
      const { dispatch } = this.props;
      if (expanded == true) {
        dispatch({
          type: 'casereview/caseDatas',
          payload: {
            remittanceBillId: record.idString,
          },
        });
      }
    };

    const {
      visible,
      selectedRows,
      updateModalVisible,
      stepFormValues,
      AddModalVisable,
    } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const AuditMethods = {
      auditModalonOk: this.auditModalonOk,
      auditeModalonCancel: this.auditeModalonCancel,
      handleModal2Ok: this.handleModal2Ok,
    };
    const showModal1 = (record) => {
      this.setState({
        visible: true,
      });
      filePath(record);
    };
    const filePath = (record) => {
      const { dispatch } = this.props;
      new Promise((resolve, reject) => {
        dispatch({
          type: 'casereview/fileDatas',
          payload: {
            remittanceBillId: record.idString,
            resolve,
            reject,
          },
        });
      }).then((fileInfo) => {
        if (fileInfo !== undefined) {
          let attachmentId;
          const ids = [];
          attachmentId = fileInfo[0].attachmentIdString;
          ids.push(attachmentId);
          dispatch({
            type: 'casereview/fileById',
            payload: ids,
          });
        }

      });

    };
    const handleCancel1 = () => {
      this.setState({ visible: false });
    };
    const columns = [
      {
        title: '汇款单号',
        dataIndex: 'idString',
        align: 'center',
      },
      {
        title: '汇款金额',
        dataIndex: 'money',
        align: 'center',
      },
      {
        title: '汇款日期',
        dataIndex: 'remittanceDate',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '汇款人',
        dataIndex: 'remitter',
        align: 'center',
      },
      {
        title: '汇款账号',
        dataIndex: 'remittanceAccount',
        align: 'center',
      },
      {
        title: '收款账号',
        dataIndex: 'beneficiaryAccount',
        align: 'center',
      },
      {
        title: '汇款状态',
        dataIndex: 'status',
        align: 'center',
        render(val, record) {
          const state = remittanceState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
          const value = state.length > 0 ? state[0].value : val;
          if (val === 3) {
            return (
              <Popover content={`不通过原因：${record.reason}`} title={value} trigger="hover">
                <a>{value}</a>
              </Popover>);
          } else {
            return value;
          }
        },
      },
      {
        title: '收款凭证',
        align: 'center',
        render(record) {


          return (
            <div>
              <a onClick={() => showModal1(record)}>
                查看凭证
              </a>
              <Modal
                visible={visible}
                onCancel={handleCancel1}
                footer={null}
              >
                <img alt="example" style={{ width: '100%' }}
                  // src={'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
                     src={attachmentList.length > 0 ? attachmentList[0].filePath : null}
                />
              </Modal>
            </div>
          );
        },

      },

      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
      },
    ];

    const expandedRowRender = (record) => {
      // const { casedemo: { caseState } } = this.props;
      let casesList = [];
      if (record.cases !== undefined) {
        casesList = record.cases;
      }

      const columns = [
        {
          title: '案例编号',
          dataIndex: 'caseNo',
        },
        {
          title: '案例编码',
          align: 'center',
          dataIndex: 'caseNo',
        },
        {
          title: '专业类别',
          dataIndex: 'caseCategoryId',
          align: 'center',
          render(val) {
            const category = Category.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            return category.length > 0 ? category[0].value : val;
          },
        },
        {
          title: '受理日期',
          dataIndex: 'acceptDate',
          align: 'center',
          render(val) {
            if (val !== null) {
              return <span>{moment(val).format('YYYY-MM-DD')}</span>;
            }
            return val;
          },

        },
        {
          title: '委托方',
          align: 'center',
          dataIndex: 'clientName',
        },
        {
          title: '案例状态',
          dataIndex: 'status',
          align: 'center',
          render(val) {
            const state = caseState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
            const value = state.length > 0 ? state[0].value : val;
            return value;
          },
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={casesList}
          pagination={false}
        />
      );
    };
    return (
      <PageHeaderWrapper title="案例审核">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
                <span>
                  <Button onClick={this.showConfirms}
                          type="primary"
                          disabled={selectedRows.length === 0 || selectedRows.filter(item => parseInt(item.status, 10) === 3).length > 0}>审核通过</Button>
                  <Button onClick={() => this.handleAudit()}
                          type="danger"
                          disabled={selectedRows.length === 0 || selectedRows.filter(item => item.status === 2).length > 0}>审核不通过</Button>
                  <Button onClick={this.remove}
                          type="danger"
                          disabled={selectedRows.length === 0}>删除</Button>
                </span>
            </div>

            <StandardTable
              rowKey="idString"
              selectedRows={selectedRows}
              loading={loading}
              data={data1}
              columns={columns}
              expandedRowRender={expandedRowRender}
              onSelectRow={this.handleSelectRows}
              onExpand={onExpand}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}

        <AuditFalseModal
          {...AuditMethods}
          AddModalVisable={AddModalVisable}
          selectedRows={selectedRows}
        />
      </PageHeaderWrapper>
    );
  }
}

export default CaseAudit;
