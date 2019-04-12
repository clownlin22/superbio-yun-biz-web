import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Tooltip,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Modal,
  message,
  Badge,
  Steps,
  Popover,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CaseList.less';

const {Description} = DescriptionList;
const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const confirms = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const popoverContent = (
  <div style={{width: 160}}>
    吴加号
    <span className={styles.textSecondary} style={{float: 'right'}}>
      <Badge status="default" text={<span style={{color: 'rgba(0, 0, 0, 0.45)'}}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{marginTop: 4}}>
      耗时：2小时25分钟
    </div>
  </div>
);
const customDot = (dot, {status}) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );
const content = (
  <div>
    <p>不通过原因：数据标本不完整，无法进行检测</p>
  </div>
);

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
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  render() {
    const {form, updateModalVisible, handleUpdateModalVisible} = this.props;
    const {currentStep, formVals} = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{padding: '32px 40px 48px'}}
        destroyOnClose
        title="审核不通过原因"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24}>
            <Form.Item>
              {form.getFieldDecorator('Reasons', {
                rules: [{required: false, message: '请写入原因'}],
                initialValue: '这是审核不通过的原因',
              })(<TextArea disabled autosize={{minRows: 4, maxRows: 8}} />)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({casedemo,caseform, Entrust, loading}) => ({
  casedemo,
  caseform,
  Entrust,
  loading: loading.models.casedemo,
}))
@Form.create()
class CaseAudit extends PureComponent {
  state = {
    modal1Visible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    visible: false,
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'casedemo/fetch',
    });
    dispatch({
      type: 'casedemo/caseStates',
    });
    dispatch({
      type: 'Entrust/fetchCategorys',
    });
  }

  setModal1Visible(modal1Visible) {
    this.setState({modal1Visible});
  }

  setModal2Visible(modal2Visible) {
    this.setState({modal2Visible});
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
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
      type: 'casedemo/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'casedemo/fetch',
      payload: {},
    });
  };

  // 更改之后的查询
  handleSearchs = () => {
    this.handleForm();
  };

  handleSearch = e => {
    e.preventDefault();
    this.handleForm();
  };

  handleForm = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        acceptDate:fieldsValue.acceptDate && fieldsValue.acceptDate.format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'casedemo/fetch',
        payload: values,
      });
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /* 跳转 */
  handJump = (record) => {
    router.push({
      pathname: '/case/advanced',
      state: {id: record.id},
    });
  };

  // 点击鉴定材料，根据ID查询
  showModal = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'casedemo/queryMaterials',
        payload: {
          ids:selectedRows.map(item => item.id),
          resolve,
          reject
        },
      })
    }).then((attachMentData) => {
      if (attachMentData.caseMaterial.length>0) {
        const ids = [];
        for(let i=0;i<attachMentData.caseMaterial.length;i+=1){
          ids.push(attachMentData.caseMaterial[i].attachmentId);
        }
        if (ids.length>0) {
          dispatch({
            type: 'caseform/fetchAttachMent',
            payload: ids
          });
        }
      }
    });
    this.setState({
      visible: true,
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

  showConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const conte = '您将删除实验编号为   ';
    const conten = '    的数据！';
    const rowCaseNumber = selectedRows.map(row => row.caseNo);
    const contents = conte + rowCaseNumber + conten;
    const id = selectedRows.map(item => item.id);
    const self = this;
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'casedemo/remove',
            payload: {
              ids: id,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta===true) {
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

  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const conte = '您将审核通过实验编号为   ';
    const conten = '    的数据！';
    const caseNoList = [];
    const idList = [];
    const statu = selectedRows.map(row => row.status);
    const caseNo = selectedRows.map(row => row.caseNo);
    const caseId = selectedRows.map(row => row.id);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(1,10)){
        caseNoList.push(caseNo[i]);
        idList.push(caseId[i])
      }
    }
    const contents = conte + caseNoList + conten;
    const self = this;
    if (!selectedRows) return;
    confirms({
      title: '确定要审核通过吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'casedemo/updateAudit',
            payload: {
              ids: idList,
              status: parseInt(3,10),
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1===true) {
            self.handleSearchs();
          }
        });
        message.success('审核成功');
        self.setState({ selectedRows: [] });
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
    const {dispatch} = this.props;
    dispatch({
      type: 'casedemo/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  /* 更新 */
  handleUpdate = fields => {
    const {dispatch} = this.props;
    dispatch({
      type: 'casedemo/update',
      payload: {
        ...fields,
        key: fields.key,
      },
    });
    message.success('更新成功');
    this.handleUpdateModalVisible();
  };

  /* 审核不通过 */
  handleModal2Ok() {
    const {dispatch, form} = this.props;
    const {selectedRows} = this.state;
    const idList = [];
    const statu = selectedRows.map(row => row.status);
    const caseId = selectedRows.map(row => row.id);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(1,10)){
        idList.push(caseId[i])
      }
    }
    form.validateFields((err) => {
      if (err) return;
      const self = this;
      form.resetFields();
      new Promise((resolve, reject) => {
        dispatch({
          type: 'casedemo/updateAudit',
          payload: {
            ids: idList,
            status: parseInt(2,10),
            resolve,
            reject
          },
        })
      }).then((status1) => {
        if (status1===true) {
          self.handleSearchs();
        }
      });
      this.setModal2Visible(false);
      message.success('操作成功');
      self.setState({ selectedRows: [] });
    });

  }

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
              {getFieldDecorator('caseNo')(<Input placeholder="请输入案例编号" />)}
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

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      casedemo: { caseState },
      Entrust: { Category },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNo')(<Input placeholder="请输入案例编号" />)}
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
              {getFieldDecorator('acceptDate')(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="委托人" style={{ marginLeft: 12 }}>
              {getFieldDecorator('clientName')(<Input placeholder="请输入委托人姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="案件状态">
              {getFieldDecorator('status')(
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
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const {expandForm} = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      form: {getFieldDecorator},
      casedemo: {data, caseState,caseMater},
      caseform: { attachmentList },
      loading,
      Entrust: {Category},
    } = this.props;
    const {
      selectedRows,
      updateModalVisible,
      stepFormValues,
      stepDirection,
      modal1Visible,
      modal2Visible,
      visible,
    } = this.state;

    const caseNoList = [];
    const idList = [];
    const statu = selectedRows.map(row => row.status);
    const caseNo = selectedRows.map(row => row.caseNo);
    const caseId = selectedRows.map(row => row.id);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(1,10)){
        caseNoList.push(caseNo[i])
        idList.push(caseId[i])
      }
    }
    const rowCaseNumber = selectedRows.map(row => row.caseNo);
    const rowStatus = parseInt(selectedRows.map(row => row.status),10);
    let rowNumber = 0;
    if(rowStatus===0||rowStatus===1||rowStatus===2){
      rowNumber = parseInt(0,10);
    }
    if(rowStatus>2&&rowStatus<7){
      rowNumber = parseInt(1,10);
    }
    if(rowStatus>6&&rowStatus<9){
      rowNumber = parseInt(2,10);
    }
    if(rowStatus===9){
      rowNumber = parseInt(3,10);
    }
    if(rowStatus>9){
      rowNumber = parseInt(4,10);
    }
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
        dataIndex: 'clientName',
        align: 'center',
      },
      {
        title: '案件状态',
        dataIndex: 'status',
        align: 'center',
        render(val) {
          const state = caseState.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
          const value = state.length > 0 ? state[0].value : val;
          // if (val === 2) {
          //   return (
          //     <Popover content={content} title={value} trigger="hover">
          //       <a>{value}</a>
          //     </Popover>
          //   );
          // }
          return value;

        },
      },
      {
        title: '金额',
        dataIndex: 'totalPrice',
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        align: 'center',
      },
    ];
    return (
      <PageHeaderWrapper title="案件审核">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <Button onClick={this.showConfirms} type="primary" disabled={selectedRows.length === 0 || selectedRows.filter(item => parseInt(item.status, 10) === 1).length === 0}>审核通过</Button>
                <Button onClick={() => this.setModal2Visible(true)} type="danger" disabled={selectedRows.length === 0 || selectedRows.filter(item => parseInt(item.status, 10) === 1).length === 0}>审核不通过</Button>
                <Button type="danger" disabled={selectedRows.length === 0} onClick={this.showConfirm}>删除</Button>
                <Button disabled={selectedRows.length !== 1} onClick={this.showModal}>鉴定材料</Button>
                <Button disabled={selectedRows.length !== 1} onClick={() => this.setModal1Visible(true)}>状态记录</Button>
              </span>
            </div>
            <Modal
              width={700}
              title={`编号为: ${rowCaseNumber} 的鉴定材料详情`}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              {(() => {
                if(caseMater.caseMaterial===undefined){
                  return (
                    <span>暂无数据</span>
                  );
                }
                if(caseMater.caseMaterial.length===0){
                  return (
                    <span>暂无数据</span>
                  );
                }
                if (caseMater.caseMaterial.length > 0) {
                  const datas = caseMater.caseMaterial;
                  const datasList = [];
                  for(let i=0;i<datas.length;i+=1){
                    const attchmentId = datas[i].attachmentId;
                    const name = attachmentList.filter(item=>item.id===datas[i].attachmentId);
                    const attachmentName = name.length>0?name[0].fileName : attchmentId;
                    datasList.push(
                      <DescriptionList key={datas[i].id} size="large" title={`鉴定材料 ${i+1} `} style={{marginBottom: 32}}>
                        <Description term="送检材料名称">{datas[i].name}</Description>
                        <Description term="类型">{datas[i].type}</Description>
                        <Description term="数量">{datas[i].amount}</Description>
                        <Description term="规格">{datas[i].specification}</Description>
                        <Description term="材料性质">{datas[i].feature}</Description>
                        <Description term="备注">{datas[i].remark}</Description>
                        <Description term="文件">
                          {attachmentName}
                        </Description>
                        <Tooltip>
                          <a href={`/spbbase-attachment-web/api/attachment/{id}/download?id=${attchmentId}`}>
                            下载
                          </a>
                        </Tooltip>
                      </DescriptionList>
                    )
                  }
                  return (
                    <Card>
                      {datasList}
                    </Card>
                  )
                }
              })()}
            </Modal>

            <Modal
              width={900}
              title={`编号为: ${rowCaseNumber} 的状态记录`}
              visible={modal1Visible}
              onOk={() => this.setModal1Visible(false)}
              onCancel={() => this.setModal1Visible(false)}
              footer={null}
            >
              <Steps direction={stepDirection} progressDot={customDot} current={rowNumber}>
                <Step title="案例登记" />
                <Step title="实验中" />
                <Step title="出报告" />
                <Step title="邮寄" />
                <Step title="完成" />
              </Steps>
            </Modal>
            <Modal
              width={700}
              title={`编号为: ${caseNoList} 的审核不通过原因`}
              centered
              visible={modal2Visible}
              onOk={() => this.handleModal2Ok()}
              onCancel={() => this.setModal2Visible(false)}
            >
              <Row gutter={16}>
                <Col lg={24} md={24} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('Reasons', {
                      rules: [{required: false, message: '请写入原因'}],
                    })(<TextArea disabled placeholder="数据标本不完整，无法进行检测" autosize={{minRows: 4, maxRows: 8}} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Modal>
            <StandardTable
              rowKey="id"
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
      </PageHeaderWrapper>
    );
  }
}

export default CaseAudit;
