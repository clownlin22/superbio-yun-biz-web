import { stringify } from 'qs';
import request from '@/utils/request';

/* 用户 */
export async function queryUser(params) {
  return request(`/biz-cases-web/api/users/listUser?${stringify(params)}`);
}
export async function addUser(params) {
  return request('/biz-cases-web/api/users/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function removeUser(params) {
  return request(`/biz-cases-web/api/users/removeBatch?ids=${params.ids}`, {
    method: 'GET',
  });
}
export async function updateUser(params) {
  return request('/biz-cases-web/api/users/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
export async function updateStatusUser(params) {
  return request(`/biz-cases-web/api/users/status?ids=${params.ids}&enabled=${params.enabled}`, {
    method: 'POST',
  });
}
export async function updateUserPass(params) {
  return request(`/biz-cases-web/api/users/updatePass?ids=${params.ids}&password=${params.password}`, {
    method: 'POST',
  });
  // return request(`/biz-cases-web/api/user`, {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'updatePass',
  //   },
  // });
}

/* 权限表 */
export async function queryPrivilege(params) {
  return request(`/biz-cases-web/api/permission/listPermission?${stringify(params)}`);
}
export async function addPrivilege(params) {
  // return request(`/api/permission/insertPermission?${stringify(params)}`, {
  //   method: 'POST',
  // });
  return request('/biz-cases-web/api/permission/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function removePrivilege(params) {
  return request(`/biz-cases-web/api/permission/removeBatch?ids=${params.ids}`, {
    method: 'GET',
  });
}
export async function updatePrivilege(params) {
  return request('/biz-cases-web/api/permission/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function queryExperimental() {
  return request(`/api/permission/fileState`);
}

/* 字典 */
export async function queryConfState() {
  return request(`/lab/exper/experConfState`);
}
export async function queryReagent() {
  return request(`/lab/mana/reagent`);
}
export async function queryResult() {
  return request(`/lab/mana/experResult`);
}

/* 角色表 */
export async function queryRole(params) {
  return request(`/biz-cases-web/api/role/listRole?${stringify(params)}`);
}
export async function queryPrivileges(params) {
  return request(`/biz-cases-web/api/permission/listPermission?${stringify(params)}`);
}
export async function addRole(params) {
  // return request(`/api/role/insertRole?${stringify(params)}`, {
  //   method: 'POST',
  //
  // });
  return request('/biz-cases-web/api/role/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function removeRole(params) {
  return request(`/biz-cases-web/api/role/removeBatch?ids=${params.ids}`, {
    method: 'GET',
  });
}
export async function updateRole(params) {
  return request('/biz-cases-web/api/role/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updateRoleStatus(params) {
  return request(`/biz-cases-web/api/role/status?ids=${params.ids}&enabled=${params.enabled}`, {
    method: 'POST',
  });
}

export async function queryDepart(params) {
  return request(`/biz-cases-web/api/dept/listDept?${stringify(params)}`);
}
export async function queryDepartList(params) {
  return request(`/biz-cases-web/api/dept/queryDeptList?${stringify(params)}`);
}
export async function queryRoles(params) {
  return request(`/biz-cases-web/api/role?${stringify(params)}`);
}
export async function insertRoles(params) {
  return request('/biz-cases-web/api/dept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function queryDeparts(params) {
  return request(`/biz-cases-web/api/dept/listDept?${stringify(params)}`);
}
export async function removeDepart(params) {
  return request(`/biz-cases-web/api/dept/removeBatch?ids=${params.ids}`, {
    method: 'GET',
  });
}
export async function addDepart(params) {
  return request('/biz-cases-web/api/dept/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updateDepart(params) {
  return request('/biz-cases-web/api/dept/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryExperimentals() {
  return request(`/lab/exper/experExperimental`);
}
export async function queryConfStates() {
  return request(`/lab/exper/experConfState`);
}
export async function queryExceptionDes() {
  return request(`/lab/exce/exceptionDes`);
}
export async function queryExceptionState() {
  return request(`/lab/exce/exceptionState`);
}

// 用户部门表
export async function queryUserDept(params) {
  return request(`/biz-cases-web/api/deptUser/listDeptUser?${stringify(params)}`);
}
// 用户角色表
export async function queryUserRole(params) {
  return request(`/biz-cases-web/api/userRole/listUserRole?${stringify(params)}`);
}
// 角色权限表
export async function queryRolePermission(params) {
  return request(`/biz-cases-web/api/rolePermission/listRolePermission?${stringify(params)}`);
}

export async function getDistrict(params) {
  return request(`/biz-cases-web/api/dept/listDept?${stringify(params)}`)
}
