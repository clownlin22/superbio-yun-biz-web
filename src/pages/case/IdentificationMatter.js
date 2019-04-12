import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, Divider,Select,InputNumber,message } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
// 委托事项
const { TextArea } = Input;
const { Option } = Select;
class IdentificationMatter extends PureComponent {
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

  // 编辑和展示状态切换
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
      key: `NEW_TEMP_ID_${this.index}`,
      entrustedMatterId: '',
      detail: '',
      amount: '',
      remark: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // 删除一行
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

  // 下拉框
  handleSelectChange(value, fieldName, key,opts) {
    let entrust = "";
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if(fieldName==="entrustedMatterId"){
      for (let i = 0; i < opts.length; i += 1) {
        if(parseInt(opts[i].id,10)===parseInt(value,10)){
          entrust = opts[i].detail;
        }
      }
      target.detail = entrust;
    }
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  // 保存本行
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    const { onChange,handleChanges } = this.props;
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (target.entrustedMatterId==="") {
        message.error('请选择委托事项。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (!target.amount) {
        message.error('请填写数量。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      handleChanges(data,target.entrustedMatterId,target.amount);
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
    const {
       opts,readOnlyState
    } = this.props;

    let columns = [
      {
        title: '委托事项',
        dataIndex: 'entrustedMatterId',
        key: 'entrustedMatterId',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{width: '100%'}}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'entrustedMatterId', record.key, opts)}
                placeholder="委托事项"
                value={text}
              >
                {opts.map(item => (
                  <Option key={item.id} value={item.id}>{item.entrustName}</Option>
                ))}
              </Select>
            );
          }
          // if (opts !== undefined) {
          const name = opts.filter(item => parseInt(item.id, 10) === parseInt(text, 10));
          return name.length > 0 ? name[0].entrustName : text;
          // }
        },
      },
      {
        title: '细项',
        dataIndex: 'detail',
        key: 'detail',
        width: '20%',
        render (text) {
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width: '20%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                min={1}
                value={text===null?1:text}
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
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: '20%',
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
    // 循环添加细则
    if(data.length!==0){
      for(let i=0;i<data.length;i+=1){
        const charge = opts.filter(item => parseInt(item.id, 10) === parseInt(data[i].entrustedMatterId, 10));
        data[i].detail = charge.length > 0 ? charge[0].detail : '';
        data[i].key = i;
      }
    }
    if(readOnlyState===true){
      columns = columns.filter(item => item.key !=='Action');
      return (
        <Fragment>
          <Table
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
          新增鉴定事项
        </Button>
      </Fragment>
    );
  }
}

export default IdentificationMatter;
