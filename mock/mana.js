import { parse } from 'url';

// mock tableListDataSource
let tableListDataSource = [];
tableListDataSource.push({
  key: `01001`,
  id: `001`,
  caseNumber: '3456456457816',
  appraiser: ['1', '2'],
  reagent: '1',
  ExperDate: '2018-11-07 11:00:12',
  experimental: '0',
  fileStatus: ['0'],
});
tableListDataSource.push({
  key: `01002`,
  id: `002`,
  ExperDate: '2018-11-06 11:00:12',
  appraiser: ['1', '2'],
  fileStatus: ['0'],
  caseNumber: '5674554645815',
  reagent: '2',
  experimental: '0',
});
tableListDataSource.push({
  key: `01003`,
  id: `003`,
  fileStatus: ['1'],
  appraiser: ['1', '2'],
  caseNumber: '23456407814',
  ExperDate: '2018-11-05 11:00:12',
  reagent: '3',
  experimental: '0',
});
tableListDataSource.push({
  key: `01004`,
  id: `004`,
  fileStatus: ['0'],
  appraiser: ['1', '2'],
  caseNumber: '01234567813',
  ExperDate: '2018-11-04 11:00:12',
  reagent: '0',
  experimental: '1',
});
tableListDataSource.push({
  key: `01005`,
  id: `005`,
  fileStatus: '0',
  appraiser: ['1', '2'],
  caseNumber: '78120123456',
  ExperDate: '2018-11-03 11:00:12',
  reagent: '1',
  experimental: '1',
});
tableListDataSource.push({
  key: `01006`,
  id: `006`,
  fileStatus: ['1'],
  appraiser: ['1', '2'],
  caseNumber: '678114564564',
  ExperDate: '2018-11-02 11:00:12',
  reagent: '2',
  experimental: '1',
});

function getMana(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.id) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
  }

  if (params.ExperDate) {
    dataSource = dataSource.filter(data => data.ExperDate.indexOf(params.ExperDate) > -1);
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

function postMana(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, reagent, id, caseNumber, appraiser, experimental, ExperDate, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: `ZM0100${i}`,
        id,
        fileStatus: '0',
        appraiser,
        caseNumber,
        ExperDate,
        reagent,
        experimental,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { reagent, caseNumber, ExperDate });
          return item;
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
  'GET /lab/mana': getMana,
  'POST /lab/mana': postMana,
};
