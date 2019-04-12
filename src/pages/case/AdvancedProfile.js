import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { Card, Button, Form, Icon, Col,Steps, Row, DatePicker,message, Input, Select, Popover,InputNumber,Tabs  } from 'antd';
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
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const { Step } = Steps;
const { Option } = Select;
const { TabPane } = Tabs;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const categorys = ['亲子鉴定','文书鉴定','酒精鉴定','车辆痕迹鉴定','法医临床鉴定','法医病理鉴定'];
const cateStatus = ['已登记', '待审核 ', '审核不通过', '审核通过','样本交接确认','样本交接退回','实验中', '报告打印中', '报告确认','邮寄中','已归档','已签发', '签发成功'];
const Sector = ['个人','单位'];
const right = ['是','否'];
const report = ['邮寄','自取','送达'];
// 自取方式
const certTypes = ['凭合同副本','票据','身份证'];
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

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter>
      {dot}
    </Popover>
  ) : (
    dot
  );

@connect(({ casedemo,caseform, loading }) => ({
  casedemo,caseform,
  loading: loading.models.casedemo,
}))
@Form.create()
class AdvancedProfile extends PureComponent {
  state = {
    width: '100%',
    // 人
    persons:false,
    // 车
    vehicle:false,
    // 物
    matter:false,
    // 是否只读
    readOnlyState:true,
    // 专业类型的名称

    stepDirection: 'horizontal',
  };

  // 初始查询
  componentDidMount() {
    const { dispatch
    } = this.props;
    const self = this;
    // dispatch({
    //   type: 'casedemo/caseGetId',
    //   payload:self.props.location.state.id
    // });
    dispatch({
      type: 'caseform/fetchEntrust',
    });
    dispatch({
      type: 'caseform/queryCharging',
    });
    new Promise((resolve, reject) => {
      dispatch({
        type: 'caseform/caseGetId',
        payload: {
          ids:self.props.location.state.id,
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

  }

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

  handleChange=(value)=> {
    const name = categorys.filter(item => parseInt(item.id, 10) === parseInt(value, 10));
    this.setState({
      caseCateName: name.length > 0 ? name[0].value : value
    });
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

  render() {
    const {
      form: {getFieldDecorator, getFieldValue,getFieldsValue},
      submitting,
      caseform: {dataEntrust,dataCharging,caseGetIds,attachmentList},
    } = this.props;
    const confirmRevision = () => {
      const {
        form: { validateFieldsAndScroll },
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
    const { persons,vehicle,matter,readOnlyState,stepDirection } = this.state;

    const formVals=getFieldsValue();
    const caseSample = caseGetIds!==undefined?caseGetIds.caseSample: [];
    const identPerson = caseGetIds!==undefined?caseGetIds.identifiedPerson: [];
    const samples = caseGetIds!==undefined?caseGetIds.sample: [];
    if (caseSample.length > 0) {
      for (let i = 0; i < caseSample.length; i += 1) {
        const name = caseSample.filter(item => item.sampleId === samples[i].id);
        const name2 = identPerson.filter(item => item.idNumber === samples[i].idNumber);
        samples[i].appellation = name[0].appellation;
        samples[i].key = i;
        samples[i].sex = name2[0].sex;
      }
    }

    let caseId = null;
    const tabList = [];
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
    // 页眉左部数据
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="委托人">{caseGetIds!==undefined?caseGetIds.clientName:''}</Description>
        <Description term="委托人电话">{caseGetIds!==undefined?caseGetIds.clientPhone:''}</Description>
        <Description term="是否回避">{caseGetIds!==undefined?right[caseGetIds.needEvade]:''}</Description>
        <Description term="是否加急">{caseGetIds!==undefined?right[caseGetIds.urgent]:''}</Description>
        <Description term="委托单位">{caseGetIds!==undefined?caseGetIds.clientDept:''}</Description>
        <Description term="联系人地址">{caseGetIds!==undefined?caseGetIds.clientAddress:''}</Description>
      </DescriptionList>
    );
    // 页眉右部数据
    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{caseGetIds!==undefined?cateStatus[caseGetIds.status]:''}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>订单金额</div>
          <div className={styles.heading}>¥&nbsp; {caseGetIds!==undefined?caseGetIds.totalPrice:''}</div>
        </Col>
      </Row>
    );
    // 委托时间
    const entrust = caseGetIds!==undefined?caseGetIds.entrustDate:'';
    // 受理日期
    const accept =  caseGetIds!==undefined?caseGetIds.acceptDate:'';
    // 发放方式
    // 订单状态和状态的展示
    const reportType =caseGetIds!==undefined?caseGetIds.reportProvidedType:'';
    const status = caseGetIds!==undefined?caseGetIds.status:'';
    const rowStatus = parseInt(status,10);
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

    return (
      <PageHeaderWrapper
        title={`案例编号：${caseGetIds!==undefined?caseGetIds.caseNo:''}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={description}
        extraContent={extra}
        tabList={tabList}
      >
        {/* 流程进度 */}
        <Card title="流程进度" style={{marginBottom: 24}} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={rowNumber}>
            <Step title="案例登记" />
            <Step title="实验中" />
            <Step title="出报告" />
            <Step title="邮寄" />
            <Step title="完成" />
          </Steps>
        </Card>
        {/* 鉴定信息 */}
        <Card title="鉴定信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="案件编号">{caseGetIds!==undefined?caseGetIds.caseNo:''}</Description>
            <Description term="专业类别">{caseGetIds!==undefined?categorys[caseGetIds.caseCategoryId]:''}</Description>
            <Description term="案件标志">{caseGetIds!==undefined?caseGetIds.caseSign:''} {}</Description>
            <Description term="委托时间">{caseGetIds!==undefined?moment(entrust).format('YYYY-MM-DD'):''}</Description>
            <Description term="受理时间">{caseGetIds!==undefined?moment(accept).format('YYYY-MM-DD'):''}</Description>
            <Description term="落案时间">{caseGetIds!==undefined?caseGetIds.deadline:''} 个工作日</Description>
          </DescriptionList>
        </Card>
        {/* 委托信息 */}
        <Card title="委托信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="委托人">{caseGetIds!==undefined?caseGetIds.clientName:''}</Description>
            <Description term="委托人电话">{caseGetIds!==undefined?caseGetIds.clientPhone:''}</Description>
            <Description term="委托单位">{caseGetIds!==undefined?caseGetIds.clientDept:'无'}</Description>
            <Description term="委托方类型">{caseGetIds!==undefined?Sector[caseGetIds.clientType]:''}</Description>
            <Description term="既往鉴定史">{caseGetIds!==undefined?right[caseGetIds.identifiedBefore]:''}</Description>
            <Description term="是否回避">{caseGetIds!==undefined?right[caseGetIds.needEvade]:''}</Description>
            <Description term="是否加急">{caseGetIds!==undefined?right[caseGetIds.urgent]:''}</Description>
            <Description term="材料齐全">{caseGetIds!==undefined?right[caseGetIds.materialsCompleted]:''}</Description>
            <Description term="联系人地址">{caseGetIds!==undefined?caseGetIds.clientAddress:''}</Description>
          </DescriptionList>
          {(() => {
            // 根据专业类别，展示检案摘要
            const caseIds = caseGetIds !== undefined ? parseInt(caseGetIds.caseCategoryId,10) : '';
            switch (caseIds) {
              case 0:
                return null;
              default:
                return (
                  <DescriptionList style={{marginBottom: 24}}>
                    <Description term="检案摘要">
                      {/* 据送检资料记载：委托方对送检的XXXX材料上的XXXXX签名/公章印文真实性存疑，故委托本机构协助查明其事实真相。 */}
                      {caseGetIds !== undefined ? caseGetIds.caseSummary : ''}
                    </Description>
                  </DescriptionList>
                );
            }
          })()}
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="备注">{caseGetIds!==undefined?caseGetIds.remark:''}</Description>
          </DescriptionList>
        </Card>
        {/* 报告回寄地址 */}
        <Card title="报告回寄地址" style={{marginBottom: 24}} bordered={false}>
          <DescriptionList style={{marginBottom: 24}}>
            {/* 需要根据发放方式显示内容 */}
            <Description term="发放方式">{caseGetIds!==undefined?report[caseGetIds.reportProvidedType]:''}</Description>
          </DescriptionList>
          {(() => {
            switch (reportType) {
              case 0:
                return (
                  <DescriptionList style={{marginBottom: 24}}>
                    <Description term="收件人">{caseGetIds!==undefined?caseGetIds.recipientName:''}</Description>
                    <Description term="电话号码">{caseGetIds!==undefined?caseGetIds.recipientPhone:''}</Description>
                    <Description term="邮寄地址">{caseGetIds!==undefined?caseGetIds.recipientAddress:''}</Description>
                  </DescriptionList>
                );
              case 1:
                return (
                  <DescriptionList style={{marginBottom: 24}}>
                    <Description term="自取方式">{caseGetIds!==undefined?certTypes[caseGetIds.certTypeForTook]:''}</Description>
                    {(() => {
                      const certTypeFor = caseGetIds!==undefined?caseGetIds.certTypeForTook:'';
                      switch (certTypeFor) {
                        case 2:
                          return (
                            <DescriptionList style={{marginBottom: 24}}>
                              <Description term="身份证号">{caseGetIds!==undefined?caseGetIds.certIdentify:''}</Description>
                            </DescriptionList>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </DescriptionList>

                )
                  ;
              case 2:
                return (
                  <DescriptionList style={{ marginBottom: 24 }}>
                    <Description term="收件人">{caseGetIds!==undefined?caseGetIds.recipientName:''}</Description>
                    <Description term="电话号码">{caseGetIds!==undefined?caseGetIds.recipientPhone:''}</Description>
                    <Description term="邮寄地址">{caseGetIds!==undefined?caseGetIds.recipientAddress:''}</Description>
                  </DescriptionList>
                );
              default:
                return null;
            }
          })()}
        </Card>

        {
          <Card title="委托事项" bordered={false}>
            {getFieldDecorator('identificationMatter', {initialValue: caseGetIds !== undefined ? caseGetIds.identificationMatter : []})(
              <IdentificationMatter readOnlyState={readOnlyState} opts={dataEntrust.list} />)}
          </Card>
        }
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

        {/* caseGetIds.caseCategoryId */}

        {(() => {
          const caseCateId = caseGetIds!==undefined?caseGetIds.caseCategoryId:"";
          switch (parseInt(caseCateId,10)) {
            case 0:
              return (
                <Card title="样本信息" bordered={false}>
                  {getFieldDecorator('caseSample', {initialValue: caseGetIds !== undefined ? caseGetIds.sample : []})(
                    <CaseSample readOnlyState={readOnlyState} />)}
                </Card>
              );
        default:
              return null;
          }
        })()}
        {
          <Card title="鉴定材料" bordered={false}>
            {getFieldDecorator('caseMaterial', {initialValue: caseGetIds !== undefined ? caseGetIds.caseMaterial : []})(
              <CaseMaterial readOnlyState={readOnlyState} attachmentList={attachmentList} />)}
          </Card>
        }

        {
          <Card title="收费说明" bordered={false}>
            {getFieldDecorator('caseCharging', {initialValue: caseGetIds !== undefined ? caseGetIds.caseCharging : []})(
              <CaseCharging readOnlyState={readOnlyState} charOpts={dataCharging.list} />)}
          </Card>
        }
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
