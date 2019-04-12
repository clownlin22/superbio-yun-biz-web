import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, Divider, Select,Upload,Icon,message } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
/* 车痕鉴定 */
const {Option} = Select;
const { TextArea } = Input;
const CaMtype = [
  {
    key: '1',
    id: '1',
    experState: '小型汽车',
  },
  {
    key: '2',
    id: '2',
    experState: '货车/特种车辆/大型汽车',
  },
  {
    key: '3',
    id: '3',
    experState: '电动车',
  }, {
    key: '4',
    id: '4',
    experState: '摩托车',
  },
  {
    key: '5',
    id: '5',
    experState: '自行车',
  },
  {
    key: '6',
    id: '6',
    experState: '其他',
  },
];
const CaWays = [
  {
    key: '1',
    id: '1',
    experState: '存档',
  },
  {
    key: '2',
    id: '2',
    experState: '销毁',
  },
  {
    key: '3',
    id: '3',
    experState: '退还',
  }
];

class CarMmaterial extends PureComponent {
  index = 0;

  cacheOriginData = {};

  // 构造器
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  // 渲染
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  // 查询单行数据
  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  // 编辑和查看切换
  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  // 新增行
  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      Bnumber: '',
      Chassis: '',
      Engine: '',
      VehicleType: '',
      Bhandling: '',
      Bremarks: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // 删除行
  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  // 数据的选择或者变化
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  // 改变文本框时触发
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  // 改变下拉框时触发
  handleSelectChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  // 运行保存
  saveRow(e, key) {
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
      // if (!target.workId || !target.name || !target.department) {
      //   message.error('请填写完整信息。');
      //   e.target.focus();
      //   this.setState({
      //     loading: false,
      //   });
      //   return;
      // }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  // 点击取消
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    // 上传文件时触发
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    // 列头配置
    const columns = [
      {
        title: '车牌号',
        dataIndex: 'Bnumber',
        key: 'Bnumber',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'Bnumber', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="车牌号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '车架号',
        dataIndex: 'Chassis',
        key: 'Chassis',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'Chassis', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="车架号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '发动机号',
        dataIndex: 'Engine',
        key: 'Engine',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'Engine', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="发动机号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '车辆类型',
        dataIndex: 'VehicleType',
        key: 'VehicleType',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'VehicleType', record.key)}
                placeholder="车辆类型"
                value={text}
              >
                {CaMtype.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = CaMtype.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },

      {
        title: '处理方式',
        dataIndex: 'Bhandling',
        key: 'Bhandling',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'Bhandling', record.key)}
                placeholder="处理方式"
                value={text}
              >
                {CaWays.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = CaWays.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '备注',
        dataIndex: 'Bremarks',
        key: 'Bremarks',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => this.handleFieldChange(e, 'Bremarks', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '文件',
        dataIndex: 'Mfile',
        key: 'Mfile',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 文件上传
                </Button>
              </Upload>
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    // 初始数据
    const { loading, data } = this.state;

    return (
      // 数据展示
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        {/* 新增 */}
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
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

export default CarMmaterial;
