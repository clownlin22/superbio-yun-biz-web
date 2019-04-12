import React, { Component, Fragment } from 'react';

import { connect } from 'dva';
import Bind from 'lodash-decorators/bind';
import Debounce from 'lodash-decorators/debounce';

import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Input,
  DatePicker,
  Tooltip,
  Steps,
  Button,
  Popover,
  Badge,
} from 'antd';
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from '@/components/Charts';
import Trend from '@/components/Trend';
import classNames from 'classnames';
import NumberInfo from '@/components/NumberInfo';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';
import { getTimeDistance } from '@/utils/utils';

import styles from './Analysis.less';
import styless from './Analysiss.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

@connect(({ charts, loading }) => ({
  charts,
  loading: loading.effects['charts/fetch'],
}))
class Analysis extends Component {
  constructor(props) {
    super(props);
    this.rankingListData = [];
    for (let i = 0; i < 7; i += 1) {
      this.rankingListData.push({
        title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
        total: 323234,
      });
    }
  }

  state = {
    salesType: 'all',
    currentTabKey: '',
    stepDirection: 'vertical',
    rangePickerValue: getTimeDistance('year'),
    loading: true,
    displayName: 'none',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'charts/fetch',
      });
      dispatch({
        type: 'profile/fetchAdvanced',
      });
      this.setStepDirection();
      window.addEventListener('resize', this.setStepDirection, { passive: true });

      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
    const { dispatch } = this.props;
    dispatch({
      type: 'charts/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 100) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'vertical' && w > 100) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  showModal = () => {
    this.setState({
      displayName: 'block',
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'charts/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'charts/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  }

  render() {
    const { rangePickerValue, salesType, loading: stateLoading, currentTabKey } = this.state;
    const { charts, loading: propsLoading } = this.props;
    const {
      visitData,
      salesData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = charts;
    const loading = propsLoading || stateLoading;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
      </Row>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
    const { stepDirection, displayName } = this.state;
    const popoverContent = (
      <div style={{ width: 160 }}>
        吴加号
        <span className={styless.textSecondary} style={{ float: 'top' }}>
          <Badge
            status="default"
            text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>}
          />
        </span>
        <div className={styless.textSecondary} style={{ marginTop: 4 }}>
          耗时：2小时25分钟
        </div>
      </div>
    );
    const desc1 = (
      <div className={classNames(styless.textSecondary, styless.stepDescription)}>
        <Fragment>
          王帅
          <Icon type="dingding-o" style={{ marginLeft: 8 }} />
        </Fragment>
        <div>2016-12-12 12:32</div>
      </div>
    );
    const desc2 = (
      <div className={classNames(styless.textSecondary, styless.stepDescription)}>
        <Fragment>
          王帅
          <Icon type="dingding-o" style={{ marginLeft: 8 }} />
        </Fragment>
        <div>2016-12-12 12:40</div>
      </div>
    );
    const desc3 = (
      <div className={styless.stepDescription}>
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
        <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
          {dot}
        </Popover>
      ) : (
        dot
      );
    return (
      <GridContent>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={
                <FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              loading={loading}
              total={() => <Yuan>126560</Yuan>}
              footer={
                <Field
                  label={
                    <FormattedMessage id="app.analysis.day-sales" defaultMessage="Day Sales" />
                  }
                  value={`￥${numeral(12423).format('0,0')}`}
                />
              }
              contentHeight={46}
            >
              <Trend flag="up" style={{ marginRight: 16 }}>
                <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
                <span className={styles.trendText}>12%</span>
              </Trend>
              <Trend flag="down">
                <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
                <span className={styles.trendText}>11%</span>
              </Trend>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={<FormattedMessage id="app.analysis.visits" defaultMessage="visits" />}
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={
                <Field
                  label={
                    <FormattedMessage id="app.analysis.day-visits" defaultMessage="Day Visits" />
                  }
                  value={numeral(1234).format('0,0')}
                />
              }
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              title={<FormattedMessage id="app.analysis.payments" defaultMessage="Payments" />}
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(4565).format('0,0')}
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    <FormattedMessage id="app.analysis.week" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    <FormattedMessage id="app.analysis.day" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniBar data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              loading={loading}
              bordered={false}
              title={
                <FormattedMessage
                  id="app.analysis.operational-effect"
                  defaultMessage="Operational Effect"
                />
              }
              action={
                <Tooltip
                  title={
                    <FormattedMessage id="app.analysis.introduce" defaultMessage="introduce" />
                  }
                >
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              footer={
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <Trend flag="up" style={{ marginRight: 16 }}>
                    <FormattedMessage id="app.analysis.week" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>12%</span>
                  </Trend>
                  <Trend flag="down">
                    <FormattedMessage id="app.analysis.day" defaultMessage="Weekly changes" />
                    <span className={styles.trendText}>11%</span>
                  </Trend>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
            </ChartCard>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane
                tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
                key="sales"
              >
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={450}
                        title={
                          <FormattedMessage
                            id="app.analysis.sales-trend"
                            defaultMessage="Sales Trend"
                          />
                        }
                        data={salesData}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <Card
                      loading={loading}
                      className={styles.salesCard}
                      bordered={false}
                      title={
                        <FormattedMessage
                          id="app.analysis.the-proportion-of-sales"
                          defaultMessage="The Proportion of Sales"
                        />
                      }
                      bodyStyle={{ padding: 24 }}
                      style={{ marginTop: 24, minHeight: 509 }}
                    >
                      <Pie
                        hasLegend
                        subTitle={
                          <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
                        }
                        total={() => (
                          <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>
                        )}
                        data={salesPieData}
                        valueFormat={value => <Yuan>{value}</Yuan>}
                        height={248}
                        lineWidth={4}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        {/* ok */}

        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
          <Card loading={loading} className={styles.offlineCard} bordered>
            <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
              {offlineData.map(shop => (
                <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey} />} key={shop.name}>
                  <TimelineChart
                    height={450}
                    data={offlineChartData}
                    titleMap={{
                      y1: formatMessage({ id: 'app.analysis.traffic' }),
                      y2: formatMessage({ id: 'app.analysis.payments' }),
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>

        <Col xl={8} lg={12} md={12} sm={24} xs={24}>
          <Card
            loading={loading}
            className={styles.salesCard1}
            bordered={false}
            title={<FormattedMessage id="app.analysis.the-proportion-of-select" />}
            bodyStyle={{ padding: 24 }}
            style={{ minHeight: 660 }}
          >
            <Input style={{ width: '70%' }} placeholder="请输入案例编号" />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.showModal}>
              查询
            </Button>
            <div style={{ background: '#fff', paddingTop: '20px', display: displayName }}>
              <Steps direction={stepDirection} progressDot={customDot} current={2}>
                <Step title="案例登记" description={desc1} />
                <Step title="案例审核" description={desc2} />
                <Step title="实验中" description={desc3} />
                <Step title="出报告" />
                <Step title="报告邮寄" />
                <Step title="完成" />
              </Steps>
            </div>
          </Card>
        </Col>
      </GridContent>
    );
  }
}

export default Analysis;
