import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Table,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  Icon,
  DatePicker,
  Tooltip,
  Modal,
  Upload,
  message,
  Popover,

} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './FinanceList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
import moment from 'moment';

// const status = [
//   '已登记',
//   '待审核 ',
//   '审核不通过',
//   '实验中',
//   '报告制作',
//   '报告制作',
//   '签发中',
//   '报告打印',
//   '发放中',
//   '归档',
// ];
// const category = [
//   '亲子鉴定',
//   '文书鉴定',
//   '酒精鉴定',
//   '车辆痕迹鉴定',
//   '法医临床鉴定',
//   '法医病理鉴定',
// ];
const moneyStatus = ['已创建',
  '已汇款',
  '已退款'];

@Form.create()
class SearchForm extends PureComponent {


  handleSearch = e => {
    e.preventDefault();

    const { form, handleSearch } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        acceptDate: fieldsValue.acceptDate && fieldsValue.acceptDate.format('YYYY-MM-DD'),
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

  renderAdvancedSearchForm() {
    const {
      form: { getFieldDecorator },
      Category,
      toggleSearchForm,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.searchForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNo')(<Input placeholder="请输入案例编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="专业类别">
              {getFieldDecorator('caseCategoryId')(
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
              {getFieldDecorator('acceptDate')(<DatePicker style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="委托方">
              {getFieldDecorator('clientName')(<Input placeholder="请输入委托单位/人名称"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="案例状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear>
                  <Option value="0">已登记</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">审核不通过</Option>
                  <Option value="3">实验中</Option>
                  <Option value="4">报告制作</Option>
                  <Option value="5">报告校对</Option>
                  <Option value="6">签发中</Option>
                  <Option value="7">报告打印</Option>
                  <Option value="8">发放中</Option>
                  <Option value="9">归档</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={{ span: 24 }}>
            <div style={{ float: 'right', marginBottom: 24, paddingRight: 16 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={toggleSearchForm}>
                收起 <Icon type="up"/>
              </a>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleSearchForm() {
    const {
      form: { getFieldDecorator },
      toggleSearchForm,
      Category,
      remittanceState,
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.searchForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNo')(<Input placeholder="请输入案例编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="案例状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear>
                  <Option value={0}>已登记</Option>
                  <Option value={1}>待审核</Option>
                  <Option value={2}>审核不通过</Option>
                  <Option value={3}>实验中</Option>
                  <Option value={4}>报告制作</Option>
                  <Option value={5}>报告校对</Option>
                  <Option value={6}>签发中</Option>
                  <Option value={7}>报告打印</Option>
                  <Option value={8}>发放中</Option>
                  <Option value={9}>归档</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ float: 'right', marginBottom: 24, paddingRight: 16 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={toggleSearchForm}>
                展开 <Icon type="down"/>
              </a>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSearchForm() {
    const { expandSearchForm } = this.props;
    return expandSearchForm ? this.renderAdvancedSearchForm() : this.renderSimpleSearchForm();
  }

  render() {

    const { form, renderSearchForm, toggleSearchForm, renderAdvancedSearchForm, renderSimpleSearchForm, expandSearchForm } = this.props;

    return (
      <div>{this.renderSearchForm()}</div>
    );
  }
}

@Form.create()
class RefundModal extends PureComponent {
  onOk = () => {
    const { form: { validateFields }, refundOnOk, selectedRow } = this.props;
    validateFields((err, fieldsValue) => {
      const temp = {
        ...fieldsValue,
        status: 4,
        refundDate: new Date(),
        bizId: selectedRow.id,
      };

      if (err) return;
      this.setState(
        () => {
          refundOnOk(temp);
        },
      );
    });

  };

  onCancel = () => {
    const { refundOnCancel } = this.props;

    this.setState(
      () => {
        refundOnCancel();
      },
    )
    ;
  };

  check = (rule, value, callback) => {

    const { selectedRow } = this.props;

    if (!value) {
      callback('该项不可为空');
    }
    else {

      if (value > selectedRow.totalPrice)
        callback('该项不可大于已收金额');

      if (!(/^[0-9]+$/).test(value))
        callback('请输入数字');

      callback();
    }

  };

  irreversibleAmountOnchack(e) {
    const { irreversibleAmountOnchack } = this.props;
    const data = e.target.value;
    this.setState(
      () => {
        irreversibleAmountOnchack(data);
      },
    );
  }

  render() {

    const { form, refundForm, selectedRow } = this.props;

    return (
      <Modal
        title={'退款窗口'}
        visible={refundForm}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form layout="inline" className={styles.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>


            <Col md={23} sm={24}>
              <FormItem label={'已收金额'}>
                {form.getFieldDecorator('totalPrice', {
                  initialValue: selectedRow.totalPrice,
                })(<Input disabled addonAfter={'分'}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'不退金额'}>
                {form.getFieldDecorator('deduction', {
                  rules: [
                    {
                      validator: this.check,
                    },
                  ],
                  initialValue: 0,
                })(<Input onChange={(e) => this.irreversibleAmountOnchack(e)}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'退款金额'}>
                {form.getFieldDecorator('money', {
                  initialValue: selectedRow.totalPrice - selectedRow.deduction > 0 ? selectedRow.totalPrice - selectedRow.deduction : 0,
                })(<Input disabled/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={23} sm={24}>
              <FormItem label={'备注'}>
                {form.getFieldDecorator('remark', {})(<TextArea rows={3}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

@Form.create()
class ChargeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }

  // state = {
  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: [],
  // };
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = ({ fileList }) => this.setState({ fileList });
  onOk = () => {
    const { form: { validateFields, resetFields }, chargeOnOk, selectedRows, selectedRow, Category } = this.props;
    const { fileList } = this.state;
    const ids = selectedRows.map(item => item.id);
    let typesList = [];
    // for (let i in selectedRows) {
    //   const category = Category.filter(item => parseInt(item.id, 10) === parseInt(selectedRows[i].caseCategoryId, 10));
    //   typesList.push(category[0].value);
    //
    // }

    typesList.push('jcb_finance_remittance_bill');
    validateFields((err, fieldsValue) => {
      const temp = {
        ...fieldsValue,
        caseIds: ids,
        file: fileList[0],
        bizType: typesList,
      };

      if (err) return;
      resetFields();
      this.setState(
        () => {
          chargeOnOk(temp);
        },
      );
    });
  };

  onCancel = () => {
    const { chargeCancel } = this.props;

    this.setState(
      () => {
        chargeCancel();
      },
    )
    ;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { form: { getFieldDecorator }, ChargeForm, selectedRows, moneyStatus } = this.props;
    let money = 0;
    for (const i in selectedRows) {
      money += selectedRows[i].totalPrice;
    }
    const columns = [
      {
        title: '案例编号',
        align: 'center',
        dataIndex: 'caseNo',
      },
      {
        title: '专业类别',
        align: 'center',
        dataIndex: 'caseCategoryId',
        render(val) {
          return category[val];

        },
      },
      {
        title: '受理日期',
        align: 'center',
        dataIndex: 'acceptDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '委托方',
        align: 'center',
        dataIndex: 'clientName',
      },
      {
        title: '应收金额',
        align: 'center',
        dataIndex: 'totalPrice',
      },

    ];
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (info) => {
        this.setState(state => ({
          fileList: [info],
        }));
        return false;
      },
      onPreview: (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      },
      // // onChange: ({ fileList }) => {
      // //   this.setState({ fileList });
      // // },
      // fileList,
      listType: 'picture-card',
      accept: '.jpg, .jpeg, .png',
    };


    const props2 = {
      action: '//jsonplaceholder.typicode.com/posts/',
      listType: 'picture',
      className: 'upload-list-inline',
    };

    const data = [];
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    for (const i in selectedRows) {
      let dataTemp = {
        ...selectedRows[i],

      };
      data.push(dataTemp);
    }
    return (
      <Modal
        width="50%"
        title={'收费窗口'}
        visible={ChargeForm}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div>
          <Card title={'汇款登记'}>
            {/* <DatePicker onChange={onChange} />*/}
            <Form layout="inline" className={styles.searchForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <FormItem label={'汇款金额'}>
                    {getFieldDecorator('money', {
                      initialValue: money,
                      rules: [{ required: true, message: '请输入汇款金额！' }],
                    })(<Input disabled/>)}
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem label={'汇款日期'}>
                    {getFieldDecorator('remittanceDate', {
                      rules: [{ required: true, message: '请输入汇款日期！' }],
                    })(<DatePicker style={{ width: '100%' }} allowClear/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <FormItem label={'汇款账户'}>
                    {getFieldDecorator('remittanceAccount', {
                      rules: [{ required: true, message: '请填写！' }],
                      // initialValue: selectedRows[0].remittancesAccount,
                    })(<Input placeholder="请填写"/>)}
                  </FormItem>
                </Col>
                <Col md={12} sm={24}>
                  <FormItem label="收款账户">
                    {getFieldDecorator('beneficiaryAccount', {
                      rules: [{ required: true, message: '请填写！' }],
                      // initialValue: selectedRows[0].paymentAccount,
                    })(
                      <Input placeholder="请填写"/>,
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  <FormItem label={'汇款人'}>
                    {getFieldDecorator('remitter', {
                      rules: [{ required: true, message: '请填写！' }],
                      // initialValue: selectedRows[0].remitter,
                    })(<Input placeholder="请填写"/>)}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <FormItem label="凭证">
                    {getFieldDecorator('credentials', {
                      rules: [{ required: true, message: '请上传！' }],
                    })(
                      <Upload
                        {...props}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>,
                    )}
                  </FormItem>
                </Col>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage}/>
                </Modal>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24}>
                  <FormItem label={'备注'}>
                    {getFieldDecorator('remark', {
                      // initialValue: selectedRows[0].remark,
                    })(<TextArea rows={4}/>)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>

        <br/><br/><br/>

        <div>
          <Card title={'案例列表'}>
            <Table
              rowKey='id'
              columns={columns}
              pagination={false}
              dataSource={data}
            />
          </Card>
        </div>

      </Modal>

    );
  }
}

@connect(({ financeModel, casereview, Entrust, casedemo, loading }) => ({
  financeModel,
  casereview,
  Entrust,
  casedemo,
  loading: loading.models.financeModel,
}))
@Form.create()
class FinanceList extends PureComponent {

  state = {
    expandSearchForm: false,
    refundForm: false,
    ChargeForm: false,
    selectedRows: [],
    selectedRow: {},
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'financeModel/fetch',
      payload: formValues,
    });
    dispatch({
      type: 'casereview/fetch',
    });
    dispatch({
      type: 'financeModel/fetch2',
    });
    dispatch({
      type: 'casedemo/caseStates',
    });
    dispatch({
      type: 'Entrust/fetchCategorys',
    });
    dispatch({
      type: 'casereview/remittanceStates',
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
      selectedRow: rows[0],
    });
  };
  /*
   * 表格分页或自带排序或自带筛选时触发
   * @param pagination 分页信息
   * @param filtersArg 自带筛选信息
   * @param sorter 自带排序信息
   * */
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'financeModel/fetch',
      payload: params,
    });
  };

  chargeConfirm = () => {
    this.setState({
      ChargeForm: true,
    });
  };
  chargeOnOk = (fields) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('file', fields.file);
    formData.append('bizType', fields.bizType);
    formData.append('bizId', []);

    new Promise((resolve, reject) => {
      dispatch({
        type: 'AttachmentModal/add',
        payload: {
          formData,
          resolve,
          reject,
        },
      });
    }).then((caseUpload) => {
      if (caseUpload !== undefined) {
        let attachmentId;
        for (let i in caseUpload) {
          attachmentId = caseUpload[i].id;
        }
        dispatch({
          type: 'financeModel/add',
          payload: {
            money: fields.money,
            remittanceDate: fields.remittanceDate,
            remitter: fields.remitter,
            remittanceAccount: fields.remittanceAccount,
            beneficiaryAccount: fields.beneficiaryAccount,
            status: 1,
            caseIds: fields.caseIds,
            attachmentId: attachmentId,
            remark: fields.remark,
            // ...fields,
          },
        });
        dispatch({
          type: 'financeModel/fetch',
        });
        dispatch({
          type: 'casereview/fetch',
        });
        dispatch({
          type: 'financeModel/fetch2',
        });

      }
    });
    message.success('添加成功');
    this.chargeCancel();
    this.setState({ selectedRows: [] });
    this.handleFormReset();
  };
  chargeCancel = () => {
    this.setState({
      ChargeForm: false,
    });
  };

  refundModal = () => {
    const { refundConfirm } = this.state;
    this.setState({
      refundForm: true,
    });
  };
  /*退款成功*/
  refundOnOk = (fields) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financeModel/addRefund',
      payload: {
        ...fields,
      },
    });
    message.success('操作成功');
    this.setState({
      refundForm: false,
    });
    this.setState({ selectedRows: [] });
    // this.handleFormReset();
  };
  refundOnCancel = () => {
    const { refundForm } = this.state;
    this.setState({
      refundForm: false,
    });
  };

  handleSearch = values => {
    const { dispatch, form } = this.props;

    this.setState({
      formValues: values,
    });
    dispatch({
      type: 'financeModel/fetch',
      payload: values,
    });

  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;

    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'financeModel/fetch',
      // payload: {},
    });
    dispatch({
      type: 'financeModel/fetch',
      // payload: formValues,
    });
    dispatch({
      type: 'casereview/fetch',
    });
    dispatch({
      type: 'financeModel/fetch2',
    });
    dispatch({
      type: 'casedemo/caseStates',
    });
    dispatch({
      type: 'Entrust/fetchCategorys',
    });
    dispatch({
      type: 'casereview/remittanceStates',
    });


  };
  toggleSearchForm = () => {
    const { expandSearchForm } = this.state;
    this.setState({
      expandSearchForm: !expandSearchForm,
    });
  };

  irreversibleAmountOnchack = values => {
    const { selectedRow } = this.state;
    const data = selectedRow;
    this.setState({
      selectedRow: {
        ...data,
        deduction: values,
      },
    });
  };

  render() {
    const {
      financeModel: { data, ProfessionalTypes, BillBiz },
      casereview: { data1, remittanceState },
      casedemo: { caseState },
      Entrust: { Category },
      loading,
    } = this.props;
    if (data !== undefined) {
      if (data.list !== undefined) {
        if (data.list.length !== 0) {
          for (let i = 0; i < data.list.length; i += 1) {
            if (BillBiz.list !== undefined) {
              const charge = BillBiz.list.filter(item => item.bizIdString === data.list[i].id);
              data.list[i].remittanceBillIds = charge.length > 0 ? charge[0].remittanceBillIdString : 0;
            }
          }
        }
      }

    }
    if (data !== undefined) {
      if (data.list !== undefined) {
        if (data.list.length !== 0) {
          for (let i = 0; i < data.list.length; i += 1) {
            if (data1.list !== undefined) {
              const charge = data1.list.filter(item => item.idString === data.list[i].remittanceBillIds);
              data.list[i].statuss = charge.length > 0 ? charge[0].status : 0;
              data.list[i].remittanceDate = charge.length > 0 ? charge[0].remittanceDate : 0;
              data.list[i].reason = charge.length > 0 ? charge[0].reason : 0;
            }
          }
        }
      }

    }

    const { selectedRows, selectedRow, expandSearchForm, refundForm, ChargeForm } = this.state;
    const areaMethods = {
      toggleSearchForm: this.toggleSearchForm,
      handleSearch: this.handleSearch,
      handleFormReset: this.handleFormReset,
    };
    const refundMethods = {
      refundOnOk: this.refundOnOk,
      refundOnCancel: this.refundOnCancel,
      irreversibleAmountOnchack: this.irreversibleAmountOnchack,
    };
    const chargeMethods = {
      chargeOnOk: this.chargeOnOk,
      chargeCancel: this.chargeCancel,
    };

    const columns = [
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
      {
        title: '应收金额',
        dataIndex: 'totalPrice',
        align: 'center',
      },
      {
        title: '已收金额',
        dataIndex: 'receivedAmount',
        align: 'center',
        // needTotal: true,
        render: (val, record) => {
          if (record !== undefined) {
            if (record.statuss !== 0) {
              return record.totalPrice;
            } else {
              return;
            }
          }
        },

      },
      {
        title: '确认状态',
        dataIndex: 'statuss',
        align: 'center',
        render(val, record) {
          const state = remittanceState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
          const value = state.length > 0 ? state[0].value : val;
          if (val === 3 || val === 6) {
            return (
              <Popover content={`不通过原因：${record.reason}`} title={value} trigger="hover">
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
        title: '汇款日期',
        align: 'center',
        dataIndex: 'remittanceDate',
        render(val) {
          if (val === 0) {
            return;
          } else {
            return <span>{moment(val).format('YYYY-MM-DD')}</span>;
          }
        },
      },
    ];
    return (
      <PageHeaderWrapper title="财务列表">
        <Card bordered={false}>

          <SearchForm
            remittanceState={remittanceState}
            {...areaMethods}
            expandSearchForm={expandSearchForm}
            Category={Category}
          />

          {selectedRows && selectedRows.length != 0 ? (
            <RefundModal
              {...refundMethods}
              refundForm={refundForm}
              selectedRow={selectedRow}
            />
          ) : null}

          {selectedRows && selectedRows.length != 0 ? (
            <ChargeModal
              {...chargeMethods}
              selectedRows={selectedRows}
              selectedRow={selectedRow}
              ChargeForm={ChargeForm}
              Category={Category}
              moneyStatus={moneyStatus}
            />
          ) : null}

          <div className={styles.tableListOperator}>
            <Button type="primary" disabled={!selectedRows.length > 0 || selectedRow.statuss > 0}
                    onClick={this.chargeConfirm}>收费确认</Button>

            <Button type="danger"
                    disabled={selectedRows.length !== 1 || selectedRows.filter(item => parseInt(item.statuss, 10) !== 2).length > 0}
                    onClick={this.refundModal}>退款</Button>

            <Tooltip placement="top" title="将导出列表中展现的所有数据">
              <Button icon="file-excel">导出</Button>
            </Tooltip>

          </div>

          <StandardTable
            rowKey="id"
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
            onSelectRow={this.handleSelectRows}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}

export default FinanceList;
