import { parse } from 'url';
const tableListDataSource = [
  {
    code: '110000',
    isLeaf: false,
    jianpin: 'BJ',
    key: '110000',
    name: '北京市',
    parentCode: '0',
    parentCodes: '0',
    pinyin: 'iiiiiiiiii',
    remark: '1',
    treeDepth: 0,
    treeLeaf: true,
    treeNames: '北京市',
    treeSort: 10,
    treeSorts: '0000000010',
    type: 1,
  },
  {
    code: '110100',
    isLeaf: false,
    jianpin: 'BJCQ',
    key: '110100',
    name: '北京城区',
    parentCode: '110000',
    parentCodes: '0,110000',
    pinyin: 'beijingchengqu',
    remark: '备注',
    treeDepth: 0,
    treeLeaf: true,
    treeNames: '北京市/北京城区',
    treeSort: 10,
    treeSorts: '0000000010,0000000010',
    type: 2,
  },
  {
    code: '110102',
    isLeaf: true,
    jianpin: 'XCQ',
    key: '110102',
    name: '西城区',
    parentCode: '110100',
    parentCodes: '0,110000,110100',
    pinyin: 'xichengqu',
    remark: '备注',
    treeDepth: 2,
    treeLeaf: false,
    treeNames: '北京市/北京城区/西城区',
    treeSort: 20,
    treeSorts: '0000000010,0000000020,0000000020',
    type: 3,
  },
  {
    code: '110101',
    isLeaf: true,
    jianpin: 'DCQ',
    key: '110101',
    name: '东城区 ',
    parentCode: '110100',
    parentCodes: '0,110000,110100',
    pinyin: 'dongchengqu',
    remark: '备注',
    treeDepth: 2,
    treeLeaf: false,
    treeNames: '北京市/北京城区/东城区',
    treeSort: 10,
    treeSorts: '0000000010,0000000010,0000000010',
    type: 3,
  },
  {
    code: '120000',
    isLeaf: true,
    jianpin: '',
    key: '120000',
    name: '天津市',
    parentCode: '0',
    parentCodes: '0',
    pinyin: '',
    remark: '备注',
    treeDepth: 0,
    treeLeaf: false,
    treeNames: '天津市',
    treeSort: 50,
    treeSorts: '0000000050',
    type: 1,
  },
];
function getDistrictList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  if (params.code) {
    const data = dataSource.filter(data => data.code.indexOf(params.code) > -1);
    const dataChildren = dataSource.filter(item => item.parentCodes.match(params.code));
    const temp = data;
    temp.push(...dataChildren);
    dataSource = temp;
  }

  if (params.name) {
    dataSource = dataSource.filter(item => item.treeNames.match(params.name));
  }


  return res.json(tableListDataSource);
}

function deleteDistrict(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  return res.json(dataSource);
}

function updataDistrict(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url;
  }
  const params = parse(url, true).query;
  let dataSource = tableListDataSource;

  const data = dataSource.filter(data => data.code.indexOf(params.code) > -1);
  const returnData = {
    code: params.code,
    name: params.name,
    type: data[0].type,
    parentCode: data[0].parentCode,
    parentCodes: data[0].parentCodes,
    treeSort: params.treeSort,
    treeLeaf: data[0].treeLeaf,
    treeNames: data[0].treeNames,
    remark: params.remark,
  };

  console.log('returnData', returnData);
  return res.json(returnData);
}

function insertOneDistrict(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  let dataSource = tableListDataSource;


  if (params.parentCode == null) {
    //添加的是最高等级的地区
    const temp = {
      code: params.code,
      name: params.name,
      parentCode: '0',
      parentCodes: '0',
      type: 1,
      treeSort: params.treeSort,
      remark: params.remark,
      treeLeaf: 0,
      treeNames: params.name,
    };
    tableListDataSource.push(temp);
    return res.json(temp);
  } else {
    const data = dataSource.filter(data => data.code.indexOf(params.parentCode) > -1);
    const temp = {
      code: params.code,
      name: params.name,
      parentCode: params.parentCode,
      parentCodes: data[0].parentCodes + ',' + params.parentCode,
      treeSort: params.treeSort,
      remark: params.remark,
      type: data[0].type + 1,
      treeLeaf: 0,
      treeNames: data[0].treeNames + '/' + params.name,
    };
    tableListDataSource.push(temp);
    return res.json(dataSource);
  }
}

export default {
  'GET /spbbase-district-web/api/districts': getDistrictList,
  'GET /spbbase-district-web/api/District/selectDistrictByCodeOrName': getDistrictList,
  'GET /spbbase-district-web/api/District/deleteDistrictByCode': deleteDistrict,
  'GET /spbbase-district-web/api/District/updateDistrictByCode': updataDistrict,
  'GET /spbbase-district-web/api/District/insertOne': insertOneDistrict,
};
