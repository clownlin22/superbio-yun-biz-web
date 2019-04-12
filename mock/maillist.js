import { parse } from 'url';

const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    caseNumber: i + 1 <= 9 ? `Z201811000${i + 1}` : `Z20181100${i + 1}`,
    category: Math.floor(Math.random() * 10) % 6,
    dataStart: `2018-11-${Math.floor(Math.random() * 10) % 30}`,
    appraiserFirst: `鉴定人${i}`,
    client: `委托方${i}`,
    phone: i + 1 <= 9 ? `19985521560${i + 1}` : `1998552156${i + 1}`,
    mailType: Math.floor(Math.random() * 10) % 2,
    data: `2018-11-${Math.floor(Math.random() * 10) % 30}`,
    isMail: Math.floor(Math.random() * 10) % 2,
    describe: '这是一段描述',
  });
}

function getMailList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;
  let pageSize = 10;
  const current = parseInt(params.currentPage, 10) || 1;
  let total = 0;

  if (params.appraiserFirst) {
    dataSource = dataSource.filter(data => data.appraiserFirst.indexOf(params.appraiserFirst) > -1);
  }

  if (params.client) {
    dataSource = dataSource.filter(data => data.client.indexOf(params.client) > -1);
  }

  if (params.category) {
    dataSource = dataSource.filter(
      data => parseInt(data.category, 10) === parseInt(params.category, 10)
    );
  }

  if (params.isMail) {
    dataSource = dataSource.filter(
      data => parseInt(data.isMail, 10) === parseInt(params.isMail, 10)
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

export default {
  'GET /api/maillist/list': getMailList,
};
