import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  Input,
  Select,
  Icon,
  Button,
  DatePicker,
  Modal,
  message,
  Steps,
  Popover,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './CaseList.less';

const { Description } = DescriptionList;
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const confirms = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter>
      {dot}
    </Popover>
  ) : (
    dot
  );

/* eslint react/no-multi-comp:0 */
@connect(({ casedemo,caseform, Entrust, loading }) => ({
  casedemo,
  caseform,
  Entrust,
  loading: loading.models.casedemo,
}))
@Form.create()
class CaseList extends PureComponent {
  state = {
    modal1Visible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    visible: false,
    stepDirection: 'horizontal',
  };


  componentDidMount() {
    const { dispatch } = this.props;
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
    this.setState({ modal1Visible });
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
      type: 'casedemo/fetch',
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
      type: 'casedemo/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /* 点击案例编号的跳转 */
  handJump = (record) => {
    router.push({
      pathname: '/case/advanced',
      state: {id: record.id},
    });
  };

  /* 点击修改的跳转 */
  handJump1 = (selectedRows) => {
    if(selectedRows[0]!==undefined){
      const idstr = selectedRows[0].id;
      router.push({
        pathname: '/case/form',
        state: { ids: idstr },
      });
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 更改之后的查询
  handleSearchs = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        // acceptDate:fieldsValue.acceptDate && fieldsValue.acceptDate.format('YYYY-MM-DD'),
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
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

  // 查询
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        acceptDate:fieldsValue.acceptDate && fieldsValue.acceptDate.format('YYYY-MM-DD'),
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
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

  handleDelete = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case '':
        break;
      default:
        dispatch({
          type: 'casedemo/remove',
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
        for (let i = 0; i < attachMentData.caseMaterial.length; i += 1) {
          if (attachMentData.caseMaterial[i].attachmentId !== null) {
            ids.push(attachMentData.caseMaterial[i].attachmentId);
          }
        }
        if (ids.length > 0) {
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

  // 删除
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

  // 添加
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'casedemo/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  // 案例提交
  showConfirm1 = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const self = this;
    const conte = '您将提交案例编号为';
    const conten = '的数据！';
    const caseNoList = [];
    const idList = [];
    const statu = selectedRows.map(row => row.status);
    const caseNo = selectedRows.map(row => row.caseNo);
    const caseId = selectedRows.map(row => row.id);
    for(let i=0;i<statu.length;i+=1){
      if(parseInt(statu[i],10)===parseInt(0,10)){
        caseNoList.push(caseNo[i])
        idList.push(caseId[i])
      }
    }
    const contents = conte + caseNoList + conten;

    if (!selectedRows) return;

    confirms({
      title: '确定要提交数据吗?',
      content: contents,
      onOk() {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'casedemo/updateAudit',
            payload: {
              ids: idList,
              status:parseInt(1,10),
              resolve,
              reject
            },
          })
        }).then((status1) => {
          if (status1===true) {
            self.handleSearchs();
          }
        });
        message.success('提交成功!');
        self.setState({ selectedRows: [] });
      },
      onCancel() {
      },
    });
  };

  // 简单查询
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

  // 复杂查询
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

  // 查询条件切换
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      casedemo: { data, caseState,caseMater },
      loading,
      caseform: { attachmentList },
      Entrust: { Category },
    } = this.props;
    console.log(data,'data')
    const {
      selectedRows,
      stepDirection,
      modal1Visible,
      visible,
    } = this.state;
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
          if(val!==null){
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
      <PageHeaderWrapper title="案件列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <Button disabled={selectedRows.length !== 1} onClick={() => this.handJump1(selectedRows)}>修改</Button>
                <Button disabled={selectedRows.length === 0||selectedRows.filter(item => parseInt(item.status, 10) === 0).length === 0} onClick={this.showConfirm1}>提交审核</Button>
                <Button type="danger" disabled={selectedRows.length === 0} onClick={this.showConfirm}>删除</Button>
                <Button disabled={selectedRows.length !== 1} onClick={this.showModal}>鉴定材料</Button>
                <Button disabled={selectedRows.length !== 1} onClick={() => this.setModal1Visible(true)}>状态记录</Button>
              </span>
            </div>
            {/* 鉴定材料详情 */}
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
                    let attachmentName = null;
                    if(attchmentId!==null){
                      const name = attachmentList.filter(item=>item.id===datas[i].attachmentId);
                      attachmentName = name.length>0?name[0].fileName : null;
                    }
                    datasList.push(
                      <DescriptionList key={datas[i].id} size="large" title={`鉴定材料 ${i + 1} `} style={{marginBottom: 32}}>
                        <Description term="送检材料名称">{datas[i].name}</Description>
                        <Description term="类型">{datas[i].type}</Description>
                        <Description term="数量">{datas[i].amount}</Description>
                        <Description term="规格">{datas[i].specification}</Description>
                        <Description term="材料性质">{datas[i].feature}</Description>
                        <Description term="备注">{datas[i].remark}</Description>
                        <Description term={attachmentName !== null ? "文件下载" : null}>
                          <Tooltip>
                            <a href={`/spbbase-attachment-web/api/attachment/{id}/download?id=${attchmentId}`}>
                              {attachmentName !== null ? "下载" : null}
                            </a>
                          </Tooltip>
                        </Description>

                        <Description term={attachmentName !== null ? "文件" : null}>
                          {attachmentName !== null ? attachmentName : ""}
                        </Description>
                      </DescriptionList>

                  )}
                  return (
                    <Card>
                      {datasList}
                    </Card>
                  )
                }
              })()}
            </Modal>
            {/* 状态记录 */}
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
      </PageHeaderWrapper>
    );
  }
}

export default CaseList;
