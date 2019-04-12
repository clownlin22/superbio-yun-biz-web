import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, Card, Button, Modal, Popover } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './MailList.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Description } = DescriptionList;
const mailType = ['邮寄','自取',"送达"];
const isMail = ['未寄出', '已寄出'];
const category = ['亲子鉴定', '文书鉴定', '酒精鉴定','车辆痕迹鉴定', '法医临床鉴定', '法医病理鉴定',
];
const expressCompany = ['EMS','顺丰','百世'];
const certTypeForTook = ['凭合同副本','票据','身份证'];

@Form.create()
class MailView extends PureComponent{

  handleOk=()=>{
    const {selectedRows,form,dispatch,mailList,handleOk,componentDidMount} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      for (const i in selectedRows){
        const values = {
          ...fieldsValue,
          caseId:selectedRows[i].idString,
          providedType:selectedRows[i].reportProvidedType,
          certTypeForTook:selectedRows[i].certTypeForTook,
          certIdentify:selectedRows[i].certIdentify,
        };

        mailList.push(values)
      }
      this.setState(()=>{
        handleOk(mailList)
      });
      form.resetFields();
    });


  };

  handleCancel=()=>{
    const {handleCancel} = this.props;
    this.setState(()=>{
      handleCancel()
    })
  };

  render(){
    const {visible,form,selectedRows } = this.props;
    return(
      <Modal
        title={`邮寄界面`}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="inline" className={styles.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮寄公司">
                {form.getFieldDecorator('expressCompany', {
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                    },
                  ],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="0">EMS</Option>
                    <Option value="1">顺丰</Option>
                    <Option value="2">百世</Option>
                  </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="快递单号">
                {form.getFieldDecorator('expressNumber', {
                  rules: [{ required: true, message: '必填' }],
                })(<Input placeholder="请输入"/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
                {form.getFieldDecorator('recipientName', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue:selectedRows[0].recipientName,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
                {form.getFieldDecorator('recipientPhone', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue:selectedRows[0].recipientPhone,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收件人地址">
                {form.getFieldDecorator('recipientAddress', {
                  rules: [{ required: true, message: '必填' }],
                  initialValue:selectedRows[0].recipientAddress,
                })(<Input/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

@Form.create()
class DeliveryMail extends PureComponent{

  handleOk=()=>{
    const {deliveryMailOk,mailList,form,selectedRows} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      for (const i in selectedRows){
        const values = {
          ...fieldsValue,
          caseId:selectedRows[i].idString,
        };

        mailList.push(values)
      }
      this.setState(
        ()=>{
          deliveryMailOk(mailList)
        }
      )
      form.resetFields();
    });


  };

  handleCancel=()=>{
    const {deliveryMailCancel} = this.props;
    this.setState(
      ()=>{
        deliveryMailCancel()
      }
    )
  };

  render(){
    const { deliveryMailVisible,form ,selectedRows} = this.props;
    return(
      <Modal
        title={`邮寄界面`}
        visible={deliveryMailVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系人">
              {form.getFieldDecorator('recipientName', {
                rules: [{ required: true, message: '必填' }],
                initialValue:selectedRows[0].recipientName,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
              {form.getFieldDecorator('recipientPhone', {
                rules: [{ required: true, message: '必填' }],
                initialValue:selectedRows[0].recipientPhone,
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="收件人地址">
              {form.getFieldDecorator('recipientAddress', {
                rules: [{ required: true, message: '必填' }],
                initialValue:selectedRows[0].recipientAddress,
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    )
  }
}

@Form.create()
class SelfMail extends PureComponent{

  handleOk=()=>{
    const { selfMailHandleOk,mailList,form,selectedRows} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      for (const i in selectedRows){
        const values = {
          ...fieldsValue,
          caseId:selectedRows[i].idString,
          providedType:selectedRows[i].reportProvidedType,
        };

        mailList.push(values)
      }


      this.setState(
        ()=>{
          selfMailHandleOk(mailList)
        }
      );

      form.resetFields();
    });

  };

  handleCancel=()=>{
    const { selfMailHandleCancel } = this.props
    this.setState(
      ()=>{
        selfMailHandleCancel()
      }
    )
  };

  render(){
    const {selfMailVisible ,selectedRows,form} = this.props;
    return(
      <Modal
        title={`邮寄界面`}
        visible={selfMailVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form layout="inline" className={styles.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="自取方式">
                {form.getFieldDecorator('certTypeForTook', {
                  initialValue:selectedRows[0].certTypeForTook,
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                    },
                  ],
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value={0}>{certTypeForTook[0]}</Option>
                    <Option value={1}>{certTypeForTook[1]}</Option>
                    <Option value={2}>{certTypeForTook[2]}</Option>
                  </Select>)}
              </FormItem>
            </Col>
            {(() => {
              console.log("身份证");
              console.log(form.getFieldValue(`certTypeForTook`),"+++++++++++++++++++++++++")
              switch (form.getFieldValue(`certTypeForTook`)) {
                case 2:
                  return (
                    <Col md={24} sm={24}>
                      <Form.Item label={'身份证'}>
                        {form.getFieldDecorator('certIdentify', {
                          initialValue:selectedRows[0].certIdentify,
                          rules: [{required: true, message: '请输入身份证号'}],
                        })(<Input placeholder="请输入身份证号" />)}
                      </Form.Item>
                    </Col>
                  );
                default:
                  return null;
              }
            })()}
          </Row>
        </Form>
      </Modal>
    )
  }
}

@connect(({ mailModel,casedemo, loading }) => ({
  mailModel,
  casedemo,
  loading: loading.models.mailModel,
}))
@Form.create()
class MailList extends PureComponent {
  state = {
    visible: false,
    selfMailVisible: false,
    deliveryMailVisible:false,
    selectedRows: [],
    formValues: {},
    record: [],
    mailList:[]
  };

  columns = [
    {
      title: '案例编号',
      dataIndex: 'caseNo',
      align: 'center',
    },
    {
      title: '专业类别',
      dataIndex: 'caseCategoryId',
      align: 'center',
      render(val) {
        return category[val];
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
      title: '邮寄类型',
      dataIndex: 'reportProvidedType',
      align: 'center',
      render(val,record) {

        const contentMail = (
          <div>
            <p>收件人：{record.recipientName}</p>
            <p>联系方式：{record.recipientPhone}</p>
            <p>送达地址：{record.recipientAddress}</p>
          </div>
        );
        const contentMail2 = (
          <div>
            <p>邮寄公司：{expressCompany[record.expressCompany]}</p>
            <p>邮寄单号：{record.expressNumber}</p>
            <p>收件人：{record.recipientName}</p>
            <p>联系方式：{record.recipientPhone}</p>
            <p>送达地址：{record.recipientAddress}</p>
          </div>
        );

        const SelfMail = (
          <div>
            <p>自取凭证：{certTypeForTook[record.certTypeForTook]}</p>
            {(() => {
              switch (record.certTypeForTook) {
                case 2:
                  return (
                    <p>身份证：{record.certIdentify}</p>
                  );
                default:
                  return null;
              }
            })()}
          </div>
        );

        const text1 = (
          <div>
            <p>收件人：{record.recipientName}</p>
            <p>手机号：{record.recipientPhone}</p>
            <p>地  址：{record.recipientAddress}</p>
          </div>
        )


        if (val === 0) {
          return (
            <Popover content={record.isMail==0?contentMail:contentMail2} title={mailType[val]} trigger="hover">
              <a>{mailType[val]}</a>
            </Popover>);
        }
        if(val ===1){
          return (
            <Popover content={SelfMail} title={mailType[val]} trigger="hover">
              <a>{mailType[val]}</a>
            </Popover>);
        }
        else {
          return(
            <Popover content={text1} title={mailType[val]}>
              <a>{mailType[val]}</a>
            </Popover>
          )
        }

      },
    },
    {
      title: '邮寄状态',
      dataIndex: 'isMail',
      align: 'center',
      render(val) {
        return isMail[val];
      },
    },
    {
      title: '描述',
      dataIndex: 'describe',
      align: 'center',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    new Promise((resolve, reject) => {
      dispatch({
        type:"casedemo/fetch2",
         payload:{
           resolve,
           reject
         }
      });
    }).then((data) => {
      if(data.length!==0){
        const ids = data.map(v=>{return(v.idString)});
        dispatch({
          type:'mailModel/fetchMail',
          payload:ids,
        })
      }
    });
   /* dispatch({
      type: 'casedemo/fetch',
    });

    dispatch({
      type:'mailModel/fetchMail'
    })*/
  }

  showModal = (reportProvidedType) => {

    const { selectedRows } = this.state;

    switch (reportProvidedType) {
      /*
      *邮寄0
      * 自取1
      * 送达2*/
      case 0:
        this.setState({
          visible: true,
        }); break;
      case 1:
        this.setState({
          selfMailVisible:true
        }); break;
      case 2:
        this.setState({
          deliveryMailVisible:true
        }); break;
    }
    this.setState({
      selectedRows:selectedRows
    });
  };
  handleOk = (mailList) => {
    const {dispatch} = this.props;
    const { selectedRows } = this.state;
    new Promise((resolve, reject) => {
      dispatch({
        type:"mailModel/insert",
        payload:{
          mailList,
          resolve,
          reject
        }
      });
    }).then((data) => {
      if (data==true){
        this.componentDidMount()
      }
    });

    this.setState({
      selectedRows:[],
      visible: false,
      mailList:[]
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  selfMailHandleOk=(mailList)=>{
    const {dispatch} = this.props;
    const { selectedRows } = this.state;
    new Promise((resolve, reject) => {
      dispatch({
        type:"mailModel/insert",
        payload:{
          mailList,
          resolve,
          reject
        }
      });
    }).then((data) => {
      if (data==true){
        this.componentDidMount()
      }
    });

    this.setState({
      selectedRows:[],
      mailList:[],
      selfMailVisible:false,
    });
};
  selfMailHandleCancel=()=>{
    this.setState({
      selfMailVisible:false
    })
  };

  deliveryMailOk=(mailList)=>{
    const {dispatch} = this.props;
    new Promise((resolve, reject) => {
      dispatch({
        type:"mailModel/insert",
        payload:{
          mailList,
          resolve,
          reject
        }
      });
    }).then((data) => {
      if (data==true){
        this.componentDidMount()
      }
    });

    this.setState({
      selectedRows:[],
      mailList:[],
      deliveryMailVisible:false,

    });
    this.setState({

    })
  };
  deliveryMailCancel=()=>{
    this.setState({
      deliveryMailVisible:false
    })
  };

  renderAdvancedSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.searchForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="专业类型">
              {getFieldDecorator('caseCategoryId')(
                <Select placeholder="请选择" allowClear>
                  <Option value="0">亲子鉴定</Option>
                  <Option value="1">文书鉴定</Option>
                  <Option value="2">酒精鉴定</Option>
                  <Option value="3">车辆痕迹鉴定</Option>
                  <Option value="4">法医临床鉴定</Option>
                  <Option value="5">法医病理鉴定</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="委托方">
              {getFieldDecorator('clientName')(<Input placeholder="请输入寄件人"/>)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginTop: 6 ,marginLeft:8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
            {/*<div style={{ float: 'right', marginBottom: 24, paddingRight: 16 }}>

            </div>*/}
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>
            <FormItem label="是否邮寄">
              {getFieldDecorator('isMail')(
                <Select placeholder="请选择" allowClear>
                  <Option value="0">未寄出</Option>
                  <Option value="1">已寄出</Option>
                </Select>,
              )}
            </FormItem>
          </Col>*/}

        </Row>
      </Form>
    );
  }
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'casedemo/fetch',
        payload: {
          caseCategoryId:fieldsValue.caseCategoryId,
          clientName:fieldsValue.clientName
        },
      });
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
    });
  };

  handleSelectRows = row => {
    this.setState({
      selectedRows: row,
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
      type: 'mailModel/fetch',
      payload: params,
    });
  };
  generateData=(data,mailData)=>{

    for(const i in data.list) {
      let temp = 0;
      for (const j in mailData) {
        if (data.list[i].idString === mailData[j].caseId){
          temp = 1;
          data.list[i].certTypeForTook = mailData[j].certTypeForTook;
          data.list[i].certIdentify = mailData[j].certIdentify;
          data.list[i].expressCompany = mailData[j].expressCompany;
          data.list[i].expressNumber = mailData[j].expressNumber;
          data.list[i].recipientName = mailData[j].recipientName;
          data.list[i].recipientPhone = mailData[j].recipientPhone;
          data.list[i].recipientAddress = mailData[j].recipientAddress;
        }
      }
      data.list[i].isMail=temp
    }
    return data
  };

  render() {
    const {
      casedemo: { data },
      mailModel:{mailData},
      loading,
      form:{getFieldDecorator}
    } = this.props;


    const { selectedRows, visible,selfMailVisible,deliveryMailVisible, mailList } = this.state;
    const {dispatch} = this.props;

    const MaliViewMethods = {
      handleOk:this.handleOk,
      componentDidMount:this.componentDidMount,
      handleCancel:this.handleCancel
    };
    const selfMailViewMethods = {
      selfMailHandleOk:this.selfMailHandleOk,
      selfMailHandleCancel:this.selfMailHandleCancel
    };
    const deliveryMailViewMethods = {
      deliveryMailOk:this.deliveryMailOk,
      deliveryMailCancel:this.deliveryMailCancel
    };

    return (
      <PageHeaderWrapper title="邮寄列表">
        <Card bordered={false}>
          <div>{this.renderAdvancedSearchForm()}</div>
          <div className={styles.tableListOperator}>


            <Button  type="primary"
                     disabled={selectedRows.length === 1 && selectedRows.filter(item =>item.isMail===1).length===0?false:true}
                     onClick={()=>this.showModal(selectedRows[0].reportProvidedType)}>
              确认邮寄
            </Button>
            {selectedRows&& selectedRows.length!=0?(
              <MailView
                {...MaliViewMethods}
                visible={visible}
                selectedRows={selectedRows}
                mailList={mailList}
                dispatch={dispatch}
              />
            ):null}

            {selectedRows&& selectedRows.length!=0?(
              <SelfMail
                {...selfMailViewMethods}
                selfMailVisible={selfMailVisible}
                selectedRows={selectedRows}
                mailList={mailList}
                dispatch={dispatch}
              />
            ):null}

            {selectedRows&& selectedRows.length!=0?(
              <DeliveryMail
                {...deliveryMailViewMethods}
                deliveryMailVisible={deliveryMailVisible}
                selectedRows={selectedRows}
                mailList={mailList}
                dispatch={dispatch}
              />
            ):null}

          </div>
          <StandardTable
            rowKey="idString"
            selectedRows={selectedRows}
            loading={loading}
            data={this.generateData(data,mailData)}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MailList;
