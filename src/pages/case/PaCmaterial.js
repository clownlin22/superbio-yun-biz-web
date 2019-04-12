import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, Divider, Select } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

const Option = Select;
const { TextArea } = Input;
const Pactype = [
  {
  key: '1',
  id: '1',
  experState: '血痕',
},
  {
    key: '2',
    id: '2',
    experState: '毛发',
  },
  {
    key: '3',
    id: '3',
    experState: '口腔拭子',
  },
  {
    key: '4',
    id: '4',
    experState: '指甲',
  },
  {
    key: '5',
    id: '5',
    experState: '羊水',
  },
  {
    key: '6',
    id: '6',
    experState: '外周血',
  },
  {
    key: '7',
    id: '7',
    experState: '精斑',
  },
  {
    key: '8',
    id: '8',
    experState: '烟头',
  }];
const appell = [
  {
  key: '1',
  id: '1',
  experState: '爸',
},
  {
    key: '2',
    id: '2',
    experState: '妈',
  },
  {
    key: '3',
    id: '3',
    experState: '儿',
  },
  {
    key: '4',
    id: '4',
    experState: '女',
  },
  ];

const PaWays = [
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
  },
];

class PaCmaterial extends PureComponent {
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

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

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

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      samplet: '',
      samplingt: '',
      special: '',
      appellation: '',
      handling: '',
      PacName: '',
      Aremarks: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  handleSelectChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }


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
    const columns = [
      {
        title: '样本条形码',
        dataIndex: 'samplet',
        key: 'samplet',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'samplet', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="样本条形码"
              />
            );
          }
          return text;
        },
      },
      {
        title: '取样类型',
        dataIndex: 'samplingt',
        key: 'samplingt',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'samplingt', record.key)}
                placeholder="类型"
                value={text}
              >
                {Pactype.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}

              </Select>
            );
          }
          const name = Pactype.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '特殊样本',
        dataIndex: 'special',
        key: 'special',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'special', record.key)}
                placeholder="特殊样本"
                value={text}
              >
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            );
          }
          const dd = text ===0 ? '否' : '是';
          return dd;
        },
      },
      {
        title: '用户名',
        dataIndex: 'PacName',
        key: 'PacName',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'PacName', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="用户名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '称谓',
        dataIndex: 'appellation',
        key: 'appellation',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'appellation', record.key)}
                placeholder="称谓"
                value={text}
              >
                {appell.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                  ))}
              </Select>
            );
          }
          const name = appell.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '处理方式',
        dataIndex: 'handling',
        key: 'handling',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'handling', record.key)}
                placeholder="处理方式"
                value={text}
              >
                {PaWays.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = PaWays.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '备注',
        dataIndex: 'Aremarks',
        key: 'Aremarks',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => this.handleFieldChange(e, 'Aremarks', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="备注"
              />
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

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
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

export default PaCmaterial;
