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
  DatePicker,
  message,
  Tooltip,
  Icon,
  Divider,
  Popover,
} from 'antd';
import styles from './FinanceList.less';
import { connect } from 'dva';
import moment from 'moment';

const { TextArea } = Input;
const confirms = Modal.confirm;
const FormItem = Form.Item;

@Form.create()
class AuditFalseModal extends PureComponent {
  state = {
    caseList: [],
  };
  onOk = () => {
    const { form: { validateFields }, handleModal2Ok, selectedRows } = this.props;
    const ids = selectedRows.map(item => item.idString);
    const caseList = [];
    const caseId = selectedRows.map(item => item.financeRefundBillBizEntity.bizIdString);
    validateFields((err, fieldsValue) => {
      for (let i in ids) {
        const temp = {
          id: ids[i],
          reason: fieldsValue.reason,
          status: 6,
          bizId: caseId[i],
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
        refundDate: fieldsValue.refundDate && fieldsValue.refundDate.format('YYYY-MM-DD'),
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
      remittanceState,
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.searchForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="退款单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入退款单号"/>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="退款状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear>
                  {remittanceState.map(item => (
                    <Option key={item.id} value={item.id}>{item.value}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="退款时间">
              {getFieldDecorator('refundDate')(
                <DatePicker style={{ width: '100%' }}/>,
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

@connect(({ RefundModal, casereview, loading }) => ({
  RefundModal,
  casereview,
  loading: loading.models.RefundModal,
}))
@Form.create()
class RefundList extends PureComponent {
  state = {
    selectedRow: {},
    selectedRows: [],
    NoteModalVisable: false,
    AddModalVisable: false,
    formValues: {},
    stepFormValues: {},
    modalVisible: false,
    caseList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'RefundModal/fetch',
      payload: {},
    });
    dispatch({
      type: 'RefundModal/getCaseInfos',
    });
    dispatch({
      type: 'casereview/remittanceStates',
    });
  }

  /*重置*/
  handleFormReset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RefundModal/fetch',
      payload: {},
    });
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
      type: 'RefundModal/fetch',
      payload: params,
    });
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
      selectedRow: rows[0],
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
    const rebbids = selectedRows.map(item => item.financeRefundBillBizEntity.idString);
    const self = this;
    confirms({
      title: '确定要删除数据吗?',
      onOk() {
        dispatch({
          type: 'RefundModal/remove',
          payload: {
            ids: ids,
            rebbids: rebbids,
          },
        });
        message.success('删除成功');
        self.setState({ selectedRows: [] });
        self.handleFormReset();
      },
      onCancel() {
      },
    });
  };

  handleAudit = () => {
    this.setState({
      AddModalVisable: true,
    });
  };

  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows, caseList, selectedRow } = this.state;
    const conte = '您将审核通过编号为   ';
    const conten = '    的数据！';
    const rowlengtn = selectedRows.map(row => row.length);
    const ids = selectedRows.map(item => item.idString);
    const remibillId = selectedRows.map(item => item.remittanceBillEntity.idString);
    const contents = conte + ids + rowlengtn + conten;
    const self = this;
    if (!selectedRows) return;
    for (let i in ids) {
      const item = {
        id: ids[i],
        status: 5,
        bizId: remibillId[i],
      };
      caseList.push(item);
    }
    confirms({
      title: '确定要审核通过吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'RefundModal/update',
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
  /*修改*/
  handleUpdate = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RefundModal/update',
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
  /*审核不通过*/
  handleModal2Ok = (fields) => {

    const { dispatch } = this.props;
    dispatch({
      type: 'RefundModal/updateReasons',
      payload: fields,
    });
    message.success('操作成功');
    this.auditModalonOk();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
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
      type: 'RefundModal/fetch',
      payload: { ...values },
    });

  };


  render() {

    const {
      RefundModal: { data, CaseInfos },
      casereview: { remittanceState },
      loading,
    } = this.props;
    console.log(data);
    const { selectedRows, AddModalVisable, selectedRow } = this.state;

    if (data !== undefined) {
      if (data.list !== undefined) {
        if (data.list.length !== 0) {
          for (let i = 0; i < data.list.length; i += 1) {
            if (CaseInfos !== undefined && CaseInfos.list !== undefined) {
              const charge = CaseInfos.list.filter(item => item.id === data.list[i].financeRefundBillBizEntity.bizIdString);
              data.list[i].caseNo = charge.length > 0 ? charge[0].caseNo : 0;
            }
          }
        }
      }

    }
    const columns = [
      {
        title: '退款单号',
        dataIndex: 'idString',
        align: 'center',
      },
      {
        title: '案例编号',
        dataIndex: 'caseNo',
        align: 'center',
      },
      {
        title: '退款金额',
        dataIndex: 'money',
        align: 'center',
      },
      {
        title: '不退金额',
        dataIndex: 'deduction',
        align: 'center',
      },
      {
        title: '退款时间',
        dataIndex: 'refundDate',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '退款状态',
        dataIndex: 'status',
        align: 'center',
        render(val, record) {
          const state = remittanceState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
          const value = state.length > 0 ? state[0].value : val;
          if (val === 6) {
            return (
              <Popover content={`不通过原因：${record.remittanceBillEntity.reason}`} title={value} trigger="hover">
                <a>{value}</a>
              </Popover>);

          } else if (val === 0) {
            return;
          } else {
            return value;
          }
        },
      },
      {
        title: '备注',
        // dataIndex:'money',
        dataIndex: 'remark',
        align: 'center',
      },

    ];
    const AuditMethods = {
      auditModalonOk: this.auditModalonOk,
      auditeModalonCancel: this.auditeModalonCancel,
      handleModal2Ok: this.handleModal2Ok,
    };
    const SearchMethods = {
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
    };

    return (
      <PageHeaderWrapper title="退款管理">
        <Card bordered={false}>
          <SearchForm
            remittanceState={remittanceState}
            {...SearchMethods}
          />
          <div className={styles.tableList}>

            <div className={styles.tableListOperator}>
                <span>
                  <Button onClick={this.showConfirms}
                          type="primary"
                          disabled={selectedRows.length === 0 || selectedRows.filter(item => parseInt(item.status, 10) === 5).length > 0}>审核通过</Button>
                  <Button onClick={() => this.handleAudit()}
                          type="danger"
                          disabled={selectedRows.length === 0 || selectedRows.filter(item => item.status === 6).length > 0}>审核不通过</Button>
                  <Button onClick={this.remove}
                          type="danger"
                          disabled={selectedRows.length === 0}>删除</Button>
                </span>
            </div>

            <StandardTable
              rowKey="idString"
              selectedRows={selectedRows}
              selectedRow={selectedRow}
              columns={columns}
              data={data}
              loading={loading}
              onChange={this.handleStandardTableChange}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
        <AuditFalseModal
          {...AuditMethods}
          AddModalVisable={AddModalVisable}
          selectedRows={selectedRows}
        />
      </PageHeaderWrapper>
    );
  }
}

export default RefundList;
