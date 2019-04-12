import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Modal, message, Table } from 'antd';
import StandardTable from '@/components/StandardTable/datas';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

const confirms = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const experimental = ['未上传', '已上传', '部分上传'];
const experResult = ['肯定', '否定', '需加位点', '检测不出结果'];
const confState = ['已确认', '待确认'];

/* eslint react/no-multi-comp:0 */
@connect(({ exper, loading }) => ({
  exper,
  loading: loading.models.exper,
}))
@Form.create()
class LabExperiment extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '实验编号',
      dataIndex: 'id',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showModal()}>{record.id}</a>
        </Fragment>
      ),
    },
    {
      title: '案例编号',
      dataIndex: 'case_number',
      align: 'center',
    },
    {
      title: '委托人',
      dataIndex: 'client',
      align: 'center',
    },
    {
      title: '实验数据',
      dataIndex: 'experimental',
      align: 'center',
      render(val) {
        const experiment = `${experimental[val]}`;
        return experiment;
      },
    },
    {
      title: '实验结果',
      dataIndex: 'experResult',
      align: 'center',
      render(val) {
        const conf = `${experResult[val]}`;
        return conf;
      },
      // render: val => `${val} `,
    },
    {
      title: '确认状态',
      dataIndex: 'confState',
      align: 'center',
      render(val) {
        const conf = `${confState[val]}`;
        return conf;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'exper/fetch',
    });
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
      type: 'exper/fetch',
      payload: params,
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
          type: 'exper/remove',
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'exper/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
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
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'exper/fetch',
        payload: values,
      });
    });
  };

  showConfirm = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const conte = '您将删除实验编号为   ';
    const conten = '    的数据！';
    const html1 = selectedRows.map(row => row.case_number);
    const contents = conte + html1 + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要删除数据吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'exper/remove',
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

  showConfirms = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    const conte = '您将修改实验编号为   ';
    const conten = '    的数据！';
    const html1 = selectedRows.map(row => row.case_number);
    const contents = conte + html1 + conten;
    if (!selectedRows) return;
    confirms({
      title: '确定要修改数据状态吗?',
      content: contents,
      onOk() {
        dispatch({
          type: 'exper/update',
          payload: {
            key: selectedRows.map(row => row.key),
            confState: '0',
          },
        });
        message.success('修改成功');
      },
      onCancel() {
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
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

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mana/add',
      payload: {
        id: fields.id,
        reagent: fields.reagent,
        appraiser: fields.appraiser,
        experimental: fields.experimental,
        fileStatus: fields.fileStatus,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验编号">
              {getFieldDecorator('id')(<Input placeholder="请输入实验编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('case_number')(<Input placeholder="请输入案例编号"/>)}
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
                展开 <Icon type="down"/>
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="实验编号">
              {getFieldDecorator('id')(<Input placeholder="请输入实验编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="案例编号">
              {getFieldDecorator('case_number')(<Input placeholder="请输入案例编号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="&nbsp;&nbsp;&nbsp;委托人">
              {getFieldDecorator('client')(<Input placeholder="请输入委托人"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="实验数据">
              {getFieldDecorator('experimental')(
                <Select allowClear placeholder="请选择" style={{ width: '10,100%' }}>
                  <Option value="0">未上传</Option>
                  <Option value="1">已上传</Option>
                  <Option value="2">部分上传</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="实验结果">
              {getFieldDecorator('experResult')(
                <Select allowClear placeholder="请选择" style={{ width: '10,100%' }}>
                  <Option value="0">肯定</Option>
                  <Option value="1">否定</Option>
                  <Option value="2">需加位点</Option>
                  <Option value="3">检测不出结果</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="确认状态">
              {getFieldDecorator('confState')(
                <Select allowClear placeholder="请选择" style={{ width: '10,100%' }}>
                  <Option value="0">已确认</Option>
                  <Option value="1">待确认</Option>
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
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      exper: { data },
      loading,
    } = this.props;
    const { selectedRows, visible, confirmLoading } = this.state;

    const columns = [];
    columns.push(
      {
        title: '基因位点',
        className: 'Allele',
        dataIndex: 'Allele',
        key: 'Allele',
        width: 150,
      },
      {
        title: '父亲',
        dataIndex: 'Commentf',
        className: 'Commentf',
        key: 'Commentf',
        width: 150,
      },
      {
        title: '孩子',
        dataIndex: 'Comments',
        className: 'Comments',
        key: 'Comments',
        width: 150,
      },
    );
    const dataSource = [];
    dataSource.push(
      {
        key: 'D001',
        Allele: 'vWA    B',
        Commentf: '16,16',
        Comments: '16,16',
      },
      {
        key: 'D002',
        Allele: 'D7S820  B',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D003',
        Allele: 'D7S820  C',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D004',
        Allele: 'D7S820  D',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D005',
        Allele: 'D7S820  E',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D006',
        Allele: 'D7S820  F',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D007',
        Allele: 'D7S820  G',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D008',
        Allele: 'D7S820  H',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D009',
        Allele: 'D7S820  I',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0010',
        Allele: 'D7S820  J',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0011',
        Allele: 'D7S820  K',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0012',
        Allele: 'D7S820  L',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0013',
        Allele: 'D7S820  M',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0014',
        Allele: 'D7S820  N',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0015',
        Allele: 'D7S820  O',
        Commentf: '10,10',
        Comments: '16,16',
      },
      {
        key: 'D0016',
        Allele: 'D7S820  P',
        Commentf: '10,10',
        Comments: '16,16',
      },
    );
    return (
      <PageHeaderWrapper title="实验数据">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                  <Button onClick={this.showModal}
                          disabled={selectedRows.length === 0 || selectedRows.length > 1}>查看实验数据</Button>
                  <Button onClick={this.showConfirms} disabled={selectedRows.length === 0}>确认否定结果</Button>
                  <Button type="danger" onClick={this.showConfirm} disabled={selectedRows.length === 0}>删除实验数据</Button>
                </span>
              <Modal
                width="50%"
                title="查看数据"
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
              >
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  bordered
                  align="center"
                  pagination={false}
                  scroll={{ y: 350 }}
                  showHeader
                />
                ,
              </Modal>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LabExperiment;
