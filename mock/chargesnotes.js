import { parse } from 'url';

/* 财务管理 */
const tableListDataSource = [];
for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    key: i,
    id:parseInt(i,10),
    projectName: `收费项目${i}`,
    category: 0,
    refundType: Math.floor(Math.random() * 10) % 7,
    money: Math.floor(Math.random() * 500),
    remark: `备注${i}`,
  });
}
for (let i = 4; i < 8; i += 1) {
  tableListDataSource.push({
    key: i,
    id:parseInt(i,10),
    projectName: `收费项目${i}`,
    category: 2,
    refundType: Math.floor(Math.random() * 10) % 7,
    money: Math.floor(Math.random() * 500),
    remark: `备注${i}`,
  });
}
for (let i = 8; i < 12; i += 1) {
  tableListDataSource.push({
    key: i,
    id:parseInt(i,10),
    projectName: `收费项目${i}`,
    category: 1,
    refundType: Math.floor(Math.random() * 10) % 7,
    money: Math.floor(Math.random() * 500),
    remark: `备注${i}`,
  });
}

function getChargesNotes(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }



  const params = parse(url, true).query;
  let dataSource = tableListDataSource;
  let pageSize = 10;
  const current = parseInt(params.currentPage, 10) || 1;
  let total = 0;


  if (params.projectName) {
    dataSource = dataSource.filter(data => data.projectName.indexOf(params.projectName) > -1);
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
  if (params.id) {
    dataSource = dataSource.filter(
      data => parseInt(data.id, 10) === parseInt(params.id, 10)
    );
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

export default {
  'GET /api/finance/queryChargesNotes': getChargesNotes,
};
