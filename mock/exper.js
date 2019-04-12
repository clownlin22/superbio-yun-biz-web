import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
tableListDataSource.push({
  key: `0101`,
  id: `001`,
  case_number: '3456456457816',
  client: '张三',
  experimental: ['0'],
  experResult: '0',
  confState: '0',
});
tableListDataSource.push({
  key: `0102`,
  id: `002`,
  experResult: `1`,
  experimental: ['2'],
  case_number: '5674554645815',
  client: '袁亮',
  confState: '0',
});
tableListDataSource.push({
  key: `0103`,
  id: `003`,
  experimental: ['2'],
  case_number: '23456407814',
  experResult: '2',
  client: '王帅',
  confState: '0',
});
tableListDataSource.push({
  key: `0104`,
  id: `004`,
  experimental: ['0'],
  case_number: '01234567813',
  experResult: '3',
  client: '林新宇',
  confState: '1',
});
tableListDataSource.push({
  key: `0105`,
  id: `005`,
  experimental: ['0'],
  case_number: '78120123456',
  experResult: '0',
  client: '王五',
  confState: '1',
});
tableListDataSource.push({
  key: `0106`,
  id: `006`,
  experimental: ['1'],
  case_number: '678114564564',
  experResult: '1',
  client: '周伯通',
  confState: '1',
});

function getExper(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.experimental) {
    const source = params.experimental.split(',');
    let filterDataSource = [];
    source.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.experimental, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.experResult) {
    const fileStatus = params.experResult.split(',');
    let filterDataSource = [];
    fileStatus.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.experResult, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.confState) {
    const fileStatus = params.confState.split(',');
    let filterDataSource = [];
    fileStatus.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.confState, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.id) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
  }
  if (params.case_number) {
    dataSource = dataSource.filter(data => data.case_number.indexOf(params.case_number) > -1);
  }
  if (params.client) {
    dataSource = dataSource.filter(data => data.client.indexOf(params.client) > -1);
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

function postExper(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, confState, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: `Zx000${i}`,
        id: `Zx000${i}`,
        experResult: '0',
        experimental: '',
        client: '',
        confState: '0',
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { confState });
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
  'GET /lab/exper': getExper,
  'POST /lab/exper': postExper,
};
