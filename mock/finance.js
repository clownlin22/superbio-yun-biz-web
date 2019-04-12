import { parse } from 'url';

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    caseNumber: i + 1 <= 9 ? `Z201811000${i + 1}` : `Z20181100${i + 1}`,
    category: Math.floor(Math.random() * 10) % 6,
    dataStart: `2018-11-${Math.floor(Math.random() * 10) % 30}`,
    appraiserFirst: `鉴定人${i}`,
    client: `委托方${i}`,
    source:Math.floor(Math.random() * 10) %4,
    operator:`操作人${i}`,
    remittancesAccount:`汇款账户${i}`,
    paymentAccount:`收款账户${i}`,
    remitter:`汇款人${i}`,
    remark:'备注',
    status: Math.floor(Math.random() * 10) % 9,
    receivableAmount: Math.floor(Math.random() * 1000),
    receivedAmount: Math.floor(Math.random() * 300)+200,
    irreversibleAmount:0,
    moneyStatus: Math.floor(Math.random() * 10) % 4,
    acknowledgingData: `2018-11-${Math.floor(Math.random() * 10) % 30}`,
  });
}

function getFinanceList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;
  let pageSize = 10;
  const current = parseInt(params.currentPage, 10) || 1;
  let total = 0;

  if (params.caseNumber) {
    dataSource = dataSource.filter(data => data.caseNumber.indexOf(params.caseNumber) > -1);
  }
  if (params.status) {
    dataSource = dataSource.filter(
      data => parseInt(data.status, 10) === parseInt(params.status, 10)
    );
  }

  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  total = dataSource.length;
  dataSource = dataSource.filter(
    (item, index) => index >= (current - 1) * pageSize && index < current * pageSize
  );

  const result = {
    list: dataSource,
    pagination: {
      total,
      pageSize,
      current,
    },
  };

  return res.json(result);
}


function postFinanceList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, moneyStatus, desc, key } = body;

  switch (method) {
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { moneyStatus });
            return item;
          }
        }
        return item;
      });
      break;

    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key)===-1);
      break;
    default: break;
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
  'GET /api/finance/list': getFinanceList,
  'POST /api/finance/list': postFinanceList,
};
