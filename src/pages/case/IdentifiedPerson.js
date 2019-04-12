import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm,Select, Divider,message,InputNumber } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
// 鉴定人
const { Option } = Select;
const { TextArea } = Input;
const sex = [{
  id: 0,
  experState: '男',
},{
  id: 1,
  experState: '女',
}];

class IdentifiedPerson extends PureComponent {
  index = 0;

  state = {
    perState: false,
  };

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
    target.status = "save";
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
    this.setState({
      perState: true,
    });
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `1001${this.index}`,
      mattersEntrusted: '',
      name: '',
      status: 'add',
      sex: '',
      age: '',
      address: '',
      idNumber: '',
      contactName: '',
      contactPhone: '',
      nation: '',
      remark: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data,perState } = this.state;
    const { onChange } = this.props;
    const target = this.getRowByKey(key) || {};
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    setTimeout(() => {
      if(target.status==='save'||target.status===undefined){
        target.status=undefined;
        onChange(newData,perState,target);
      }
    }, 500);
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
    const { perState } = this.state;
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (target.name==="") {
        message.error('姓名必填。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.sex==="") {
        message.error('性别必填。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (!target.idNumber) {
        message.error('身份证必填。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.idNumber){
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(target.idNumber) === false) {
          message.error('身份证输入不合法。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
      }
      if (target.contactPhone){
        const reg = /^1[34578]\d{9}$/;
        if (reg.test(target.contactPhone) === false) {
          message.error('手机号格式不正确。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data,perState,target);
      this.setState({
        loading: false,
        perState: false,
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
    target.status=undefined;
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const {
      readOnlyState
    } = this.props;
    let columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '身份证号',
        dataIndex: 'idNumber',
        key: 'idNumber',
        width: '12%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'idNumber', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="身份证号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '民族',
        dataIndex: 'nation',
        key: 'nation',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'nation', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="民族"
              />
            );
          }
          return text;
        },
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: '8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{width: '100%'}}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'sex', record.key)}
                placeholder="性别"
                value={text}
              >
                {sex.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = sex.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: '8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={value => this.handleSelectChange(value, 'age', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                min={1}
                max={130}
                placeholder="年龄"
              />
            );
          }
          return text;
        },
      },
      {
        title: '家庭住址',
        dataIndex: 'address',
        key: 'address',
        width: '13%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => this.handleFieldChange(e, 'address', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="家庭住址"
              />
            );
          }
          return text;
        },

      },
      {
        title: '联系人',
        dataIndex: 'contactName',
        key: 'contactName',
        width: '9%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'contactName', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="联系人"
              />
            );
          }
          return text;
        },
      },
      {
        title: '联系电话',
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'contactPhone', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="联系电话"
              />
            );
          }
          return text;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => this.handleFieldChange(e, 'remark', record.key)}
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

    const { loading, data } = this.state;
    if(data!==undefined){
      if(data.length>0){
        for(let i=0;i<data.length;i+=1){
          data[i].key = i;
        }
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
          />
        </Fragment>
      );
    }
    return (

      <Fragment>
        <Table
          rowKey='key'
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
          新增鉴定对象
        </Button>
      </Fragment>
    );
  }
}

export default IdentifiedPerson;
