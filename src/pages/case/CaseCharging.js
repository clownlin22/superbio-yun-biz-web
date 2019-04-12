import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Popconfirm, Divider,Select,InputNumber } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
// 收费说明

const { Option } = Select;

const Chargetype = [
  {
    key: '0',
    id: '0',
    experState: '全部',
  },
  {
    key: '1',
    id: '1',
    experState: '鉴定费',
  },
  {
    key: '2',
    id: '2',
    experState: '附加费',
  },
  {
    key: '3',
    id: '3',
    experState: '会诊费',
  },
  {
    key: '4',
    id: '4',
    experState: '现勘费',
  },
  {
    key: '5',
    id: '5',
    experState: '出庭费',
  },
  {
    key: '6',
    id: '6',
    experState: '服务费',
  },
  {
    key: '7',
    id: '7',
    experState: '加急费',
  }
];

class CaseCharging extends PureComponent {
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
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  // 编辑和展示切换
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

  // 新增一行
  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_Charge${this.index}`,
      price: '',
      amount: 1,
      chargingItemId: 0,
      refundType: '',
      discount: 0,
      totalPrice:0,
      money: 0,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // 删除
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

  // 文本框
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  // 下拉框和数字类型
  handleSelectChange(value, fieldName, key, charOpts) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (fieldName === "chargingItemId") {
      for (let i = 0; i < charOpts.length; i += 1) {
        if (parseInt(charOpts[i].id, 10) === parseInt(value, 10)) {
          target.money = charOpts[i].money;
          target.refundType = charOpts[i].refundType.toString();
        }
      }
    }
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
      if (target.money !== null ||target.amount !== null || target.discount !== null) {
        target.totalPrice = parseInt(target.money, 10) * parseInt(target.amount, 10) - parseInt(target.discount, 10);
      }
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

  // 取消编辑
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
    // charOpts——收费项目字典值  readOnlyState——视图/编辑
    const {
      charOpts, readOnlyState
    } = this.props;
    // 列头
    let columns = [
      {
        title: '收费项目',
        dataIndex: 'chargingItemId',
        key: 'chargingItemId',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'chargingItemId', record.key,charOpts)}
                placeholder="委托事项"
                value={parseInt(text,10)}
              >
                {charOpts.map(item => (
                  <Option key={parseInt(item.id,10)} value={parseInt(item.id,10)}>{item.projectName}</Option>
                ))}
              </Select>
            );
          }
          const name = charOpts.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].projectName : text;
        },
      },
      {
        title: '收费类型',
        dataIndex: 'refundType',
        key: 'refundType',
        width: '15%',
        render: (text) => {
          const name = Chargetype.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '单价',
        dataIndex: 'money',
        key: 'money',
        width: '15%',
        render(text) {
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={e => this.handleSelectChange(e, 'amount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '优惠金额',
        dataIndex: 'discount',
        key: 'discount',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={e => this.handleSelectChange(e, 'discount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="优惠金额"
              />
            );
          }
          return text;
        },
      },
      {
        title: '应收小计',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width: '15%',
        render(text,record) {
          if (record.money !== null ||record.amount !== null || record.discount !== null) {
            const recriva = parseInt(record.money, 10) * parseInt(record.amount, 10) - parseInt(record.discount, 10);
            return recriva;
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'Action',
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

    // 根据收费项目的ID给数据加key和类型
    if(data.length!==0){
      for(let i=0;i<data.length;i+=1){
        const charge = charOpts.filter(item => parseInt(item.id,10) === parseInt(data[i].chargingItemId,10));
        data[i].refundType = charge.length > 0 ? charge[0].refundType.toString() : 0;
        data[i].money = charge.length > 0 ? charge[0].money : 0;
        data[i].key = i;
      }
    }
    if(readOnlyState===true){
      columns = columns.filter(item => item.key !=='Action');
      return (
        <Fragment>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={record => (record.editable ? styles.editable : '')}
            style={{width: '100%', marginTop: 16, marginBottom: 48}}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        {/* 数据展示 */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        {/* 新增按钮 */}
        <Button
          style={{width: '100%', marginTop: 16, marginBottom: 48}}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增收费项目
        </Button>
      </Fragment>
    );
  }
}

export default CaseCharging;
