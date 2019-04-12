import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Steps, Card, Popover, Table } from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AdvancedProfile.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const action = (
  <Fragment>
    <ButtonGroup>
      <Button>审核通过</Button>
      <Button>审核未通过</Button>
    </ButtonGroup>
  </Fragment>
);

const extra = (
  <Row>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>状态</div>
      <div className={styles.heading}>待审核</div>
    </Col>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>订单金额</div>
      <div className={styles.heading}>¥ 500.00</div>
    </Col>
  </Row>
);

const description = (
  <DescriptionList className={styles.headerList} size="small" col="3">
    <Description term="联系人">旺旺</Description>
    <Description term="委托单位">旺旺医学股份</Description>
    <Description term="联系电话">18206182000</Description>

    <Description term="送检人">王帅</Description>
    <Description term="送检人电话">18206183000</Description>
    <Description term="案例类型">一般案例</Description>

    <Description term="委托方类型">单位</Description>
  </DescriptionList>
);

const tabList = [
  {
    key: 'detail',
    tab: '详情',
  },
];

const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      王帅
      <Icon type="dingding-o" style={{ marginLeft: 8 }} />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);

const desc2 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      王帅
      <Icon type="dingding-o" style={{ marginLeft: 8 }} />
    </Fragment>
    <div>2016-12-12 12:40</div>
  </div>
);

const desc3 = (
  <div className={styles.stepDescription}>
    <Fragment>
      袁亮
      <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
    </Fragment>
    <div>
      <a href="">催一下</a>
    </div>
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter>
      {dot}
    </Popover>
  ) : (
    dot
  );

const operationTabList = [
  {
    key: 'tab1',
    tab: '鉴定事项',
  },
];

const operationTabList3 = [
  {
    key: 'tab3',
    tab: '鉴定材料',
  },
];

const operationTabList4 = [
  {
    key: 'tab6',
    tab: '收费说明',
  },
];
const operationTabList2 = [
  {
    key: 'tab2',
    tab: '被鉴定对象(人)',
  },
  {
    key: 'tab4',
    tab: '被鉴定对象(车)',
  },
  {
    key: 'tab5',
    tab: '被鉴定对象(物)',
  },
];

const columns = [
  {
    title: '委托事项',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '细项',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '数量',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '备注',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
];

const columnss = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '民族',
    dataIndex: 'minzu',
    key: 'minzu',
  },
  {
    title: '对象类型',
    dataIndex: 'dxlx',
    key: 'dxlx',
  },
  {
    title: '性别',
    dataIndex: 'six',
    key: 'six',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '家庭住址',
    dataIndex: 'zhuzhi',
    key: 'zhuzhi',
  },
  {
    title: '身份证号',
    dataIndex: 'idCode',
    key: 'idCode',
  },
  {
    title: '联系人',
    dataIndex: 'phoneuser',
    key: 'phoneuser',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '备注',
    dataIndex: 'beizhu',
    key: 'beizhu',
  },
];

const columnssw = [
  {
    title: '名称',
    dataIndex: 'mc',
    key: 'mc',
  },
  {
    title: '对象类型',
    dataIndex: 'dxlx',
    key: 'dxlx',
  },
  {
    title: '联系人',
    dataIndex: 'lxr',
    key: 'lxr',
  },
  {
    title: '联系电话',
    dataIndex: 'lxdh',
    key: 'lxdh',
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
  },
];

const columnssc = [
  {
    title: '名称',
    dataIndex: 'mc',
    key: 'mc',
  },
  {
    title: '车辆类型',
    dataIndex: 'cllx',
    key: 'cllx',
  },
  {
    title: '对象类型',
    dataIndex: 'dxlx',
    key: 'dxlx',
  },
  {
    title: '品牌',
    dataIndex: 'pp',
    key: 'pp',
  },
  {
    title: '车辆识别代码',
    dataIndex: 'clsbdm',
    key: 'clsbdm',
  },
  {
    title: '停放地点',
    dataIndex: 'tfdd',
    key: 'tfdd',
  },
  {
    title: '联系人',
    dataIndex: 'lxr',
    key: 'lxr',
  },
  {
    title: '联系电话',
    dataIndex: 'lxdh',
    key: 'lxdh',
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
  },
];

const columnsss = [
  {
    title: '鉴定材料',
    dataIndex: 'cl',
    key: 'cl',
  },
  {
    title: '类型',
    dataIndex: 'lx',
    key: 'lx',
  },
  {
    title: '数量',
    dataIndex: 'sl',
    key: 'sl',
  },
  {
    title: '规格',
    dataIndex: 'gg',
    key: 'gg',
  },
  {
    title: '接收时间',
    dataIndex: 'jssj',
    key: 'jssj',
  },
  {
    title: '材料性质',
    dataIndex: 'clxz',
    key: 'clxz',
  },
  {
    title: '处理方式',
    dataIndex: 'clfs',
    key: 'clfs',
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
  },
  {
    title: '文件',
    dataIndex: 'wj',
    key: 'wj',
  },
];

const sfsm = [
  {
    title: '收费项目',
    dataIndex: 'sfxm',
    key: 'sfxm',
  },
  {
    title: '收费类别',
    dataIndex: 'sflb',
    key: 'sflb',
  },
  {
    title: '单价',
    dataIndex: 'dj',
    key: 'dj',
  },
  {
    title: '优惠金额',
    dataIndex: 'yhje',
    key: 'yhje',
  },
  {
    title: '应收小计',
    dataIndex: 'ysxj',
    key: 'ysxj',
  },
  {
    title: '备注',
    dataIndex: 'bz',
    key: 'bz',
  },
];

@connect(({ profiles, loading }) => ({
  profiles,
  loading: loading.effects['profiles/fetchAdvanced'],
}))
class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    operationkey2: 'tab2',
    operationkey3: 'tab5',
    operationkey4: 'tab6',
    stepDirection: 'vertical',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profiles/fetchAdvanced',
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  onOperationTabChange2 = key => {
    this.setState({ operationkey2: key });
  };

  onOperationTabChange3 = key => {
    this.setState({ operationkey3: key });
  };

  onOperationTabChange4 = key => {
    this.setState({ operationkey4: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 100) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 100) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { stepDirection, operationkey, operationkey2, operationkey3, operationkey4 } = this.state;
    const { profiles, loading } = this.props;
    const {
      advancedOperation1,
      advancedOperation2,
      advancedOperation6,
      advancedOperation3,
      advancedOperation4,
      advancedOperation5,
    } = profiles;
    const contentList = {
      tab1: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation1}
          columns={columns}
        />
      ),
      tab2: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation2}
          columns={columnss}
        />
      ),
      tab4: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation4}
          columns={columnssc}
        />
      ),
      tab5: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation5}
          columns={columnssw}
        />
      ),
      tab3: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation3}
          columns={columnsss}
        />
      ),
      tab6: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation6}
          columns={sfsm}
        />
      ),
    };

    return (
      <PageHeaderWrapper
        title="订单编号：456784567"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra}
        tabList={tabList}
      >
        <Card title="流程进度" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={2}>
            <Step title="已下单" description={desc1} />
            <Step title="已支付" description={desc2} />
            <Step title="待审核" description={desc3} />
            <Step title="已采样" />
            <Step title="已检定" />
            <Step title="已出报告" />
            <Step title="待完成" />
          </Steps>
        </Card>

        <Card title="鉴定信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="案件编号">456784567</Description>
            <Description term="专业类别">文书鉴定</Description>
            <Description term="案件标志">文鉴字</Description>

            <Description term="委托时间">2018-10-08</Description>
            <Description term="受理时间">2018-10-09</Description>
            <Description term="落案时间">1个工作日</Description>
          </DescriptionList>
        </Card>

        <Card title="委托信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="联系人">旺旺</Description>
            <Description term="联系电话">18206182000</Description>
            <Description term="委托单位">旺旺医学股份</Description>

            <Description term="送检人">王帅</Description>
            <Description term="送检人电话">18206183000</Description>
            <Description term="案例类型">一般案例</Description>

            <Description term="委托方类型">单位</Description>
            <Description term="既往鉴定史">有</Description>
            <Description term="模板类型">文书鉴定类</Description>

            <Description term="第一鉴定人">张三</Description>
            <Description term="第二鉴定人">李四</Description>
            <Description term="鉴定助理">王五</Description>

            <Description term="是否回避">否</Description>
            <Description term="是否加急">否</Description>
            <Description term="材料齐全">是</Description>
            <Description term="联系人地址">江苏省南京市玄武区成贤大厦405</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="检案摘要">
              据送检资料记载：委托方对送检的XXXX材料上的XXXXX签名/公章印文真实性存疑，故委托本机构协助查明其事实真相。
            </Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="备注">这里是备注。</Description>
          </DescriptionList>
        </Card>

        <Card title="报告回寄地址" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="发放方式">邮寄</Description>
            <Description term="收件人">旺旺</Description>
            <Description term="电话号码">18206182000</Description>

            <Description term="邮寄地址">江苏省南京市玄武区成贤大厦405</Description>
          </DescriptionList>
        </Card>

        <Card
          style={{ marginBottom: 24 }}
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[operationkey]}
        </Card>

        <Card
          style={{ marginBottom: 24 }}
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList2}
          onTabChange={this.onOperationTabChange2}
        >
          {contentList[operationkey2]}
        </Card>

        <Card
          style={{ marginBottom: 24 }}
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList3}
          onTabChange={this.onOperationTabChange3}
        >
          {contentList[operationkey3]}
        </Card>

        <Card
          style={{ marginBottom: 24 }}
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList4}
          onTabChange={this.onOperationTabChange4}
        >
          {contentList[operationkey4]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
