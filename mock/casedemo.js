import { parse } from 'url';

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    id: i,
    caseNo: `ZF20181101${i}`,
    caseCategoryId: Math.floor(Math.random() * 10) % 4,
    acceptDate: new Date(`2018-11-${Math.floor(i / 2) + 1}`),
    clientName: `中国平安`,
    status: Math.floor(Math.random() * 10) % 4,
    totalPrice: Math.floor(Math.random() * 1000),
    remark: '这是一段备注',
  });
}

function getCase(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }
  if (params.caseCategoryId) {
    const status = params.caseCategoryId.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.caseCategoryId, 10) === parseInt(s[0], 10)),
      );
    });
    dataSource = filterDataSource;
  }


  if (params.caseNo) {
    dataSource = dataSource.filter(data => data.caseNo.indexOf(params.caseNo) > -1);
  }


  if (params.clientName) {
    dataSource = dataSource.filter(data => data.clientName.indexOf(params.clientName) > -1);
  }
  if (params.delegate) {
    dataSource = dataSource.filter(data => data.delegate.indexOf(params.delegate) > -1);
  }

  if (params.totalPrice) {
    dataSource = dataSource.filter(data => data.totalPrice.indexOf(params.totalPrice) > -1);
  }

  if (params.remarks) {
    dataSource = dataSource.filter(data => data.caseNo.indexOf(params.caseNo) > -1);
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

  return res.json(dataSource);
}

function postCase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, status, clientName, key, caseCategoryId, totalPrice, remarks } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        caseNo: `TradeCode ${i}`,
        clientName,
        caseCategoryId,
        status,
        acceptDate: new Date(),
        totalPrice,
        remarks,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { state });
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
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /biz-cases-web/api/case/list': getCase,
  'POST /biz-cases-web/api/case/list': postCase,
  'GET /caseapi/getCaseStates': [
    {
      id: '0',
      value: '已登记',
    }, {
      id: '1',
      value: '待审核',
    },
    {
      id: '2',
      value: '审核不通过',
    },
    {
      id: '3',
      value: '审核通过',
    },
    {
      id: '4',
      value: '样本交接确认',
    },
    {
      id: '5',
      value: '样本交接退回',
    },
    {
      id: '6',
      value: '实验中',
    },
    {
      id: '7',
      value: '报告打印中',
    },
    {
      id: '8',
      value: '报告确认',
    },
    {
      id: '9',
      value: '邮寄中',
    },
    {
      id: '10',
      value: '已归档',
    },
    {
      id: '11',
      value: '已签发',
    },
    {
      id: '12',
      value: '签发成功',
    },
  ],

};
