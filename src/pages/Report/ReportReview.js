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
  DatePicker,
  Modal,
  message,
  Popover,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './ReportList.less';

const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const confirms = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const content = (
  <div>
    <p>不通过原因：数据标本不完整，无法进行检测</p>
  </div>
);

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
          status: 2,
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

@connect(({ reportRevData, Entrust, loading }) => ({
  reportRevData,
  Entrust,
  loading: loading.models.reportRevData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modal1Visible: false,
    updateModalVisible: false,
    AddModalVisable: false,
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
      type: 'reportRevData/fetch',
    });
    dispatch({
      type: 'reportRevData/caseStates',
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
      type: 'reportRevData/fetch',
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
      type: 'reportRevData/fetch',
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
        // proceTime:fieldsValue.proceTime && fieldsValue.proceTime.format('YYYY-MM-DD'),
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'reportRevData/fetch',
        payload: values,
      });
    });
  };

  handleDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case '':
        break;
      default:
        dispatch({
          type: 'reportRevData/remove',
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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  /*跳转*/
  handJump = (record) => {
    router.push({
      pathname: '/case/advanced',
      state: { caseNumber: record.caseNumber },
    });

  };
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  /*审核通过*/
  showConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows, caseList } = this.state;
    const conte = '您将审核通过案例编号为   ';
    const conten = '    的数据！';
    const rowlengtn = selectedRows.map(row => row.length);
    const caseNos = selectedRows.map(item => item.caseNo);
    const ids = selectedRows.map(item => item.idString);
    const contents = conte + caseNos + rowlengtn + conten;
    const self = this;
    if (!selectedRows) return;
    for (let i in ids) {
      caseList.push(ids[i]);
    }
    confirms({
      title: '确定通过案例吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'reportData/updateStatusValue',
          payload: { ids: caseList, status: 3 },
        });
        message.success('提交成功');
        self.setState({ selectedRows: [] });
        self.handleFormReset();
      },
      onCancel() {
      },
    });
  };
  /*审核不通过*/
  handleAudit = () => {
    this.setState({
      AddModalVisable: true,
    });
  };

  handleModal2Ok = (fields) => {

    const { dispatch } = this.props;
    // dispatch({
    //   type: 'RefundModal/updateReasons',
    //   payload: fields,
    // });
    message.success('操作成功');
    this.auditModalonOk();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
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
  /*签发*/
  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows, caseList } = this.state;
    const conte = '您将签发编号为   ';
    const conten = '    的数据！';
    const rowCaseNumber = selectedRows.map(row => row.caseNo);
    const contents = conte + rowCaseNumber + conten;
    const ids = selectedRows.map(item => item.idString);
    const self = this;
    if (!selectedRows) return;
    for (let i in ids) {
      caseList.push(ids[i]);
    }
    confirms({
      title: '确定要签发吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'reportData/updateStatusValue',
          payload: {
            ids: caseList,
            status: 12,
          },
        });
        message.success('签发成功');
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


  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportRevData/updateStatusValue',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      Entrust: { Category },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNumber')(<Input placeholder="请输入案例编号"/>)}
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
      reportRevData: { caseState },
      Entrust: { Category },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNumber')(<Input placeholder="请输入案例编号"/>)}
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
            <FormItem label="受理日期">
              {getFieldDecorator('proceTime')(<DatePicker style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="委托人" style={{ paddingLeft: 12 }}>
              {getFieldDecorator('delegate')(<Input placeholder="请输入委托人姓名"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系方式">
              {getFieldDecorator('Rcontact')(<Input placeholder="请输入联系人电话"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报告状态">
              {getFieldDecorator('Status')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  {caseState.map(item => (
                    <Option key={item.id} value={item.id}>{item.value}</Option>
                  ))}
                </Select>,
              )}
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
      reportRevData: { data, caseState },
      loading,
      Entrust: { Category },
    } = this.props;
    const {
      selectedRows,
      updateModalVisible,
      stepFormValues,
      visible,
      AddModalVisable,
    } = this.state;

    const rowCaseNumber = selectedRows.map(row => row.caseNumber);

    const AuditMethods = {
      auditModalonOk: this.auditModalonOk,
      auditeModalonCancel: this.auditeModalonCancel,
      handleModal2Ok: this.handleModal2Ok,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const columns = [
      {
        title: '案例编号',
        dataIndex: 'caseNo',
        align: 'center',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handJump(record)}>{record.caseNo}</a>
          </Fragment>
        ),
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
        dataIndex: 'entrustDate',
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
        dataIndex: 'clientName',
        align: 'center',
      },

      {
        title: '报告状态',
        dataIndex: 'status',
        align: 'center',
        render(val) {
          const state = caseState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
          const value = state.length > 0 ? state[0].value : val;
          if (val === 2) {
            return (
              <Popover content={content} title={value} trigger="hover">
                <a>{value}</a>
              </Popover>);
          } else {
            return value;
          }
        },
      },

      {
        title: '金额',
        dataIndex: 'totalPrice',
        align: 'center',
      },

    ];
    return (
      <PageHeaderWrapper title="报告审核">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button onClick={this.showConfirm}
                      type="primary"
                      disabled={selectedRows.length === 0}>审核通过</Button>
              <Button onClick={() => this.handleAudit()}
                      type="danger"
                      disabled={selectedRows.length === 0}>审核不通过</Button>
              <Button onClick={this.showConfirms}
                      type="primary"
                      disabled={selectedRows.length === 0}>签发</Button>
            </div>
            <Modal
              width={700}
              title={`编号为: ${rowCaseNumber} 的鉴定材料详情`}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <Card bordered={false}>
                <DescriptionList size="large" title="鉴定材料" style={{ marginBottom: 32 }}>
                  <Description term="送检材料名称">指纹</Description>
                  <Description term="类型">样本</Description>
                  <Description term="数量">2</Description>
                  <Description term="规格">份</Description>
                  <Description term="接收时间">2018-11-1</Description>
                  <Description term="材料性质">原件</Description>
                  <Description term="处理方式">存档</Description>
                  <Description term="备注">这是一条备注</Description>
                  <Description term="文件">这是一个文件</Description>
                </DescriptionList>
              </Card>
            </Modal>
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

export default TableList;
