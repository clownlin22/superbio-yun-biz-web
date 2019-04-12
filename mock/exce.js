import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
tableListDataSource.push({
  key: `01`,
  caseNumber: `001`,
  comparison: 'D20180921734',
  exceptionState: '0',
  exceptionDes: '2',
  abnormalDate: '2018-01-02 12:01:00',
  historical: 'D201809217344',
});
tableListDataSource.push({
  key: `02`,
  caseNumber: `002`,
  comparison: `D20180921733`,
  exceptionState: '0',
  exceptionDes: '1',
  abnormalDate: '2018-01-02 12:01:00',
  historical: 'D201809217333',
});
tableListDataSource.push({
  key: `03`,
  caseNumber: `003`,
  exceptionState: '1',
  exceptionDes: '0',
  comparison: 'D20180921732',
  abnormalDate: '2018-01-03 12:01:00',
  historical: 'D201809217322',
});
tableListDataSource.push({
  key: `04`,
  caseNumber: `004`,
  exceptionState: '1',
  exceptionDes: '0',
  comparison: 'D20180921731',
  abnormalDate: '2018-01-03 12:01:00',
  historical: 'D201809217311',
});
tableListDataSource.push({
  key: `05`,
  caseNumber: `005`,
  exceptionState: '0',
  exceptionDes: '1',
  comparison: 'D20180921730',
  abnormalDate: '2018-01-01 12:01:00',
  historical: 'D201809217300',
});
tableListDataSource.push({
  key: `06`,
  caseNumber: `006`,
  exceptionState: '2',
  exceptionDes: '2',
  comparison: 'D20180921735',
  abnormalDate: '2018-01-01 12:01:00',
  historical: 'D201809217355',
  emergencyDegree: '0',
});

function getExce(req, res, u) {
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

  if (params.exceptionState) {
    const exceptionState = params.exceptionState.split(',');
    let filterDataSource = [];
    exceptionState.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.exceptionState, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.exceptionDes) {
    const exceptionDes = params.exceptionDes.split(',');
    let filterDataSource = [];
    exceptionDes.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.exceptionDes, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.caseNumber) {
    dataSource = dataSource.filter(data => data.caseNumber.indexOf(params.caseNumber) > -1);
  }
  if (params.abnormalDate) {
    dataSource = dataSource.filter(data => data.abnormalDate.indexOf(params.abnormalDate) > -1);
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

function postExce(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, caseNumber, abnormalDate, comparison, exceptionDes, exceptionState, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        caseNumber,
        comparison,
        exceptionState,
        exceptionDes,
        abnormalDate,
        historical: '0',
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { exceptionState });
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
  'GET /lab/exce': getExce,
  'POST /lab/exce': postExce,
};
