import React, { PureComponent,Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';


import { Form, Table, Card, Row, Col, Select, Button, Icon, Tooltip, Divider, Popconfirm,Upload, message,Modal,Input,Switch } from 'antd';
const FormItem = Form.Item;
const confirms = Modal.confirm;
import stylesAttachment from './Attachment.less'
import styles from '../../Finance/CaseReview.less';

@Form.create()
class SearchForm extends PureComponent{

  handleSearch = e => {
    const { form, handleSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        bizType:fieldsValue.bizType===''?undefined:fieldsValue.bizType,
        enabled:fieldsValue.enabled===''?undefined:fieldsValue.enabled
      };

      this.setState(() => {
        handleSearch(values);
      });
    });
  };

  handleFormReset = () => {
    const { form, handleFormReset } = this.props;
    form.resetFields();
    this.setState(() => {
      handleFormReset();
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      toggleSearchForm,
      bizType
    } = this.props;

    return (
      <Form layout="inline" className={styles.tableListForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="业务类型">
              {getFieldDecorator('bizType')(
                <Select placeholder="请选择业务类型" allowClear>
                  {bizType.map(item => (
                    <Select.Option key={item.dataIndex}>{item.title}</Select.Option>
                  ))}
                </Select>)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="业务主键">
              {getFieldDecorator('bizId')(
                <Input placeholder="请输入业务主键"/>
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="启用状态">
              {getFieldDecorator('enabled')(
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>禁用</Select.Option>
                  <Select.Option value={1}>启用</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(
                <Input placeholder="请输入文件名称（包括扩展名）"/>
              )}
            </FormItem>
          </Col>

          <Col md={16} sm={24}>
            <span className={styles.submitButtons}style={{ float: 'right'}}>
              <Button type="primary" onClick={this.handleSearch}>
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

  render(){

    const { form} = this.props;

    return(
      <div>{this.renderSearchForm()}</div>
    )
  }
}

@Form.create()
class UploadModal extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
    };
  }

  onOk=()=>{
    const { form, UploadModalOK } = this.props;
    const {fileList } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,

      };

      this.setState(() => {
        UploadModalOK(values,fileList[0]);
      });

      form.resetFields();
    });
    this.handleUpload()
  };
  onCancel=()=>{
    const {UploadModalCancel} = this.props;
    this.setState(
      ()=>{
        UploadModalCancel()
      }
    )
  };

  handleUpload = () => {
   this.setState({
     fileList:[],
   })

  };

  render(){
    const {UploadModalVisable,form,bizType,onRemove} = this.props;

    const { uploading, fileList } = this.state;

    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (info) => {
        this.setState(state => ({
          fileList: [info],
        }));
        return false;
      },
      fileList,
    };

    return(
      <Modal
        changeOnSelect={true}
        title={"上传文件"}
        visible={UploadModalVisable}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form layout="inline" className={stylesAttachment.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="业务类型">
                {form.getFieldDecorator('bizType', {
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                    },
                  ],
                })(
                  <Select placeholder="请选择业务类型"allowClear>
                    {bizType.map(item => (
                      <Select.Option key={item.dataIndex}>{item.title}</Select.Option>
                    ))}
                  </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="业务主键">
                {form.getFieldDecorator('bizId', {
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                    },
                    {

                      pattern: new RegExp(/^[0-9]\d*$/, "g"),
                      message: '请输入数字'
                    }
                  ],
                })(<Input placeholder="请输入业务主键" />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="提交文件">
                {form.getFieldDecorator('upload', {
                rules: [
                  {
                    required:true,
                    message:'该项不可为空'
                  },
                ],
              })(<Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 请选择文件
                  </Button>
                </Upload>)}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    )
  }
}

@Form.create()
class UpdateModal extends PureComponent{
  onOk=()=>{
    const {updateOk,selectedRow,form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        id:selectedRow.id,
        bizType:fieldsValue.bizType,
        bizId:fieldsValue.bizId
      };

      this.setState(() => {
        updateOk(values);
      });

      form.resetFields();
    });
  };

  onCancel=()=>{
    const {updateCancel} = this.props;

    this.setState(
      ()=>{
        updateCancel()
      }
    )
  };
  render(){
    const {updateModalVisible,form,selectedRow,bizType } = this.props;
    return(
      <Modal
        changeOnSelect={true}
        title={'修改文件记录'}
        visible={updateModalVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Form layout="inline" className={stylesAttachment.searchForm}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="业务类型">
                {form.getFieldDecorator('bizType', {
                  initialValue:selectedRow.bizType,
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                    },
                  ],
                })(<Select placeholder="请选择业务类型" allowClear>
                  {bizType.map(item => (
                    <Select.Option key={item.dataIndex}>{item.title}</Select.Option>
                  ))}
                </Select>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={24} sm={24}>
              <FormItem label="业务主键">
                {form.getFieldDecorator('bizId', {
                  initialValue: selectedRow.bizId,
                  rules: [
                    {
                      required:true,
                      message:'该项不可为空'
                  },
                    {
                      pattern: new RegExp(/^[0-9]\d*$/, "g"),
                      message: '请输入数字'
                    }
                  ],
                })(<Input placeholder="请输入业务主键" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

@connect(({ AttachmentModal, loading }) => ({
  AttachmentModal,
  loading: loading.models.AttachmentModal,
}))
@Form.create()
class Attachment extends PureComponent {

  state = {
    selectedRows: [],
    selectedRow:{},
    AttachmentList:[],
    formValues:[],
    pageSize : 10,
    currentPage:1,
    UploadModalVisable:false,
    updateModalVisible:false,
    onRemove:false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'AttachmentModal/page',
      payload: {
        pageSize:10,
        currentPage:1
      },
    });
  }

  handleSearch = (values) => {
    const { dispatch, form } = this.props;
    const {pageSize,currentPage} = this.state;

    this.setState({
      formValues:values
    });

    dispatch({
      type: 'AttachmentModal/page',
      payload: {
        ...values,
        pageSize:pageSize,
        currentPage:currentPage
      },
    });

  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'AttachmentModal/page',
      payload: {
        pageSize:10,
        currentPage:1
      },
    });
    this.setState({
      formValues: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
      selectedRow:rows[0],
    });
  };
  /*
  * 表格分页或自带排序或自带筛选时触发
  * @param pagination 分页信息
  * @param filtersArg 自带筛选信息
  * @param sorter 自带排序信息
  * */
  handleStandardTableChange = pagination => {
    const { formValues } = this.state;

    const { dispatch } = this.props;
    dispatch({
      type: 'AttachmentModal/page',
      payload: {
        ...formValues,
        pageSize:pagination.pageSize,
        currentPage:pagination.current
      },
    });

    this.setState({
      pageSize:pagination.pageSize,
      currentPage:pagination.current
    })
  };

  UploadModalOK=(values,fileList)=>{

    const {dispatch} = this.props;
    const {formValues} = this.state;
    const formData = new FormData();
    const bizId = [values.bizId];
    const bizType = [values.bizType];
    formData.append('file',fileList);
    formData.append("bizType",bizType);
    formData.append("bizId",bizId);

    new Promise((resolve, reject) => {
      dispatch({
        type: 'AttachmentModal/add',
        payload:{
          formData:formData,
          resolve,
          reject
        },
      })
    }).then((data) => {
      if (data!=null){
        this.handleSearch(formValues);
      }

    });
    this.setState({
      UploadModalVisable : false,
      onRemove:true
    })
  };
  UploadModalCancel=()=>{
    this.setState({
      UploadModalVisable : false
    })
  };
  UploadModalVisable = ()=>{
    this.setState({
      UploadModalVisable : true
    })
  };

  onChange(record,checked) {
    const { dispatch } = this.props;
    const {AttachmentList} = this.state;
    const data= {
      id:record.id,
      enabled:checked===false?0:1
    };
    AttachmentList.push(data);

    new Promise((resolve, reject) => {
      dispatch({
        type: 'AttachmentModal/update',
        payload: {
          AttachmentList,
          resolve,
          reject
        }
      });
      this.setState({
        AttachmentList:[]
      })
    }).then((data) => {
    });

    message.success(checked===false?"禁用成功":"启用成功");

  }
  remove=()=>{
    const { dispatch } = this.props;
    const { selectedRows,formValues } = this.state;
    const self = this;
    const ids = selectedRows.map(item => item.id.toString());

    confirms({
      title: '确定要删除数据吗?',
      onOk(){
        new Promise((resolve, reject) => {
          dispatch({
            type: 'AttachmentModal/removeByIds',
            payload:{
              ids,
              resolve,
              reject
            },
          })
        }).then((data) => {
          self.handleSearch(formValues);
        });
        self.setState({
          selectedRows:[]
        });
        message.success('删除成功');
      },
      onCancel(){}
    });


  };

  showUpdateModal=(record )=>{
    this.setState({
      updateModalVisible:true,
      selectedRow:record
    })
  };
  updateOk=(values)=>{
    const {dispatch} = this.props;
    const {formValues,AttachmentList} = this.state;
    const test = {...values};
    AttachmentList.push(test);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'AttachmentModal/update',
        payload: {
          AttachmentList,
          resolve,
          reject
        },
      });
    }).then((data) => {
      if(data!=null){
        message.success("修改成功");
        this.handleSearch(formValues);
      }
    });
    this.setState({
      updateModalVisible:false
    });
  };
  updateCancel=()=>{
    this.setState({
      updateModalVisible:false
    })
  };

  render(){
    const {
      AttachmentModal: { data,bizType },
      loading,
      dispatch
    } = this.props;

    const { selectedRows,selectedRow,UploadModalVisable,updateModalVisible,onRemove} = this.state;

    const SearchMethods = {
      handleSearch:this.handleSearch,
      handleFormReset:this.handleFormReset
    };
    const UploadMethdos = {
      UploadModalOK : this.UploadModalOK,
      UploadModalCancel : this.UploadModalCancel
    };
    const UpdateMethdos={
      updateOk:this.updateOk,
      updateCancel:this.updateCancel
    };

    const enabled = [
      '禁用',
      '启用',
    ];
    const columns = [
      {
        title: '业务类型',
        dataIndex: 'bizType',
        align: "center"
      },
      {
        title: '业务主键',
        dataIndex: 'bizId',
        align: "center"
      },
      {
        title: '文件名',
        dataIndex: 'fileName',
        align: "center",
      },
      {
        title: '文件大小',
        dataIndex: 'fileSizeInHuman',
        align: "center"
      },
      {
        title: 'Md5',
        dataIndex: 'fileMd5',
        align: "center"
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        align: "center",
        render:(text, record)=>{
          return (
            <div>
              <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={record.enabled?true:false} onChange={(checked)=>this.onChange(record,checked)}/>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        align:'center',
        width:'110px',
        render: (text, record) => (
          <Fragment>
            <Tooltip title={"下载"}>
              <a href={`/spbbase-attachment-web/api/attachment/{id}/download?id=${record.id}`}>
                <Icon type={"download"} /></a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="修改">
              <a href="javascript:;" onClick={()=>this.showUpdateModal(record)}><Icon type="edit" /></a>
            </Tooltip>
          </Fragment>
        ),
      },
    ];
    const data1={
      list:[
        {
          id:1,
          key:1,
          bizType:1,
          bizId:123,
          fileName:'财务',
          fileType:'jpg',
          enabled:1
        },
        {
          id:2,
          key:2,
          bizType:2,
          bizId:456,
          fileName:'财务',
          fileType:'jpg',
          enabled:0
        }
      ],
      total:1
    };

    return(
      <PageHeaderWrapper title="文件管理">
        <Card bordered={false}>

          <SearchForm
            bizType={bizType}
            {...SearchMethods}
          />

          <UploadModal
            {...UploadMethdos}
            bizType={bizType}
            onRemove={onRemove}
            UploadModalVisable={UploadModalVisable}
          />
          {selectedRow&& selectedRow!=0?(
            <UpdateModal
              {...UpdateMethdos}
              bizType={bizType}
              updateModalVisible={updateModalVisible}
              selectedRow={selectedRow}
            />
          ):null}

          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <span>
                <Button onClick={this.UploadModalVisable}>上传</Button>
                <Button type="danger" disabled={!selectedRows.length > 0} onClick={this.remove}>删除</Button>
            </span>
            </div>
          </div>

        {/* // {data.list && data.list!=0?(*/}
            <StandardTable
              rowKey={"id"}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
              onSelectRow={this.handleSelectRows}
            />
       {/* //  ):null}*/}

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Attachment;
