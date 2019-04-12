import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker,message, Input, Select, Popover,InputNumber,Tabs  } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import IdentificationMatter from './IdentificationMatter';
import IdentifiedPerson from './IdentifiedPerson';
import IdentifiedObject from './IdentifiedObject';
import IdentifiedCar from './IdentifiedCar';
import CaseCharging from './CaseCharging';
import CaseSample from './CaseSample';
import CaseMaterial from './CaseMaterial';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const categorys = [
  {
  id:'0',
  value:'亲子鉴定'
},{
  id:'1',
  value:'文书鉴定'
},{
  id:'2',
  value:'酒精鉴定'
},{
  id:'3',
  value:'车辆痕迹鉴定'
},{
  id:'4',
  value:'法医临床鉴定'
},{
  id:'5',
  value:'法医病理鉴定'
}
];
const caseMarks = [];
caseMarks.push(
  <Option value="病鉴字" key="bing1">
    病鉴字
  </Option>,
  <Option value="痕鉴字" key="heng1">
    痕鉴字
  </Option>,
  <Option value="毒鉴字" key="du1">
    毒鉴字
  </Option>,
  <Option value="临鉴字" key="bing1">
    临鉴字
  </Option>,
  <Option value="文鉴字" key="wen1">
    文鉴字
  </Option>
);

const fieldLabels = {
  // 鉴定信息
  caseCategoryId: '专业类别',
  entrustDate: '委托时间',
  acceptDate: '受理日期',
  deadline: '落案时间 ( 工作日 )',
  caseSign: '案件标志',
  caseNoAutoGenerate: '案例编号',
  caseNo: '案件编号',
  // 委托信息
  identifiedBefore: '既往鉴定史',
  urgent: '是否加急',
  needEvade: '是否回避',
  materialsCompleted: '材料齐全',
  caseSummary: '检案摘要',
  remark: '备注',
  clientType: '委托方类型',
  clientDept: '委托单位',
  clientName: '委托人',
  clientPhone: '委托方联系方式',
  clientAddress: '委托方住址',
  // 报告寄回信息
  reportProvidedType: '发放方式',
  certTypeForTook: '自取方式',
  certIdentify: '身份证',
  recipientName: '收件人',
  recipientPhone: '收件人联系方式',
  recipientAddress: '收件人地址',
};

@connect(({ caseform,loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
  caseform,
  loading: loading.effects.caseform
}))
@Form.create()
class CaseForm extends PureComponent {
  state = {
    width: '100%',
    caseStatus:true,
    // 人
    persons:false,
    // 车
    vehicle:false,
    // 物
    matter:false,
    // 是否只读
    readOnlyState:false,
  };

  componentDidMount() {
    const self = this;
    const { dispatch
    } = this.props;
   if(self.props.location.state!==undefined){
     if(self.props.location.state.readOnlyState===true){
       this.setState({
         readOnlyState:true
       });
     }
     dispatch({
       type: 'caseform/fetchEntrust',
       payload: {
         caseCategoryId: self.props.location.state.ids
       },
     });
     dispatch({
       type: 'caseform/queryCharging',
       payload: {
         caseCategoryId: self.props.location.state.ids
       },
     });
     new Promise((resolve, reject) => {
       dispatch({
         type: 'caseform/caseGetId',
         payload: {
           ids:self.props.location.state.ids,
           resolve,
           reject
         },
       })
     }).then((attachMentData) => {
       if (attachMentData !== undefined) {
         if (attachMentData.caseMaterial.length > 0) {
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
       }
     });
    }else{
     dispatch({
       type: 'caseform/locationGetId',
     });
   }
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  };

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.resizeFooterToolbar);
  // };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  // 添加数据
  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'caseform/add',
            payload: {
              formVal: values,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta===true) {
            router.push({
              pathname: '/case/list',
            });
          }
        });
      }
    });
  };

  // 暂存数据
  validateTemporary = () => {
    const {
      form: { validateFieldsAndScroll,getFieldsValue },
      dispatch,
    } = this.props;
    validateFieldsAndScroll(['caseCategoryId'],(error) => {
      const formVals = getFieldsValue();
      if (!error) {
        // submit the values
        new Promise((resolve, reject) => {
          dispatch({
            type: 'caseform/add',
            payload: {
              formVal: formVals,
              resolve,
              reject
            },
          })
        }).then((sta) => {
          if (sta===true) {
            router.push({
              pathname: '/case/list',
            });
          }
        });
      }
    });
  };

  // 选择专业类别后的查询
  handleChange=(value)=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'caseform/fetchEntrust',
      payload: {
        caseCategoryId: value,
      },
    });
    dispatch({
      type: 'caseform/queryCharging',
      payload: {
        caseCategoryId: parseInt(value,10),
      },
    });
  };

  // 修改方法
  confirmRevision () {
    const {
      form: { validateFieldsAndScroll },
      caseform: { caseGetIds },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      const val = {
        ...values,
        sample: values.caseSample,
        caseSample: values.caseSample
      };
      // values.sample
      if (!error) {
        new Promise((resolve, reject) => {
          dispatch({
            type: 'caseform/update',
            payload: {
              ...val,
              id:caseGetIds.id,
              status:caseGetIds.status,
              resolve,
              reject
            }
          })
        }).then(() => {
            message.success('修改成功');
            router.push({
              pathname: '/case/list',
            });
          }
        );
      }
    });
  };

  render() {
    const {
      form: {getFieldDecorator, getFieldValue,getFieldsValue},
      submitting,
      // caseGetIds 案例信息   attachmentList 材料信息  dataCharging 财务表字典  dataEntrust 委托事项字典
      caseform: {dataEntrust,dataCharging,caseGetIds,attachmentList},
    } = this.props;
    // caseStatus 案例编号状态  persons 人 vehicle 车 matter 物  readOnlyState 是否只读
    const { caseStatus,persons,vehicle,matter,readOnlyState } = this.state;
    // 案例编号的自动/手动生成
    const handleChangeNumber = (value) => {
      if(parseInt(value,10)===parseInt(0,10)){
        this.setState({
          caseStatus: true,
        });
      }
      if(parseInt(value,10)===parseInt(1,10)){
        this.setState({
          caseStatus: false,
        });
      }
    };
    // 添加委托信息，并且根据委托信息，添加收费信息（重复不添加，委托删除，收费不变）
    const handleChanges = (value, id, number) => {
      const {
        form: {setFieldsValue},
      } = this.props;
      const CharTable = getFieldValue("caseCharging");
      // 判断是否重复，如果不重复运行添加，否则不进行处理————数据与收费说明的匹配
      const dataChar = CharTable.filter(item => item.chargingItemId === id);
      // 财务管理的数据
      const charge = dataCharging.list.filter(item => item.id === id);
      const type = charge.length > 0 ? charge[0].refundType.toString() : id;
      const money = charge.length > 0 ? charge[0].money : 0;
      const array = CharTable.map(item => (item));
      if (dataChar.length === 0) {
        const char = {
          key: parseInt(id, 10),
          chargingItemId: parseInt(id, 10),
          refundType: parseInt(type, 10),
          money: parseInt(money, 10),
          amount: parseInt(number, 10),
          discount: parseInt(0, 10),
          totalPrice: parseInt(number, 10) * parseInt(money,10) - parseInt(0, 10),
        };
        array.push(char);
      }
      setFieldsValue({
        caseCharging: array,
      });
    };
    // 若专业类别为亲子鉴定--根据添加人的信息，添加样本信息
    const handlePIdent = (data, state, target) => {
      const {
        form: {setFieldsValue},
      } = this.props;
      const CharPIden = getFieldValue("caseSample");
      let array = [];
      if (state === true && target.status === 'add') {
        if (CharPIden !== null) {
          array = CharPIden.map(item => (item));
        }
        const idNumb = target.idNumber;
        const birth = idNumb.substring(6, 10) + "-" + idNumb.substring(10, 12) + "-" + idNumb.substring(12, 14);
        const Pident = {
          key: `sam${target.key}`,
          name: target.name,
          birthday: birth,
          sex: parseInt(target.sex, 10),
          idNumber: target.idNumber,
          special: target.special,
          sampleType: target.sampleType,
          age: target.age,
          address: target.address,
        };
        array.push(Pident);
        setFieldsValue({
          caseSample: array,
        });
      }
      if (target.status === undefined) {
        array = CharPIden.filter(item => item.idNumber !== target.idNumber);
        setFieldsValue({
          caseSample: array,
        });
      }
    };
    // 文件上传
    const handleMater = (data, formData,key) => {
      const dataChar = data.filter(item => item.key === key);
      const {
        dispatch,
        form: {setFieldsValue},
      } = this.props;
      new Promise((resolve, reject) => {
        dispatch({
          type: 'casedemo/upload',
          payload: {
            formData,
            resolve,
            reject
          },
        })
      }).then((caseUpload) => {
        if (caseUpload !== undefined) {
          attachmentList.push(caseUpload[0]);
          const caseArray = data.filter(item => item.key !== key);
          const Pident = {
            key: dataChar[0].key,
            id: dataChar[0].id,
            name: dataChar[0].name,
            type: dataChar[0].type,
            amount: dataChar[0].amount,
            feature: dataChar[0].feature,
            remark: dataChar[0].remark,
            specification: dataChar[0].specification,
            attachmentName: dataChar[0].attachmentName,
            attachmentId: caseUpload[0].id,
          };
          caseArray.push(Pident);
          setFieldsValue({
            caseMaterial: caseArray,
          });
        }
      })
    };
    // 拼接样本信息数据
    const samples = caseGetIds!==undefined?caseGetIds.sample: [];
    const caseSample = caseGetIds!==undefined?caseGetIds.caseSample: [];
    const identPerson = caseGetIds!==undefined?caseGetIds.identifiedPerson: [];
    if (caseSample.length > 0) {
      for (let i = 0; i < caseSample.length; i += 1) {
        const name = caseSample.filter(item => item.sampleId === samples[i].id);
        const name2 = identPerson.filter(item => item.idNumber === samples[i].idNumber);
        samples[i].appellation = name[0].appellation;
        samples[i].key = i;
        samples[i].sex = name2[0].sex;
      }
    }
    // 根据所选专业类别Id 展示人车物的状态 →
    let caseId = null;
    const tabList = [];
    const formVals=getFieldsValue();
    if(caseGetIds===undefined){
      caseId = formVals.caseCategoryId;
    }else{
      caseId = caseGetIds.caseCategoryId;
    }
    this.setState({
      persons:parseInt(caseId, 10) === 0||parseInt(caseId, 10) === 2 || parseInt(caseId, 10) === 3 || parseInt(caseId, 10) === 4 || parseInt(caseId, 10) === 5
    });
    this.setState({
      vehicle:parseInt(caseId, 10) === 3||parseInt(caseId, 10) === 5
    });
    this.setState({
      matter:parseInt(caseId, 10) === 1||parseInt(caseId, 10) === 5
    });
    if (persons) {
      if(parseInt(caseId,10)===parseInt(0,10)){
        tabList.push(
          <TabPane tab="人" key="1">
            {getFieldDecorator('identifiedPerson', {
              initialValue:caseGetIds!==undefined?caseGetIds.identifiedPerson: [],
            })(<IdentifiedPerson onChange={(data,state, target) => {handlePIdent(data,state, target)}} readOnlyState={readOnlyState} />)}
          </TabPane>,
        );
      }else{
        tabList.push(
          <TabPane tab="人" key="1">
            {getFieldDecorator('identifiedPerson', {
              initialValue:caseGetIds!==undefined?caseGetIds.identifiedPerson: [],
            })(<IdentifiedPerson readOnlyState={readOnlyState} />)}
          </TabPane>,
        );
      }
    }
    if (vehicle) {
      tabList.push(
        <TabPane tab="车" key="2">
          {getFieldDecorator('identifiedCar', {
            initialValue:caseGetIds!==undefined?caseGetIds.identifiedCar: [],
          })(<IdentifiedCar readOnlyState={readOnlyState} />)}
        </TabPane>,
      );
    }
    if (matter) {
      tabList.push(
        <TabPane tab="物" key="3">
          {getFieldDecorator('identifiedObject', {
            initialValue:caseGetIds!==undefined?caseGetIds.identifiedObject: [],
          })(<IdentifiedObject readOnlyState={readOnlyState} />)}
        </TabPane>
      );
    }
    //  →根据所选专业类别Id 展示人车物的状态
    return (
      <PageHeaderWrapper title="案例登记" wrapperClassName={styles.advancedForm}>
        <Card title="鉴定信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.caseCategoryId}>
                  {getFieldDecorator('caseCategoryId', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.caseCategoryId!==null?caseGetIds.caseCategoryId.toString(): undefined,
                    rules: [{ required: true, message: '请选择专业类别' }]
                  })(
                    <Select
                      disabled={readOnlyState}
                      placeholder="请选择专业类别"
                      onChange={this.handleChange}
                    >
                      {categorys.map(item => (
                        <Option key={item.id} value={item.id}>{item.value}</Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{span: 6, offset: 2}} lg={{span: 8}} md={{span: 12}} sm={24}>
                <Form.Item label={fieldLabels.entrustDate}>
                  {getFieldDecorator('entrustDate', {
                    initialValue: caseGetIds!==undefined&&caseGetIds.entrustDate!==null?moment(caseGetIds.entrustDate, 'YYYY-MM-DD'): undefined,
                    rules: [{required: true, message: '请选择委托日期'}]
                  })(<DatePicker disabled={readOnlyState} style={{width: '100%'}} />)}
                </Form.Item>
              </Col>
              <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                <Form.Item label={fieldLabels.acceptDate}>
                  {getFieldDecorator('acceptDate', {
                    initialValue: caseGetIds!==undefined&&caseGetIds.acceptDate!==null?moment(caseGetIds.acceptDate, 'YYYY-MM-DD'): undefined,
                    rules: [{required: true, message: '请选择受理日期'}],
                  })(<DatePicker disabled={readOnlyState} style={{width: '100%'}} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.deadline}>
                  {getFieldDecorator('deadline', {
                    initialValue:caseGetIds!==undefined?caseGetIds.deadline: undefined,
                    rules: [{ required: true, message: '请输入落案时间' }],
                  })(
                    <InputNumber disabled={readOnlyState} style={{width: '100%'}} placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.caseSign}>
                  {getFieldDecorator('caseSign', {
                    initialValue:caseGetIds!==undefined?caseGetIds.caseSign.toString(): undefined,
                    rules: [{ required: true, message: '请选择案件标志' }],
                  })(<Select disabled={readOnlyState} placeholder="请选择案件标志">{caseMarks}</Select>)}
                </Form.Item>
              </Col>
              <Col xl={{span: 8, offset: 2}} lg={{span: 10}} md={{span: 24}} sm={24}>
                <Form.Item
                  style={{display:'inline-block,',width:'100', marginBottom: 0 }}
                >
                  <Col span="12">
                    <Form.Item label={fieldLabels.caseNoAutoGenerate} style={{width: '60%'}}>
                      {getFieldDecorator('caseNoAutoGenerate', {
                        initialValue: caseGetIds !== undefined && caseGetIds.caseNoAutoGenerate !== null ? caseGetIds.caseNoAutoGenerate.toString() : '0',
                      })(
                        <Select
                          disabled={readOnlyState}
                          onChange={handleChangeNumber}
                        >
                          <Option key="0" value="0">自动生成</Option>
                          <Option key="1" value="1">手动生成</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span="12">
                    <Form.Item>
                      {getFieldDecorator('caseNo', {
                        initialValue: caseGetIds !== undefined ? caseGetIds.caseNo : undefined,
                        rules: [{required: !caseStatus, message: '案例编号'}],
                      })(
                        <Input disabled={caseStatus} style={{width: '140%',marginTop: '29px',marginLeft:'-40%'}} placeholder="案例编号" />
                      )}
                    </Form.Item>
                  </Col>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="委托信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.identifiedBefore}>
                  {getFieldDecorator('identifiedBefore', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.identifiedBefore!==null?caseGetIds.identifiedBefore.toString(): undefined,
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="0">是</Option>
                      <Option value="1">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.clientType}>
                  {getFieldDecorator('clientType', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.clientType!==null?caseGetIds.clientType.toString(): undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="0">个人</Option>
                      <Option value="1">单位</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>

              {(() => {
                switch (getFieldValue(`clientType`)) {
                  case `0`:
                    return (
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.clientDept}>
                          {getFieldDecorator('clientDept', {
                            initialValue:caseGetIds!==undefined?caseGetIds.clientDept: undefined,
                            rules: [{ required: false, message: '请输入' }],
                          })(<Input disabled placeholder="个人无需输入" />)}
                        </Form.Item>
                      </Col>
                    );
                  case `1`:
                    return (
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.clientDept}>
                          {getFieldDecorator('clientDept', {
                            initialValue:caseGetIds!==undefined?caseGetIds.clientDept: undefined,
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input disabled={readOnlyState} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    );
                  default:
                    return (
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.clientDept}>
                          {getFieldDecorator('clientDept', {
                            initialValue:caseGetIds!==undefined?caseGetIds.clientDept: undefined,
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input disabled={readOnlyState} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    );
                }
              })()}

            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.clientName}>
                  {getFieldDecorator('clientName', {
                    initialValue:caseGetIds!==undefined?caseGetIds.clientName: undefined,
                    rules: [{ required: true, message: '请输入联系人姓名' }],
                  })(<Input disabled={readOnlyState} placeholder="请输入联系人姓名" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.clientPhone}>
                  {getFieldDecorator('clientPhone', {
                    initialValue:caseGetIds!==undefined?caseGetIds.clientPhone: undefined,
                    rules: [{ required: true, message: '请输入电话号码' }],
                  })(<Input disabled={readOnlyState} placeholder="请输入电话号码" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.clientAddress}>
                  {getFieldDecorator('clientAddress', {
                    initialValue:caseGetIds!==undefined?caseGetIds.clientAddress: undefined,
                    rules: [{ required: true, message: '请输入联系地址' }],
                  })(<Input disabled={readOnlyState} placeholder="请输入委托人地址" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.needEvade}>
                  {getFieldDecorator('needEvade', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.needEvade!==null?caseGetIds.needEvade.toString(): undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.urgent}>
                  {getFieldDecorator('urgent', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.urgent!==null?caseGetIds.urgent.toString(): undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.materialsCompleted}>
                  {getFieldDecorator('materialsCompleted', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.materialsCompleted!==null?caseGetIds.materialsCompleted.toString(): undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.remark}>
                  {getFieldDecorator('remark', {
                    initialValue:caseGetIds!==undefined?caseGetIds.remark: undefined,
                    rules: [{required: false, message: '备注'}],
                  })(<TextArea disabled={readOnlyState} placeholder="备注" autosize={{minRows: 4, maxRows: 8}} />)}
                </Form.Item>
              </Col>
              {
                parseInt(getFieldValue(`caseCategoryId`),10)!==parseInt(0,10) &&(
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item label={fieldLabels.caseSummary}>
                      {getFieldDecorator('caseSummary', {
                        initialValue:caseGetIds!==undefined?caseGetIds.caseSummary: undefined,
                        rules: [{required: true, message: '请输入检案摘要'}],
                      })(<TextArea disabled={readOnlyState} placeholder="请输入检案摘要" autosize={{minRows: 4, maxRows: 8}} />)}
                    </Form.Item>
                  </Col>
                )
              }
            </Row>
          </Form>
        </Card>
        <Card title="报告寄回地址" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.reportProvidedType}>
                  {getFieldDecorator('reportProvidedType', {
                    initialValue:caseGetIds!==undefined&&caseGetIds.reportProvidedType!==null?caseGetIds.reportProvidedType.toString(): undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select disabled={readOnlyState} placeholder="请选择">
                      <Option value="0">邮寄</Option>
                      <Option value="1">自取</Option>
                      <Option value="2">送达</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {(() => {
              switch (getFieldValue(`reportProvidedType`)) {
                case `0`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.recipientName}>
                          {getFieldDecorator('recipientName', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientName: undefined,
                            rules: [{ required: true, message: '请输入收件人姓名' }],
                          })(<Input disabled={readOnlyState} placeholder="请输入收件人姓名" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.recipientPhone}>
                          {getFieldDecorator('recipientPhone', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientPhone: undefined,
                            rules: [{ required: true, message: '请输入收件人联系方式' }],
                          })(<Input disabled={readOnlyState} placeholder="请输入收件人联系方式" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label={fieldLabels.recipientAddress}>
                          {getFieldDecorator('recipientAddress', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientAddress: undefined,
                            rules: [{ required: true, message: '请输入收件人地址' }],
                          })(<Input disabled={readOnlyState} placeholder="请输入收件人地址" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                case `1`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.certTypeForTook}>
                          {getFieldDecorator('certTypeForTook', {
                            initialValue:caseGetIds!==undefined&&caseGetIds.certTypeForTook!==null?caseGetIds.certTypeForTook.toString(): undefined,
                            rules: [{required: true, message: '请输入'}],
                          })(
                            <Select disabled={readOnlyState} placeholder="请选择">
                              <Option value="0">凭合同副本</Option>
                              <Option value="1">票据</Option>
                              <Option value="2">身份证</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      {(() => {
                        switch (getFieldValue(`certTypeForTook`)) {
                          case `2`:
                            return (
                              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                                <Form.Item label={fieldLabels.certIdentify}>
                                  {getFieldDecorator('certIdentify', {
                                    initialValue:caseGetIds!==undefined?caseGetIds.certIdentify: undefined,
                                    rules: [{required: true, message: '请输入身份证号'}],
                                  })(<Input disabled={readOnlyState} placeholder="请输入身份证号" />)}
                                </Form.Item>
                              </Col>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </Row>

                  );
                case `2`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.recipientName}>
                          {getFieldDecorator('recipientName', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientName: undefined,
                            rules: [{ required: true, message: '请选择' }],
                          })(
                            <Input disabled={readOnlyState} placeholder="请输入" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label={fieldLabels.recipientPhone}>
                          {getFieldDecorator('recipientPhone', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientPhone: undefined,
                            rules: [{ required: true, message: '请输入' }],
                          })(
                            <Input disabled={readOnlyState} placeholder="请输入" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.recipientAddress}>
                          {getFieldDecorator('recipientAddress', {
                            initialValue:caseGetIds!==undefined?caseGetIds.recipientAddress: undefined,
                            rules: [{ required: true, message: '请输入' }],
                          })(
                            <Input disabled={readOnlyState} placeholder="请输入" />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                default:
                  return null;
              }
            })()}
          </Form>
        </Card>
        {/* 委托事项 */}
        {
          getFieldValue(`caseCategoryId`)!==undefined &&(
            <Card title="委托事项" bordered={false}>
              {getFieldDecorator('identificationMatter', { initialValue:caseGetIds!==undefined?caseGetIds.identificationMatter: [] })(<IdentificationMatter handleChanges={handleChanges} readOnlyState={readOnlyState} opts={dataEntrust.list} />)}
            </Card>
          )
        }
        {/* 鉴定对象 人 车 物 */}
        {
          (persons || vehicle || matter) && (
            <Card
              style={{width: '100%'}}
              title="被鉴定对象"
            >
              <Tabs>
                {tabList}
              </Tabs>
            </Card>
          )
        }
        {/* 样本信息 */}
        {
          parseInt(getFieldValue(`caseCategoryId`),10)===parseInt(0,10)&&(
            <Card title="样本信息" bordered={false}>
              {getFieldDecorator('caseSample', { initialValue:caseGetIds!==undefined?caseGetIds.sample: []})(<CaseSample readOnlyState={readOnlyState} />)}
            </Card>
          )
        }
        {/* 鉴定材料 */}
        {
          getFieldValue(`caseCategoryId`)!==undefined &&(
            <Card title="鉴定材料" bordered={false}>
              {getFieldDecorator('caseMaterial', {initialValue:caseGetIds!==undefined?caseGetIds.caseMaterial: []})(<CaseMaterial readOnlyState={readOnlyState} handleMater={handleMater} attachmentList={attachmentList} />)}
            </Card>
          )
        }
        {/* 收费说明 */}
        {
          getFieldValue(`caseCategoryId`)!==undefined &&(
            <Card title="收费说明" bordered={false}>
              {getFieldDecorator('caseCharging', { initialValue:caseGetIds!==undefined?caseGetIds.caseCharging: [] })(<CaseCharging readOnlyState={readOnlyState} charOpts={dataCharging.list} />)}
            </Card>
          )
        }

        <FooterToolbar>
          {this.getErrorInfo()}
          {(() => {
            const self = this;
            if(self.props.location.state!==undefined){
              return (
                <Button type="primary" onClick={this.confirmRevision} loading={submitting}>
                  确认修改
                </Button>
              );
            }
            if(caseGetIds!==undefined){
              if(caseGetIds.length>0){
                return (
                  <Button type="primary" onClick={this.confirmRevision} loading={submitting}>
                    确认修改
                  </Button>
                );
              }
            }
            if(caseGetIds===undefined){
              return (
                <div>
                  <Button type="primary" onClick={this.validateTemporary} loading={submitting}>
                    暂存
                  </Button>,
                  <Button type="primary" onClick={this.validate} loading={submitting}>
                    保存并提交审核
                  </Button>
                </div>
              );
            }
          })()}
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default CaseForm;
