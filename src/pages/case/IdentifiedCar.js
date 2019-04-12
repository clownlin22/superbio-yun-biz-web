import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input,Popconfirm, Divider,message,Select} from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
const Citype = [{
  id: 0,
  experState: '小型汽车',
},{
  id: 1,
  experState: '货车/特种车辆/大型汽车',
},{
  id: 2,
  experState: '电动车',
},{
  id: 3,
  experState: '摩托车',
},{
  id: 4,
  experState: '自行车',
},{
  id: 5,
  experState: '其他',
}];
class IdentifiedCar extends PureComponent {
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
      plateName: '',
      brand: '',
      type: '',
      vin: '',
      engineNumber: '',
      parkingPlace: '',
      contactName: '',
      contactPhone: '',
      remark: '',
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
    const {
      readOnlyState
    } = this.props;
    let columns = [
      {
        title: '车牌号',
        dataIndex: 'plateName',
        key: 'plateName',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'plateName', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="车牌"
              />
            );
          }
          return text;
        },
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'brand', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="品牌"
              />
            );
          }
          return text;
        },
      },
      {
        title: '车辆类型',
        dataIndex: 'type',
        key: 'type',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                style={{ width: '100%' }}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                onChange={e => this.handleSelectChange(e, 'type', record.key)}
                placeholder="车辆类型"
                value={text}
              >
                {Citype.map(item => (
                  <Option key={item.id} value={item.id}>{item.experState}</Option>
                ))}
              </Select>
            );
          }
          const name = Citype.filter(item=>parseInt(item.id,10)===parseInt(text,10));
          return name.length>0?name[0].experState : text;
        },
      },
      {
        title: '车架号',
        dataIndex: 'vin',
        key: 'vin',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'vin', record.key)}
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
        dataIndex: 'engineNumber',
        key: 'engineNumber',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'engineNumber', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="发动机号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '停放地点',
        dataIndex: 'parkingPlace',
        key: 'parkingPlace',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TextArea
                value={text}
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => this.handleFieldChange(e, 'parkingPlace', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="停放地点"
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
        width: '10%',
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
              <Input
                value={text}
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
    if(data.length>0){
      for(let i=0;i<data.length;i+=1){
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

export default IdentifiedCar;
