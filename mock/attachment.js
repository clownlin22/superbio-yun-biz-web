import { parse } from 'url';

let tableListDataSource = [
  {
    "id": 108824466991008560,
    "enabled": false,
    "bizType": "亲子鉴定",
    "bizId": 123,
    "filePath": "E:\\Upload\\类型1\\12.24-12.29周报 .xlsx",
    "fileName": "12.24-12.29周报 .xlsx",
    "fileContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileMd5": "3c49b4ec34e54dbd092e9bd9bf45af47",
    "fileSizeInHuman": '2M',
  },
  {
    "id": 10882446699100856600,
    "enabled": false,
    "bizType": "亲子鉴定",
    "bizId": 123,
    "filePath": "E:\\Upload\\类型1\\12.24-12.29周报 .xlsx",
    "fileName": "12.24-12.29周报 .xlsx",
    "fileContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileMd5": "3c49b4ec34e54dbd092e9bd9bf45af47",
    "fileSizeInHuman": '3M',
  },
  {
    "id": 108824466991008600,
    "enabled": true,
    "bizType": "亲子鉴定",
    "bizId": 123,
    "filePath": "E:\\Upload\\类型1\\12.24-12.29周报 .xlsx",
    "fileName": "12.24-12.29周报 .xlsx",
    "fileContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileMd5": "3c49b4ec34e54dbd092e9bd9bf45af47",
    "fileSizeInHuman": '1M',
  },
  {
    "id": 108824466991008500,
    "enabled": true,
    "bizType": "亲子鉴定",
    "bizId": 123,
    "filePath": "E:\\Upload\\类型1\\12.24-12.29周报 .xlsx",
    "fileName": "12.24-12.29周报 .xlsx",
    "fileContentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "fileMd5": "3c49b4ec34e54dbd092e9bd9bf45af47",
    "fileSizeInHuman": '15k',
  },
];


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

  total = 10;
  dataSource = dataSource.filter(
    (item, index) => index >= (current - 1) * pageSize && index < current * pageSize
  );

  const data ={
    items:dataSource,
    cuuent:dataSource.length
  };

  return res.json(data);
}

export default {
  'GET /spbbase-attachment-web/api/attachment/page': getFinanceList,
};
