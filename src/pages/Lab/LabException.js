import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  DatePicker,
  Dropdown,
  Icon,
  Table,
  Menu,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TableList.less';

const confirms = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const exceptionState = ['未处理', '标记正常', '删除数据'];
const exceptionDes = ['交叉对比有误', '历史数据比对有误', '样本两次结果不一致'];

/* eslint react/no-multi-comp:0 */
@connect(({ exce, loading }) => ({
  exce,
  loading: loading.models.exce,
}))
@Form.create()
class LabException extends PureComponent {
  state = {
    visible: false,
    confirmLoading: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '案例编号',
      dataIndex: 'caseNumber',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showModal()}>{record.caseNumber}</a>
        </Fragment>
      ),
    },
    {
      title: '比对样本',
      dataIndex: 'comparison',
      align: 'center',
    },
    {
      title: '历史样本',
      dataIndex: 'historical',
      align: 'center',
    },
    {
      title: '异常发生日期',
      dataIndex: 'abnormalDate',
      align: 'center',
    },
    {
      title: '异常说明',
      dataIndex: 'exceptionDes',
      align: 'center',
      render(val) {
        const except = `${exceptionDes[val]}`;
        return except;
      },
    },
    {
      title: '异常状态',
      dataIndex: 'exceptionState',
      align: 'center',
      render(val) {
        const exception = `${exceptionState[val]}`;
        return exception;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exce/fetch',
    });
    this.handleSearchs();
  }

  handleStandardTableChange = (pagination, filtersArg) => {
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

    dispatch({
      type: 'exce/fetch',
      payload: params,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const conte = '您将删除案例编号为';
    const conten = '的数据！';
    const rowCaseNumber = selectedRows.map(row => row.caseNumber);
    const contents = conte + rowCaseNumber + conten;

    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'exce/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
        });
        message.success('删除成功');
      },
      onCancel() {
      },
    });
  };

  handleUpdate = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'exce/update',
      payload: {
        key: selectedRows.map(row => row.key),
        exceptionState: '1',
      },
    });
    message.success('修改成功');
    this.handleSearchs();
  };

  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const conte = '您将修改案例编号为   ';
    const conten = '    的数据！';
    const rowId = selectedRows.map(row => row.caseNumber);
    const contents = conte + rowId + conten;
    confirms({
      title: '确定要修改数据状态吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'exce/update',
          payload: {
            key: selectedRows.map(row => row.key),
            exceptionState: '1',
          },
        });
        message.success('修改成功');
      },
      onCancel() {
      },
    });
    this.handleFormReset();
  };

  handleOkVis = () => {
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.handleSearchs();
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        abnormalDate: fieldsValue.abnormalDate && fieldsValue.abnormalDate.format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'exce/fetch',
        payload: values,
      });
    });
  };

  handleSearchs = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.abnormalDate && fieldsValue.abnormalDate.format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'exce/fetch',
        payload: values,
      });
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('caseNumber')(
                <Input style={{ width: '100%' }} placeholder="请输入案例编号"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="异常发生日期">
              {getFieldDecorator('abnormalDate')(
                <DatePicker
                  style={{ width: '100%' }}
                  allowClear
                  placeholder="请输入异常发生日期"
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="异常说明">
              {getFieldDecorator('exceptionDes')(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">交叉比对有误</Option>
                  <Option value="1">历史数据比对有误</Option>
                  <Option value="2">样本两次结果不一致</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="异常状态">
              {getFieldDecorator('exceptionState', {
                initialValue: '0',
              })(
                <Select allowClear placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未处理</Option>
                  <Option value="1">标记正常</Option>
                  <Option value="2">删除数据</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderAdvancedForm();
  }

  render() {
    const { visible, confirmLoading } = this.state;

    const {
      exce: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu selectedKeys={[]}>
        <Menu.Item disabled>删除实验数据</Menu.Item>
        <Menu.Item disabled>标记正常</Menu.Item>
      </Menu>
    );
    const menus = (
      <Menu selectedKeys={[]}>
        <Menu.Item onClick={this.showConfirm}>删除实验数据</Menu.Item>
        <Menu.Item onClick={this.showConfirms}>标记正常</Menu.Item>
      </Menu>
    );
    const dataSources = [
      {
        key: 1,
        name: '样本编号.',
        age: 'Z201811080900F',
        address: 'Z201811080900S',
        children: [
          {
            key: 11,
            name: '姓名',
            age: '张三',
            address: '李四',
          },
          {
            key: 12,
            name: '身份证',
            age: '320322199901020025',
            address: '320322199901020026',
          },
          {
            key: 13,
            name: '性别',
            age: '男',
            address: '女',
          },
        ],
      },
    ];

    const columnss = [
      {
        title: '实验数据',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: ' ',
        dataIndex: 'age',
        key: 'age',
        width: '30%',
      },
      {
        title: ' ',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
      },
    ];

    const columns = [];
    columns.push(
      {
        title: '  ',
        className: 'Allele',
        dataIndex: 'Allele',
        key: 'Allele',
        width: 150,
      },
      {
        title: 'D20180921734',
        dataIndex: 'Commentf',
        className: 'Commentf',
        key: 'Commentf',
        width: 150,
      },
      {
        title: 'D20180584758',
        dataIndex: 'Comments',
        className: 'Comments',
        key: 'Comments',
        width: 150,
      },
    );
    const dataSource = [];
    dataSource.push(
      {
        key: '0001',
        Allele: 'vWA    B',
        Commentf: '16,16',
        Comments: '16,16',
      },
      {
        key: '0002',
        Allele: 'D7S820  B',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0003',
        Allele: 'D7S820  C',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0004',
        Allele: 'D7S820  D',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0005',
        Allele: 'D7S820  E',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0006',
        Allele: 'D7S820  F',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0007',
        Allele: 'D7S820  G',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0008',
        Allele: 'D7S820  H',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '0009',
        Allele: 'D7S820  I',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00010',
        Allele: 'D7S820  J',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00011',
        Allele: 'D7S820  K',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00012',
        Allele: 'D7S820  L',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00013',
        Allele: 'D7S820  N',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00014',
        Allele: 'D7S820  O',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00015',
        Allele: 'D7S820  P',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: '00016',
        Allele: 'D7S820  Q',
        Commentf: '10,10',
        Comments: '16,16',
      },
    );

    return (
      <PageHeaderWrapper title="异常处理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button onClick={this.showModal}
                      type="primary"
                      disabled={selectedRows.length !== 1}>查看数据</Button>
              <Button onClick={this.showConfirm}
                      type="danger"
                      disabled={selectedRows.length === 0}>删除实验数据</Button>
              <Button onClick={this.showConfirms}
                      disabled={selectedRows.length === 0}>标记正常</Button>
              <Modal
                width="50%"
                title="查看数据"
                visible={visible}
                onOk={this.handleOkVis}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
              >
                <Table
                  columns={columnss}
                  dataSource={dataSources}
                  align="center"
                  defaultExpandAllRows
                  pagination={false}
                />
                ,
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  bordered
                  align="center"
                  pagination={false}
                  scroll={{ y: 200 }}
                  showHeader
                />
              </Modal>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleSearch}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LabException;
