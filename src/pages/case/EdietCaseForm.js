import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, Input, Select, Popover } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './style.less';
import Appraisement from './IdentificationMatter';
import PIdentified from './IdentifiedPerson';
import TIdentified from './IdentifiedObject';
import CIdentified from './IdentifiedCar';
import Material from './CaseMaterial';
import ChargeTable from './CaseCharging';
import PaCmaterial from './PaCmaterial';
import CarMmaterial from './CarMmaterial';

const { Option } = Select;

const categorys = [];
categorys.push(
  <Option value="qing" key="qing1">
    亲子鉴定
  </Option>,
  <Option value="wen" key="wen1">
    文书鉴定
  </Option>,
  <Option value="jiu" key="jiu1">
    酒精鉴定
  </Option>,
  <Option value="che" key="che1">
    车辆痕迹鉴定
  </Option>,
  <Option value="fa" key="fa1">
    法医临床鉴定
  </Option>,
  <Option value="fab" key="fab1">
    法医病理鉴定
  </Option>
);
const caseMarks = [];
caseMarks.push(
  <Option value="bing" key="bing1">
    病鉴字
  </Option>,
  <Option value="heng" key="heng1">
    痕鉴字
  </Option>,
  <Option value="du" key="du1">
    毒鉴字
  </Option>,
  <Option value="ling" key="bing1">
    临鉴字
  </Option>,
  <Option value="wen" key="wen1">
    文鉴字
  </Option>
);

const fieldLabels = {
  category: '专业类别',
  wdate: '委托时间',
  proceTime: '受理日期',
  ldate: '落案时间',
  caseMark: '案件标志',
  caseNumber: '案件编号',
  aseNumber: '案件编号',
  chistory: '既往鉴定史',
  delegateType: '委托方类型',
  delegateUnit: '委托单位',
  contactEr: '联系人',
  telephone: '联系方式',
  elephone: '联系方式',
  address: '联系人住址',
  ScontactEr: '送检人',
  Stelephone: '送检人电话',
  caseType: '案件类型',
  Yavoid: '是否回避',
  Yurgent: '是否加急',
  Ycomplete: '材料齐全',
  MubanType: '模板类型',
  FirsrSurveyor: '第一鉴定人',
  SecondSurveyor: '第二鉴定人',
  ZSurveyor: '鉴定助理',
  ZDremarks: '检案摘要',
  Jremarks: '备注',
  disbursement: '发放方式',
  recipient: '收件人',
  Rcontact: '电话号码',
  Raddress: '邮寄地址',
  hetongfuben: '凭合同副本',
  piaoju: '票据',
  shenfenz: '身份证',
  songdadiz: '送达地址',
  songdajies: '送达接收人',
  mattersEntrusted: '委托事项',
  Detailed: '细则',
  numbers: '数量',
  Mremarks: '备注',
  ObjectType: '对象类型',
  Pname: '姓名',
  Pnational: '民族',
  Psex: '性别',
  Page: '年龄',
  Paddress: '家庭住址',
  idcard: '身份证号',
  PcontactEr: '联系人',
  Ptelephone: '联系电话',
  Premarks: '备注',
  Cname: '名称',
  CType: '车辆类型',
  Cbrand: '品牌',
  Ccode: '车辆识别码',
  Caddress: '停放地点',
  CcontactEr: '联系人',
  Ctelephone: '联系电话',
  Cremarks: '备注',
  Tname: '名称',
  TcontactEr: '联系人',
  Ttelephone: '联系电话',
  Tremarks: '备注',
  materialName: '送检材料名称',
  Mtype: '类型',
  Mnumbers: '数量',
  Mspecifications: '规格',
  Mdate: '接收时间',
  Mnature: '材料性质',
  Mdeal: '处理方式',
  Mbeizhu: '备注',
  Mfile: '文件',
  Amaterial: '材料类型',
  Afile: '上传文件',
  AfileType: '文件类型',
  samplet: '样本条形码',
  samplingt: '取样类型',
  special: '特殊样本',
  appellation: '称谓',
  handling: '处理方式',
  Aremarks: '备注',
  Bfile: '上传文件',
  BfileType: '文件类型',
  Bnumber: '车牌号',
  Chassis: '车架号',
  Engine: '发动机号',
  VehicleType: '车辆类型',
  Bhandling: '处理方式',
  Bremarks: '备注',
  ChargeProjects: '收费项目',
  ChargeType: '收费类型',
  Cnumber: '数量',
  Cprice: '单价',
  Cpreferential: '优惠金额',
  Receivable: '应收小计',
  remarks: '备注',
};

const AtableData = [
  {
    key: '1',
    mattersEntrusted: '书写压痕辩读',
    detail: '这是一个细则',
    Anumbers: '10086',
    Aremarks: '这是一个备注',
  },
  {
    key: '2',
    mattersEntrusted: '印刷文件制作方式鉴定',
    detail: '文件是通过何种办公机具或印刷机具制作',
    Anumbers: '10088',
    Aremarks: '这是一个备注',
  },
];
const MtableData = [
  {
    key: '1',
    materialName: '指纹',
    Mtype: '样本',
    Mnumbers: '2',
    Mspecifications: '份',
    Mdate: '接收时间',
    Mnature: '原件',
    Mdeal: '存档',
    Mbeizhu: '这是一条备注',
    Mfile: '文件',
  },
];
const MtableData1 = [
  {
    key: '1',
    samplet: 'BFAF23213',
    samplingt: '血痕',
    special: '是',
    PacName: '张三',
    appellation: '儿子',
    handling: '存档',
    Aremarks: '这是一个备注',
  },
];
const MtableData2 = [
  {
    key: '1',
    Bnumber: '苏A123456',
    Chassis: 'BFF23232',
    Engine: 'GRER23232',
    VehicleType: '小型汽车',
    Bhandling: '存档',
    Bremarks: '这是一条备注',
  },
];
const PtableData = [
  {
    key: '1',
    Pname: '張山',
    Pnational: '汉',
    Psex: '男',
    Page: '18',
    Paddress: '江苏南京',
    idcard: '123456789',
    PcontactEr: '李四',
    Ptelephone: '123489655',
    Premarks: '这是一条备注备注',
  },
  {
    key: '2',
    Pname: '張三',
    Pnational: '汉',
    Psex: '女',
    Page: '25',
    Paddress: '江苏南京',
    idcard: '123456789',
    PcontactEr: '李三',
    Ptelephone: '123489655',
    Premarks: '这是一条备注备注',
  },
];
const CtableData = [
  {
    key: '1',
    Cname: '奥迪',
    CType: 'RS5',
    Cbrand: '奥迪',
    Ccode: 'CERF444',
    Caddress: '江苏南京',
    CcontactEr: '张三',
    Ctelephone: '1556464655',
    Cremarks: '这是一条备注',
  },
  {
    key: '2',
    Cname: '奥迪',
    CType: 'RS7',
    Cbrand: '奥迪',
    Ccode: 'CERF44894',
    Caddress: '江苏南京',
    CcontactEr: '李四',
    Ctelephone: '15566664655',
    Cremarks: '这是一条备注',
  },
];
const TtableData = [
  {
    key: '1',
    Tname: '指纹',
    TcontactEr: '王二',
    Ttelephone: '1815564646',
    Tremarks: '这是一条备注',
  },
  {
    key: '2',
    Tname: '压痕',
    TcontactEr: '李二',
    Ttelephone: '18223904646',
    Tremarks: '这是一条备注',
  },
];
const ChargeTableData = [
  {
    key: '1',
    ChargeProjects: '收费项目',
    ChargeType: '收费类型',
    Cnumber: '2',
    Cprice: '188',
    Cpreferential: '22',
    Receivable: '166',
    remarks: '这是一个备注',
  },
];

const tabList = [
  {
    key: 'tab1',
    tab: '人',
  },
  {
    key: 'tab2',
    tab: '车',
  },
  {
    key: 'tab3',
    tab: '物',
  },
];

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class EdietCaseForm extends PureComponent {
  state = {
    width: '100%',
    key: 'tab1',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

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
        // submit the values
        dispatch({
          type: 'form/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      submitting,
    } = this.props;
    const { width, key } = this.state;
    const { TextArea } = Input;

    const contentList = {
      tab1: getFieldDecorator('members11', { initialValue: PtableData })(<PIdentified />),
      tab2: getFieldDecorator('members12', { initialValue: CtableData })(<CIdentified />),
      tab3: getFieldDecorator('members13', { initialValue: TtableData })(<TIdentified />),
    };
    return (
      <PageHeaderWrapper title="案件修改" wrapperClassName={styles.advancedForm}>
        <Card title="鉴定信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.category}>
                  {getFieldDecorator('category', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '亲子鉴定',
                  })(
                    <Select placeholder="请选择专业类别" disabled>
                      {categorys}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.wdate}>
                  {getFieldDecorator('wdate', {
                    rules: [{ required: true, message: '请选择委托日期' }],
                    initialValue: moment('2018/11/1', 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.proceTime}>
                  {getFieldDecorator('proceTime', {
                    rules: [{ required: true, message: '请选择受理日期' }],
                    initialValue: moment('2018/11/12', 'YYYY/MM/DD'),
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.ldate}>
                  {getFieldDecorator('ldate', {
                    rules: [{ required: true, message: '请输入落案时间' }],
                    initialValue: '5',
                  })(
                    <Input style={{ width: '100%' }} addonAfter="个工作日" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.caseMark}>
                  {getFieldDecorator('caseMark', {
                    rules: [{ required: true, message: '请选择案件标志' }],
                    initialValue: '病鉴字',
                  })(<Select placeholder="请选择案件标志">{caseMarks}</Select>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.aseNumber}>
                  {getFieldDecorator('aseNumber', {
                    rules: [{ required: true, message: '案例编号' }],
                    initialValue: 'ZF201811010',
                  })(
                    <Select placeholder="请选择" disabled>
                      <Option value="2">请选择</Option>
                      <Option value="0">手动生成</Option>
                      <Option value="1">自动生成</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {(() => {
              switch (getFieldValue(`aseNumber`)) {
                case `0`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.caseNumber}>
                          {getFieldDecorator('caseNumber', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                case `1`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.caseNumber}>
                          {getFieldDecorator('caseNumber', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请点击自动生成" />)}
                          <Button>自动生成</Button>
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
        <Card title="委托信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.chistory}>
                  {getFieldDecorator('chistory', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: '否',
                  })(
                    <Select placeholder="请选择">
                      <Option value="0">是</Option>
                      <Option value="1">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.delegateType}>
                  {getFieldDecorator('delegateType', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '单位',
                  })(
                    <Select placeholder="请选择">
                      <Option value="ge">个人</Option>
                      <Option value="dan">单位</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.delegateUnit}>
                  {getFieldDecorator('delegateUnit', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: '中国平安',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.contactEr}>
                  {getFieldDecorator('contactEr', {
                    rules: [{ required: true, message: '请输入联系人姓名' }],
                    initialValue: '张三',
                  })(<Input placeholder="请输入联系人姓名" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.telephone}>
                  {getFieldDecorator('telephone', {
                    rules: [{ required: true, message: '请输入电话号码' }],
                    initialValue: '1586546483',
                  })(<Input placeholder="请输入电话号码" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.address}>
                  {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请输入联系地址' }],
                    initialValue: '江苏南京',
                  })(<Input placeholder="请输入联系地址" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.Yavoid}>
                  {getFieldDecorator('Yavoid', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '是',
                  })(
                    <Select placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.Yurgent}>
                  {getFieldDecorator('Yurgent', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '是',
                  })(
                    <Select placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.Ycomplete}>
                  {getFieldDecorator('Ycomplete', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '是',
                  })(
                    <Select placeholder="请选择">
                      <Option value="1">是</Option>
                      <Option value="0">否</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.MubanType}>
                  {getFieldDecorator('MubanType', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '样本模板',
                  })(
                    <Select placeholder="请选择">
                      <Option value="1">模板1</Option>
                      <Option value="0">模板2</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.FirsrSurveyor}>
                  {getFieldDecorator('FirsrSurveyor', {
                    rules: [{ required: true, message: '请输入鉴定人姓名' }],
                    initialValue: '李四',
                  })(<Input placeholder="请输入鉴定人姓名" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={fieldLabels.SecondSurveyor}>
                  {getFieldDecorator('SecondSurveyor', {
                    rules: [{ required: true, message: '请输入鉴定人姓名' }],
                    initialValue: '王五',
                  })(<Input placeholder="请输入鉴定人姓名" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.ZDremarks}>
                  {getFieldDecorator('ZDremarks', {
                    rules: [{ required: true, message: '请输入检案摘要' }],
                    initialValue:
                      '据送检资料记载：委托方对送检的XXXX材料上的XXXXX签名/公章印文真实性存疑，故委托本机构协助查明其事实真相。',
                  })(
                    <TextArea placeholder="请输入检案摘要" autosize={{ minRows: 4, maxRows: 8 }} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={fieldLabels.Jremarks}>
                  {getFieldDecorator('Jremarks', {
                    rules: [{ required: false, message: '备注' }],
                    initialValue: '这是一条备注',
                  })(<TextArea placeholder="备注" autosize={{ minRows: 4, maxRows: 8 }} />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24} />
            </Row>
          </Form>
        </Card>
        <Card title="报告寄回地址" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={fieldLabels.disbursement}>
                  {getFieldDecorator('disbursement', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: '邮寄',
                  })(
                    <Select placeholder="邮寄">
                      <Option value="r1">邮寄</Option>
                      <Option value="r2">自取</Option>
                      <Option value="r3">送达</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {(() => {
              switch (getFieldValue(`disbursement`)) {
                case `r1`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.recipient}>
                          {getFieldDecorator('recipient', {
                            rules: [{ required: true, message: '请输入收件人姓名' }],
                          })(<Input placeholder="请输入收件人姓名" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label={fieldLabels.Raddress}>
                          {getFieldDecorator('Raddress', {
                            rules: [{ required: true, message: '请输入邮寄地址' }],
                          })(<Input placeholder="请输入邮寄地址" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.elephone}>
                          {getFieldDecorator('elephone', {
                            rules: [{ required: true, message: '请输入联系方式' }],
                          })(<Input placeholder="请输入联系方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                case `r2`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.hetongfuben}>
                          {getFieldDecorator('hetongfuben', {
                            rules: [{ required: true, message: '请输入' }],
                          })(
                            <Select placeholder="请选择">
                              <Option value="r0">请选择</Option>
                              <Option value="r1">凭合同副本</Option>
                              <Option value="r2">票据</Option>
                              <Option value="r3">身份证</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                case `r3`:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.songdadiz}>
                          {getFieldDecorator('songdadiz', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label={fieldLabels.songdajies}>
                          {getFieldDecorator('songdajies', {
                            rules: [{ required: true, message: '请输入' }],
                          })(<Input placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                default:
                  return (
                    <Row gutter={16}>
                      <Col lg={6} md={12} sm={24}>
                        <Form.Item label={fieldLabels.recipient}>
                          {getFieldDecorator('recipient', {
                            rules: [{ required: true, message: '请输入收件人姓名' }],
                            initialValue: '老刘',
                          })(<Input placeholder="请输入收件人姓名" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label={fieldLabels.Raddress}>
                          {getFieldDecorator('Raddress', {
                            rules: [{ required: true, message: '请输入邮寄地址' }],
                            initialValue: '江苏南京',
                          })(<Input placeholder="请输入邮寄地址" />)}
                        </Form.Item>
                      </Col>
                      <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item label={fieldLabels.elephone}>
                          {getFieldDecorator('elephone', {
                            rules: [{ required: true, message: '请输入联系方式' }],
                            initialValue: '156486461231',
                          })(<Input placeholder="请输入联系方式" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  );
              }
            })()}
          </Form>
        </Card>
        <Card title="鉴定事项" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: AtableData,
          })(<Appraisement />)}
        </Card>
        <Card
          style={{ width: '100%' }}
          title="被鉴定对象"
          tabList={tabList}
          activeTabKey={key}
          onTabChange={keys => {
            this.onTabChange(keys, 'key');
          }}
        >
          {contentList[key]}
        </Card>
        {(() => {
          switch (getFieldValue(`category`)) {
            case `qing`:
              return (
                <Card title="鉴定材料" bordered={false}>
                  {getFieldDecorator('memberss1', {
                    initialValue: MtableData1,
                  })(<PaCmaterial />)}
                </Card>
              );
            case `che`:
              return (
                <Card title="鉴定材料" bordered={false}>
                  {getFieldDecorator('memberss2', {
                    initialValue: MtableData2,
                  })(<CarMmaterial />)}
                </Card>
              );
            default:
              return (
                <Card title="鉴定材料" bordered={false}>
                  {getFieldDecorator('memberss', {
                    initialValue: MtableData,
                  })(<Material />)}
                </Card>
              );
          }
        })()}
        <Card title="收费说明" bordered={false}>
          {getFieldDecorator('members14', {
            initialValue: ChargeTableData,
          })(<ChargeTable />)}
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            保存
          </Button>
          <Button type="primary" onClick={this.validate} loading={submitting}>
            保存并提交审核
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default EdietCaseForm;
