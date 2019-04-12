import { parse } from 'url';
/* 角色 */
let tableListDataSource = [];
tableListDataSource.push({
  key: `010`,
  id: `010`,
  code: `001`,
  name: `010`,
  description: '岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6',
  enabled: 0,
  systemic: '0',
});
tableListDataSource.push({
  key: `011`,
  id: `111`,
  code: `0011`,
  name: `111`,
  description: '岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6岗位描述6',
  enabled: 1,
  systemic: '0',
});

function getRole(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }
  if (params.systemic) {
    const source = params.systemic.split(',');
    let filterDataSource = [];
    source.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.systemic, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.enabled) {
    const source = params.enabled.split(',');
    let filterDataSource = [];
    source.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.enabled, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.code) {
    dataSource = dataSource.filter(data => data.code.indexOf(params.code) > -1);
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

function postRole(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, code, key, update, name, enabled, description, disabled, systemic } = body;

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
        code,
        update,
        name,
        enabled,
        description,
        disabled,
        systemic,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, {
            code,
            key,
            update,
            name,
            enabled,
            description,
            disabled,
            systemic,
          });
          return item;
        }
        return item;
      });
      break;
    case 'updateStatus':
      tableListDataSource = tableListDataSource.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { enabled });
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

/* 部门 */
let tableListDataSourceDepart = [
  {
    key: 1,
    id: 1,
    name: '总经理3',
    type: '0',
    parentId: null,
    parentIds: null,
    treeSort: '10',
    treeSorts: null,
    treeLeaf: '1',
    treeDepth: '0',
    treeNames: '',
  },
  {
    id: 2,
    key: 2,
    name: '副总经理3',
    type: '0',
    parentId: 1,
    parentIds: '总经理',
    treeSort: '20',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: '',
  },
  {
    key: 3,
    id: 3,
    name: '业务部',
    type: '2',
    parentId: 2,
    parentIds: '副总经理',
    treeSort: '30',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 4,
    id: 4,
    name: '工程部',
    type: '2',
    parentId: 2,
    parentIds: '副总经理',
    treeSort: '40',
    treeSorts: '',
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: '',
  },
  {
    key: 6,
    id: 6,
    name: '1234',
    type: '2',
    parentId: 3,
    parentIds: '业务部',
    treeSort: '50',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: '2',
  },
  {
    key: 7,
    id: 7,
    name: '124',
    type: '2',
    parentId: 3,
    parentIds: '业务部',
    treeSort: '60',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: '2',
  },
  {
    key: 8,
    id: 8,
    name: '412',
    type: '1',
    parentId: 3,
    parentIds: '业务部',
    treeSort: '70',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 1000,
    id: 1000,
    name: '1003',
    type: '1',
    parentId: 1001,
    parentIds: null,
    treeSort: '80',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 1001,
    id: 1001,
    name: '11',
    type: '0',
    parentId: null,
    parentIds: null,
    treeSort: '90',
    treeSorts: null,
    treeLeaf: '1',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 1002,
    id: 1002,
    name: '1002',
    type: '2',
    parentId: 1001,
    parentIds: null,
    treeSort: '100',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 157100,
    id: 157100,
    name: '总经理123',
    type: '0',
    parentId: null,
    parentIds: null,
    treeSort: '110',
    treeSorts: null,
    treeLeaf: '1',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 96300,
    id: 96300,
    name: '123',
    type: '0',
    parentId: null,
    parentIds: null,
    treeSort: '120',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 8710500,
    id: 8710500,
    name: '1231',
    type: '0',
    parentId: 96300,
    parentIds: null,
    treeSort: '130',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 445700,
    id: 445700,
    name: '1231',
    type: '0',
    parentId: null,
    parentIds: null,
    treeSort: '140',
    treeSorts: null,
    treeLeaf: '1',
    treeDepth: '0',
    treeNames: null,
  },
  {
    key: 338400,
    id: 338400,
    name: '12312',
    type: '2',
    parentId: 445700,
    parentIds: null,
    treeSort: '150',
    treeSorts: null,
    treeLeaf: '0',
    treeDepth: '0',
    treeNames: null,
  },
];

function getDepart(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourceDepart;

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
  if (params.id) {
    dataSource = dataSource.filter(data => data.id.indexOf(params.id) > -1);
  }
  if (params.type) {
    dataSource = dataSource.filter(data => data.type.indexOf(params.type) > -1);
  }
  if (params.treeLeaf) {
    dataSource = dataSource.filter(data => data.treeLeaf.indexOf(params.treeLeaf) > -1);
  }

  return res.json(dataSource);
}

function postDepart(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, key, type, name, experResult, parentIds, treeLeaf } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourceDepart = tableListDataSourceDepart.filter(
        item => key.indexOf(item.key) === -1
      );
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourceDepart.unshift({
        key: `Zx000${i}`,
        id: `000${i}`,
        name,
        type,
        parentId: 1,
        parentIds,
        treeSort: `20${i}`,
        treeLeaf: 0,
        treeDepth: '0',
      });
      break;
    case 'update':
      tableListDataSourceDepart = tableListDataSourceDepart.map(item => {
        if (item.key === key) {
          Object.assign(item, { type, name, experResult, parentIds, treeLeaf });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return res.json(tableListDataSourceDepart);
}

/* 用户 */
let tableListDataSourceUser = [];
tableListDataSourceUser.push({
  key: `0101`,
  id: `001`,
  loginName: 'zhangsan',
  name: '张三',
  phone: '18206183516',
  enabled: 0,
  email: '623262535@qq.com',
  dept: '1',
  userRole: `1`,
});
tableListDataSourceUser.push({
  key: `0102`,
  id: `002`,
  loginName: 'lisi',
  name: '李四',
  phone: '18206183516',
  enabled: 1,
  email: '623262535@qq.com',
  dept: '2',
  userRole: `2`,
});
tableListDataSourceUser.push({
  key: `0103`,
  id: `003`,
  loginName: 'zhangsan111',
  name: '张三11',
  phone: '18206183516',
  enabled: 1,
  email: '623262535@qq.com',
  dept: '3',
  userRole: `3`,
});

function getAuthUser(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourceUser;

  if (params.dept) {
    const source = params.dept.split(',');
    let filterDataSource = [];
    source.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.dept, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.enabled) {
    const fileStatus = params.enabled.split(',');
    let filterDataSource = [];
    fileStatus.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.enabled, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.loginName) {
    dataSource = dataSource.filter(data => data.loginName.indexOf(params.loginName) > -1);
  }
  if (params.phone) {
    dataSource = dataSource.filter(data => data.phone.indexOf(params.phone) > -1);
  }
  if (params.email) {
    dataSource = dataSource.filter(data => data.email.indexOf(params.email) > -1);
  }
  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
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

function postAuthUser(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, key, loginName, name, phone, password, enabled, email, dept, userRole } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourceUser = tableListDataSourceUser.filter(
        item => key.indexOf(item.key) === -1
      );
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourceUser.unshift({
        key: `Zx000${i}`,
        id: `Zx000${i}`,
        loginName,
        name,
        phone,
        enabled,
        email,
        dept,
        userRole,
      });
      break;
    case 'update':
      tableListDataSourceUser = tableListDataSourceUser.map(item => {
        if (item.key === key) {
          Object.assign(item, { loginName, name, phone, enabled, email, dept, userRole });
          return item;
        }
        return item;
      });
      break;
    case 'updateStatus':
      tableListDataSourceUser = tableListDataSourceUser.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { enabled });
            return item;
          }
        }
        return item;
      });
      break;
    case 'updatePass':
      tableListDataSourceUser = tableListDataSourceUser.map(item => {
        for (let j = 0; j < key.length; j += 1) {
          if (item.key === key[j]) {
            Object.assign(item, { password });
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
    list: tableListDataSourceUser,
    pagination: {
      total: tableListDataSourceUser.length,
    },
  };

  return res.json(result);
}

/* 权限 */
let tableListDataSourcePri = [
  {
    id: '2000',
    key: '2000',
    name: '用户视图',
    description: '用户视图',
    type: 0,
    code: `2000`,
  },
  {
    id: '2001',
    key: '2001',
    name: '用户编辑',
    description: '用户编辑',
    type: 1,
    code: '2001',
  },
  {
    id: '2002',
    key: '2002',
    name: '部门视图',
    description: '部门视图',
    type: 0,
    code: '2002',
  },
  {
    id: '2003',
    key: '2003',
    name: '部门编辑',
    description: '部门编辑',
    type: 1,
    code: '2003',
  },
];

function getPrivilegs(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSourcePri;

  if (params.type) {
    const exceptionState = params.type.split(',');
    let filterDataSource = [];
    exceptionState.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.type, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
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

function postPrivilegs(req, res, b) {
  const body = (b && b.body) || req.body;
  const { method, name, description, type, code, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSourcePri = tableListDataSourcePri.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSourcePri.unshift({
        key: i,
        name,
        description,
        type,
        code,
      });
      break;
    case 'update':
      tableListDataSourcePri = tableListDataSourcePri.map(item => {
        if (item.key === key) {
          Object.assign(item, { name, description, type, code });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSourcePri,
    pagination: {
      total: tableListDataSourcePri.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /biz-cases-web/api/user/listUser': getAuthUser,
  'POST /biz-cases-web/api/users': postAuthUser,
  'GET /authUser/exper/experResult': [
    {
      key: '101',
      id: '0',
      experState: '业务部',
    },
    {
      key: '102',
      id: '1',
      experState: '工程部',
    },
    {
      key: '103',
      id: '2',
      experState: '生产部',
    },
    {
      key: '104',
      id: '3',
      experState: '品质部',
    },
    {
      key: '105',
      id: '4',
      experState: '管理部',
    },
  ],
  'GET /lab/mana/reagent':[{
    id: '110000',
    isLeaf: false,
    key: '110000',
    name: '北京市',
    type: 1,
    parentId: '0',
    parentIds: '0',
    pinyin: 'iiiiiiiiii',
    remark: '1',
    treeDepth: 0,
    treeLeaf: true,
    treeNames: '北京市',
    treeSort: 10,
    treeSorts: '0000000010',

  },
    {
      id: '110100',
      isLeaf: false,
      key: '110100',
      name: '北京城区',
      type: 2,
      parentId: '110000',
      parentIds: '0,110000',
      pinyin: 'beijingchengqu',
      remark: '备注',
      treeDepth: 0,
      treeLeaf: true,
      treeNames: '北京市/北京城区',
      treeSort: 10,
      treeSorts: '0000000010,0000000010',
    }],
  'GET /authUser/exper/experExperimental': [
    {
      key: '201',
      id: '1',
      experState: '销售',
    },
    {
      key: '202',
      id: '2',
      experState: '市场开发',
    },
    {
      key: '203',
      id: '3',
      experState: '售后服务',
    },
    {
      key: '204',
      id: '4',
      experState: '产品设计',
    },
    {
      key: '205',
      id: '5',
      experState: '资料管理',
    },
    {
      key: '206',
      id: '6',
      experState: '设备制造',
    },
    {
      key: '207',
      id: '7',
      experState: '设备管理',
    },
    {
      key: '208',
      id: '8',
      experState: '质量管理',
    },
    {
      key: '209',
      id: '9',
      experState: '人事',
    },
    {
      key: '210',
      id: '10',
      experState: '行政',
    },
    {
      key: '211',
      id: '11',
      experState: '财务',
    },
  ],
  'GET /authUser/exper/experConfState': [
    {
      key: '301',
      id: '0',
      experState: '已确认',
    },
    {
      key: '302',
      id: '1',
      experState: '待确认',
    },
  ],

  'GET /biz-cases-web/api/permission': getPrivilegs,
  'POST /biz-cases-web/api/permission': postPrivilegs,
  'GET /api/permission/fileState': [
    {
      key: 0,
      id: 0,
      experState: 'view',
    },
    {
      key: 1,
      id: 1,
      experState: 'edit',
    },
  ],
  'GET /biz-cases-web/api/role/listRole': getRole,
  'POST /biz-cases-web/api/role': postRole,
  'GET /manage/role': [
    {
      key: '1',
      id: '0',
      experState: '业务部',
    },
    {
      key: '2',
      id: '1',
      experState: '工程部',
    },
    {
      key: '3',
      id: '2',
      experState: '生产部',
    },
    {
      key: '4',
      id: '3',
      experState: '品质部',
    },
    {
      key: '5',
      id: '4',
      experState: '管理部',
    },
  ],
  'GET /manage/role/experExperimental': [
    {
      key: '1',
      id: '1',
      experState: '总经理1',
    },
    {
      key: '2',
      id: '2',
      experState: '财务经理',
    },
    {
      key: '3',
      id: '3',
      experState: '人力经理',
    },
    {
      key: '4',
      id: '4',
      experState: '部门经理',
    },
    {
      key: '5',
      id: '5',
      experState: '普通员工',
    },
  ],
  'GET /manage/role/experConfState': [
    {
      key: '0',
      id: '0',
      experState: '否',
    },
    {
      key: '1',
      id: '1',
      experState: '是',
    },
  ],

  'GET /biz-cases-web/api/dept': getDepart,
  'GET /lab/exper/experResult': [
    {
      key: '1',
      id: '1',
      experState: '业务部',
    },
    {
      key: '2',
      id: '2',
      experState: '工程部',
    },
    {
      key: '3',
      id: '3',
      experState: '生产部',
    },
    {
      key: '4',
      id: '4',
      experState: '品质部',
    },
    {
      key: '5',
      id: '5',
      experState: '管理部',
    },
  ],
  'GET /lab/exper/experExperimental': [
    {
      key: '1',
      id: '1',
      experState: '销售类',
    },
    {
      key: '2',
      id: '2',
      experState: '开发类',
    },
    {
      key: '3',
      id: '3',
      experState: '售后类',
    },
    {
      key: '4',
      id: '4',
      experState: '设计类',
    },
    {
      key: '5',
      id: '5',
      experState: '管理类',
    },
    {
      key: '6',
      id: '6',
      experState: '制造类',
    },
  ],
  'GET /lab/exper/experConfState': [
    {
      key: '0',
      id: '0',
      experState: '无',
    },
    {
      key: '1',
      id: '1',
      experState: '有',
    },
  ],
  'POST /biz-cases-web/api/dept': postDepart,
};
