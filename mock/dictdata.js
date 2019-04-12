import { parse } from 'url';
/*字典*/
let tableListDataSourceDict = [];
tableListDataSourceDict.push(
  {
    key: `01001`,
    id: `001`,
    name: `区域类型`,
    code: 'sys_area_type',
    systemic: '1',
    enabled: 0,
    remark: '这是一段描述1',
  },
  {
    key: `01002`,
    id: `002`,
    name: `案件标志`,
    code: 'case_marks',
    systemic: '1',
    enabled: 0,
    remark: '这是一段描述2',
  },
  {
    key: `01003`,
    id: `003`,
    name: `汽车类型`,
    code: 'car_type',
    systemic: '0',
    enabled: 1,
    remark: '这是一段描述3',

  },
);
function getDict(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourceDict;


  //字典名称查询
  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }
  //字典编码查询
  if (params.code) {
    dataSource = dataSource.filter(data => data.code.indexOf(params.code) > -1);
  }
  //是否系统字典
  if (params.systemic) {
    const status = params.systemic.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.systemic, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }
  //是否禁用
  if (params.enabled) {
    const status = params.enabled.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.enabled, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postDict(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, name, code, systemic, enabled, remark } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourceDict = tableListDataSourceDict.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourceDict.unshift({
        key: i,
        id: 'subo' + i,
        name,
        code,
        systemic,
        enabled:1,
        remark,
      });
      break;
    case 'update':
      tableListDataSourceDict = tableListDataSourceDict.map(item => {
        if (item.key === key) {
          Object.assign(item, { name, code, systemic, enabled, remark });
          return item;
        }
        return item;
      });

      break;
    case 'updateStatusValue':
      tableListDataSourceDictValue = tableListDataSourceDictValue.map(item => {
        for (let i = 0; i < key.length; i += 1) {
          if (item.key === key[i]) {
            Object.assign(item, { enabled });
            return item;
          }
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSourceDict,
    pagination: {
      total: tableListDataSourceDict.length,
    },
  };
  return res.json(result);
}


/*字典数据*/
let tableListDataSourceDictValue = [];
tableListDataSourceDictValue.push(
  {
    key: `01001`,
    label: `国家`,
    value: `0`,
    treeSort:`10`,
    dict_code: 'country',
    systemic: '1',
    enabled: 1,
    description: '这是一段描述',
  },
);

function getDictValue(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourceDictValue;


  //字典标签查询
  if (params.label) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }
  //字典键值查询
  if (params.value) {
    dataSource = dataSource.filter(data => data.code.indexOf(params.code) > -1);
  }
  //是否系统字典
  if (params.systemic) {
    const status = params.systemic.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.systemic, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }
  //是否禁用
  if (params.enabled) {
    const status = params.enabled.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.enabled, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postDictValue(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, label, value, dict_code, treeSort,systemic, enabled, description } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourceDictValue = tableListDataSourceDictValue.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourceDictValue.unshift({
        key: i,
        id: 'subo' + i,
        label,
        value,
        dict_code,
        systemic,
        enabled,
        treeSort,
        description,
      });
      break;
    case 'update':
      tableListDataSourceDictValue = tableListDataSourceDictValue.map(item => {
        if (item.key === key) {
          Object.assign(item, {  label, value, dict_code, systemic, treeSort,enabled, description });
          return item;
        }
        return item;
      });
      break;
    case 'updateStatusValue':
      tableListDataSourceDictValue = tableListDataSourceDictValue.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { enabled });
            return item;
          }
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSourceDictValue,
    pagination: {
      total: tableListDataSourceDictValue.length,
    },
  };

  return res.json(result);
}


export default {
  'GET /api/authcenter/dict': getDict,
  'POST /api/authcenter/dict': postDict,
  'GET /api/authcenter/dictValue': getDictValue,
  'POST /api/authcenter/dictValue': postDictValue,
};
