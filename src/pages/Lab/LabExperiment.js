import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Upload,
  Input,
  Icon,
  message,
  DatePicker,
  Select,
  Button,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TableList.less';

const { Option } = Select;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const fileStatus = ['已完成', '未完成'];
const reagent = [
  {
    id: '0',
    value: '22NC',
  },{
    id: '1',
    value: 'AGCU_21+1',
  },{
    id: '2',
    value: 'MR20',
  },{
    id: '3',
    value: 'MR21',
  },{
    id: '4',
    value: 'MR23SP',
  },{
    id: '5',
    value: 'NC22plex',
  },{
    id: '6',
    value: 'PP21',
  },{
    id: '7',
    value: 'S20A(MR20)',
  },{
    id: '8',
    value: 'SUBO21',
  },{
    id: '9',
    value: 'global',
  }];
const appraiser = ['张三', '李四', '王五', '赵六', '周先生'];
const children = [];
children.push(
  <Option value="0" key="J1">
    张三
  </Option>,
  <Option value="1" key="J2">
    李四
  </Option>,
  <Option value="2" key="J3">
    王五
  </Option>,
  <Option value="3" key="J4">
    赵六
  </Option>,
  <Option value="4" key="J5">
    周先生
  </Option>
);

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="导入实验结果"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实验编号">
        {form.getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入实验编号！' }],
        })(<Input placeholder="请输入实验编号" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="试剂名称">
        {form.getFieldDecorator('reagent', {
          rules: [{ required: true, message: '请选择试剂名称！' }],
        })(
          <Select placeholder="试剂名称" style={{ maxWidth: 290, width: '100%' }}>
            {reagent.map(item => (
              <Option key={item.id} value={item.id}>{item.value}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="鉴定人">
        {form.getFieldDecorator('appraiser', {
          rules: [{ required: true, message: '最多选择2人！' }],
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="多选框">
            {children}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="上传文件">
        {form.getFieldDecorator('fileStatus', {
          rules: [{ required: false, message: '请上传文件！' }],
        })(
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            accept="application/zip"
            action=""
          >
            <Icon type="upload" /> 数据上传
          </Upload>
        )}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ mana, loading }) => ({
  mana,
  loading: loading.models.mana,
}))
@Form.create()
class LabData extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '实验编号',
      dataIndex: 'id',
      align:'center'
    },
    {
      title: '实验日期',
      dataIndex: 'ExperDate',
      align:'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '试剂名称',
      dataIndex: 'reagent',
      align:'center',
      render(val) {
        const category = reagent.filter(item => parseInt(item.id, 10) === parseInt(val, 10));
        return category.length > 0 ? category[0].value : val;
      },
    },
    {
      title: '鉴定人',
      dataIndex: 'appraiser',
      align:'center',
      render(val) {
        let html = '';
        const aa = ',';
        for (let i = 0; i < val.length; i += 1) {
          const num = val[i];
          const html1 = `${appraiser[num]}`;
          if (i < val.length - 1) {
            html += html1 + aa;
          } else {
            html += html1;
          }
        }
        return html;
      },
    },
    {
      title: '实验数据',
      align:'center',
      dataIndex: 'experimental',
      render() {
        return <a href="#">下载</a>;
      },
    },
    {
      title: '上传状态',
      dataIndex: 'fileStatus',
      align:'center',
      render(val) {
        const file = `${fileStatus[val]}`;
        return file;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mana/fetch',
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
      type: 'mana/fetch',
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
      type: 'mana/fetch',
      payload: {},
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
        ExperDate: fieldsValue.ExperDate && fieldsValue.ExperDate.format('YYYY-MM-DD'),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'mana/fetch',
        payload: values,
      });
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
              {getFieldDecorator('id')(<Input placeholder="请输入实验编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="实验日期">
              {getFieldDecorator('ExperDate')(
                <DatePicker
                  onChange={this.onChange}
                  style={{ width: '100%' }}
                  placeholder="请输入实验日期"
                />
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderSimpleForm() : this.renderSimpleForm();
  }

  render() {
    const {
      mana: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleDelete: this.handleDelete,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="实验管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                导入实验结果
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.componentDidMount}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default LabData;
