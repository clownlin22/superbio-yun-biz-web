import { parse } from 'url';
/* 委托事项 */
let tableListDataSourceDict = [];
for (let i = 0; i < 4; i += 1) {
  tableListDataSourceDict.push({
    key: i,
    id:parseInt(i,10),
    category:0,
    entrustName: `X染色体STR检验${i}`,
    chargeProject:1,
    detail: `X染色体STR检验__${i}`,
  });
}
for (let i = 4; i < 8; i += 1) {
  tableListDataSourceDict.push({
    key: i,
    id:parseInt(i,10),
    category: 2,
    entrustName: `X染色体STR检验${i}`,
    chargeProject:1,
    detail: `X染色体STR检验11__${i}`,
  });
}
for (let i = 8; i < 12; i += 1) {
  tableListDataSourceDict.push({
    key: i,
    id:parseInt(i,10),
    category: 1,
    entrustName: `X染色体STR检验${i}`,
    chargeProject:1,
    detail: `X染色体STR检验11__${i}`,
  });
}

function getEntrust(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourceDict;


  // 名称查询
  if (params.entrustName) {
    dataSource = dataSource.filter(data => data.entrustName.indexOf(params.entrustName) > -1);
  }
  // 专业类别
  if (params.category) {
    const status = params.category.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.category, 10) === parseInt(s[0], 10)),
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

function postEntrust(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, key, category, entrustName, chargeProject, detail } = body;
  switch (method) {

    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourceDict = tableListDataSourceDict.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourceDict.unshift({
        key: i,
        id: `su_bo${i}`,
        category,
        entrustName,
        chargeProject,
        detail,
      });
      break;
    case 'update':

      tableListDataSourceDict = tableListDataSourceDict.map(item => {
        if (item.key === key) {
          Object.assign(item, { category, entrustName, chargeProject, detail });
          return item;
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


export default {
  'GET /api/authcenter/entrust': getEntrust,
  'POST /api/authcenter/entrust': postEntrust,
  'GET /api/authcenter/getCategorys': [
    {
      id: '0',
      value: '亲子鉴定',
    },
    {
      id: '1',
      value: '文书鉴定',
    },
    {
      id: '2',
      value: '酒精鉴定',
    },
    {
      id: '3',
      value: '车辆痕迹鉴定',
    },
    {
      id: '4',
      value: '法医临床鉴定',
    },
    {
      id: '5',
      value: '法医病理鉴定',
    }
  ],


};
