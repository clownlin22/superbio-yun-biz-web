import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 20; i += 1) {
  tableListDataSource.push({
    key: i,
    // disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    remittanceBillId: `SDSF20190101${i}`,
    money: Math.floor(Math.random() * 1000).toFixed(2),
    remittanceDate: new Date(`2019-01-${Math.floor(i / 2) + 1}`),
    remitter: '曲丽丽',
    remittanceAccount: `62182383432${i}1153235`,
    beneficiaryAccount: `612153123152353133${i}`,
    status: Math.floor(Math.random() * 10) % 4,
    remarks: '这是一段描述',
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
  if (params.remittanceBillId) {
    dataSource = dataSource.filter(data => data.remittanceBillId.indexOf(params.remittanceBillId) > -1);
  }
  if (params.remitter) {
    dataSource = dataSource.filter(data => data.remitter.indexOf(params.remitter) > -1);
  }
  console.log(params.remittanceAccount,'remittanceAccount')
  if (params.remittanceAccount) {
    dataSource = dataSource.filter(data => data.remittanceAccount.indexOf(params.remittanceAccount) > -1);
  }

  if (params.beneficiaryAccount) {
    dataSource = dataSource.filter(data => data.beneficiaryAccount.indexOf(params.beneficiaryAccount) > -1);
  }

  if (params.FirsrSurveyor) {
    dataSource = dataSource.filter(data => data.FirsrSurveyor.indexOf(params.FirsrSurveyor) > -1);
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

function postCase(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, Status, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { Status });
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
  'GET /casereviewapi/casereview': getCase,
  'POST /casereviewapi/casereview': postCase,
  'GET /casereviewapi/getCaseStates': [
    {
      id: '1',
      value: '打款中',
    },
    {
      id: '2',
      value: '打款成功',
    },
    {
      id: '3',
      value: '打款失败',
    },
    {
      id: '4',
      value: '退款中',
    },
    {
      id: '5',
      value: '退款成功',
    },
    {
      id: '6',
      value: '退款失败',
    },

  ],

};
