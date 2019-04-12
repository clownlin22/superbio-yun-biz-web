import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {Table, Button, Input, Popconfirm, Divider, Select, Upload, message, InputNumber} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
// 鉴定材料
const {Option} = Select;

const Specification = [
  {
    id: 1,
    experState: '份',
  },
  {
    id: 2,
    experState: '页',
  },
  {
    id: 3,
    experState: '个',
  }, {
    id: 4,
    experState: '张',
  },
  {
    id: 5,
    experState: 'ml',
  },
  {
    id: 6,
    experState: '支',
  },
  {
    id: 7,
    experState: '具',
  },
];
const {TextArea} = Input;
const Properties = [
  {
    id: 1,
    experState: '原件',
  },
  {
    id: 2,
    experState: '复印件',
  },
  {
    id: 3,
    experState: '电子件',
  },
];
const MateType = [
  {
    id: 1,
    experState: '资料',
  },
  {
    id: 2,
    experState: '样本',
  },
  {
    id: 3,
    experState: '验材',
  },
];

class CaseMaterial extends PureComponent {
  state = {
    fileList: [],
    fileStatus: false,
  };

  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  // 获取本行数据
  getRowByKey(key, newData) {
    const {data} = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  // 新增一行
  newMember = () => {
    const {data} = this.state;
    const editNumber = data.filter(item=>item.editable === true);
    if(editNumber.length===0){
      this.setState({fileList: []});
      this.setState({fileStatus: false});
      const newData = data.map(item => ({...item}));
      newData.push({
        key: `NEW_TEMP_ID_${this.index}`,
        name: '',
        type: '',
        amount: '',
        specification: '',
        feature: '',
        remark: '',
        attachmentId: '',
        attachmentName: '',
        editable: true,
        isNew: true,
      });
      this.index += 1;
      this.setState({data: newData});
    }else{
      message.success('请先保存之前的操作');
    }
  };

  // 上传文件
  handleFiledChange = (files, fieldName, key) => {
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);

    if (target) {
      target.attachmentName = files.files.fileList.length > 0 ? files.files.fileList[0].name : '';
      this.setState({data: newData});
      this.setState({fileStatus: true});
    }
  };

  // 删除本行
  remove(key) {
    const {data} = this.state;
    // const {onChange} = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({data: newData});
    // onChange(newData);
  }

  // 文本框
  handleFieldChange(e, fieldName, key) {
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({data: newData});
    }
  }

  // 下拉框
  handleSelectChange(value, fieldName, key) {
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({data: newData});
    }
  }

  // 取消编辑
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({data: newData});
    this.clickedCancel = false;
  }

  render() {
    const {fileList, fileStatus} = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
            fileStatus: true
          };
        });
      },
      beforeUpload: (info) => {
        this.setState(state => ({
          fileList: [info],
          fileStatus: true
        }));
        return false;
      },
      fileList,
    };
    const {
      readOnlyState, attachmentList,handleMater
    } = this.props;
    // 编辑和查看切换
    const toggleEditable = (e, key) => {
      e.preventDefault();
      const {data} = this.state;
      const editNumber = data.filter(item=>item.editable === true);
      if(editNumber.length>1){
        message.success('请先保存之前的操作');
      }else{
        const newData = data.map(item => ({...item}));
        const target = this.getRowByKey(key, newData);
        // 查询单个文件
        if (target.attachmentId !== "" && target.attachmentId !== null) {
          const ids = [];
          ids.push(target.attachmentId);
          const attach = attachmentList.filter(item => item.id === target.attachmentId);
          this.setState({
            fileList: [{
              uid: attach[0].id,
              name: attach[0].fileName,
              status: 'done',
              response: 'Server Error 500',
              url: attach[0].filePath,
            }]
          });
        }
        if (target) {
          // 进入编辑状态时保存原始数据
          if (!target.editable) {
            this.cacheOriginData[key] = {...target};
          }
          target.editable = !target.editable;
          this.setState({data: newData});
        }
      }
    };
    console.log(attachmentList, 'attachmentList')
    // 运行保存
    const saveRow = (e, key, files) => {
      e.persist();
      this.setState({
        loading: true,
      });

      setTimeout(() => {
        if (this.clickedCancel) {
          this.clickedCancel = false;
          return;
        }
        const target = this.getRowByKey(key) || {};
        if (target.name === "" || target.type === "" || target.amount === "" || target.specification === "" || target.feature === "") {
          message.error('请填写完整信息。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
        const {data} = this.state;
        if (fileStatus === true && target.attachmentName !== "") {
          const formData = new FormData();
          const bizType = [];
          const caseCate = "Case";
          bizType.push(caseCate);
          const bizId = [];
          formData.append('file', files.fileList[0]);
          formData.append("bizType", bizType);
          formData.append("bizId", bizId);
          handleMater(data, formData,key);
          delete target.isNew;
          toggleEditable(e, key);
          this.setState({
            loading: false,
            fileStatus: false
          });
        } else {
          delete target.isNew;
          toggleEditable(e, key);
          // const {onChange} = this.props;
          // onChange(data);
          this.setState({
            loading: false,
          });
        }
      }, 500);
    };

    const handleKeyPress=(e, key,files)=> {
      if (e.key === 'Enter') {
        saveRow(e, key,files);
      }
    };
    // 目录
    let columns = [
      {
        title: '材料名称',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => handleKeyPress(e, record.key)}
                placeholder="送检材料名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{width: '100%'}}
                onChange={e => this.handleSelectChange(e, 'type', record.key)}
                onKeyPress={e => handleKeyPress(e, record.key)}
                placeholder="类型"
                value={text}
              >
                {MateType.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = MateType.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                min={0}
                onChange={e => this.handleSelectChange(e, 'amount', record.key)}
                onKeyPress={e => handleKeyPress(e, record.key)}
                placeholder="数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '规格',
        dataIndex: 'specification',
        key: 'specification',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{width: '100%'}}
                onKeyPress={e => handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'specification', record.key)}
                placeholder="规格"
                value={text}
              >
                {Specification.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = Specification.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '材料性质',
        dataIndex: 'feature',
        key: 'feature',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{width: '100%'}}
                onKeyPress={e => handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'feature', record.key)}
                placeholder="材料性质"
                value={text}
              >
                {Properties.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = Properties.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '13%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{minRows: 2, maxRows: 6}}
                onChange={e => this.handleFieldChange(e, 'remark', record.key)}
                onKeyPress={e => handleKeyPress(e, record.key)}
                placeholder="备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '文件',
        dataIndex: 'attachmentId',
        key: 'attachmentId',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Upload
                {...props}
                multiple={false}
                onChange={(files) => this.handleFiledChange({files}, 'attachmentId', record.key)}
              >
                {`上传`}
              </Upload>
            );
          }
          if (record.attachmentName !== '' && record.attachmentName !== undefined) {
            return record.attachmentName;
          }
          if (record.attachmentId !== '' && record.attachmentId !== undefined) {
            if (attachmentList !== undefined) {
              const name = attachmentList.filter(item => item.id === record.attachmentId);
              return name.length > 0 ? name[0].fileName : '';
            }
          }
        },
      },
      {
        title: '操作',
        key: 'Action',
        width: '15%',
        render: (text, record) => {
          const {loading} = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => saveRow(e, record.key, {fileList})}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => saveRow(e, record.key, {fileList})}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    const {loading, data} = this.state;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        data[i].key = i;
      }
    }
    if (readOnlyState === true) {
      columns = columns.filter(item => item.key !== 'Action');
      return (
        <Fragment>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={record => (record.editable ? styles.editable : '')}
          />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Table
          rowKey="key"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{width: '100%', marginTop: 16, marginBottom: 8}}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增鉴定材料
        </Button>
      </Fragment>
    );
  }
}

export default CaseMaterial;
