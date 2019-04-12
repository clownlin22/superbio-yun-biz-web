import React, {PureComponent, Fragment} from 'react';
import {Table, Input,  Divider, Select} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

const {Option} = Select;
const appell = [
  {
    id: 1,
    experState: '爸',
  },
  {
    id: 2,
    experState: '妈',
  },
  {
    id: 3,
    experState: '儿',
  },
  {
    id: 4,
    experState: '女',
  },
];
const Pactype = [
  {
    id: 1,
    experState: '血痕',
  },
  {
    id: 2,
    experState: '毛发',
  },
  {
    id: 3,
    experState: '口腔拭子',
  },
  {
    id: 4,
    experState: '指甲',
  },
  {
    id: 5,
    experState: '羊水',
  },
  {
    id: 6,
    experState: '外周血',
  },
  {
    id: 7,
    experState: '精斑',
  },
  {
    id: 8,
    experState: '烟头',
  }];
const sex = [{
  id: 0,
  experState: '男',
}, {
  id: 1,
  experState: '女',
}];

class CaseSample extends PureComponent {
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

  // 本行数据
  getRowByKey(key, newData) {
    const {data} = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  // 编辑和展示状态的切换
  toggleEditable = (e, key) => {
    e.preventDefault();
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = {...target};
      }
      target.editable = !target.editable;
      this.setState({data: newData});
    }
  };

  // 新增一行
  newMember = () => {
    const {data} = this.state;
    const newData = data.map(item => ({...item}));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      name: '',
      sex: '',
      idNumber: '',
      appellation: '',
      sampleId: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({data: newData});
  };

  // 删除一行
  /* remove(key) {
     const { data } = this.state;
     const { onChange } = this.props;
     const newData = data.filter(item => item.key !== key);
     this.setState({ data: newData });
     onChange(newData);
   } */

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
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

  // 保存本行
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
      const {data} = this.state;
      const {onChange} = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
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
    // readOnlyState  状态
    const {
      readOnlyState
    } = this.props;
    // 列头的展示
    let columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render(text) {
          return text;
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        render(text) {
          const name = sex.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '身份证',
        dataIndex: 'idNumber',
        key: 'idNumber',
        render(text) {
          return text;
        },
      },
      {
        title: '称谓',
        dataIndex: 'appellation',
        key: 'appellation',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text}
                style={{width: '100%'}}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={value => this.handleSelectChange(value, 'appellation', record.key)}
                placeholder="称谓"
              >
                {appell.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = appell.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '是否特殊样本',
        dataIndex: 'special',
        key: 'special',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text}
                style={{width: '100%'}}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={value => this.handleSelectChange(value, 'special', record.key)}
                placeholder="是否特殊样本"
              >
                <Option key={11} value={0}>是</Option>
                <Option key={22} value={1}>否</Option>
              </Select>
            );
          }
          if (text !== undefined) {
            return text === 0 ? "是" : "否";
          }
          return text;
        },
      },
      {
        title: '样本类型',
        dataIndex: 'sampleType',
        key: 'sampleType',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text}
                style={{width: '100%'}}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={value => this.handleSelectChange(value, 'sampleType', record.key)}
                placeholder="样本类型"
              >
                {Pactype.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = Pactype.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].experState : text;
        },
      },
      {
        title: '样本编号',
        dataIndex: 'sampleCode',
        key: 'sampleCode',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'sampleCode', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="样本条形码"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'Action',
        render: (text, record) => {
          const {loading} = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  {/* <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm> */}
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical"/>
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              {/* <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm> */}
            </span>
          );
        },
      },
    ];

    const {loading, data} = this.state;
    // 如果是只读状态时，将操作栏去除
    if (readOnlyState === true) {
      columns = columns.filter(item => item.key !== 'Action');
    }
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
}

export default CaseSample;
