import {
  queryRole,
  queryExperimental,
  addRole,
  queryPrivileges,
  queryUser,
  insertRoles,
  removeRole,
  updateRoleStatus,
  updateRole,
  queryRolePermission,
} from '@/services/manage';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    privilege: [],
    fileStatuss: [],
    user: [],
    RolePermission: [],
    Result: [
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
    Experimental: [
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
    ConfState: [
      {
        key: 0,
        id: 0,
        experState: '否',
      },
      {
        key: 1,
        id: 1,
        experState: '是',
      },
    ],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    /* 查询权限 */
    *fetchPrivilege({ payload }, { call, put }) {
      const response = yield call(queryPrivileges, payload);
      yield put({
        type: 'savePrivilege',
        payload: response,
      });
    },
    /* 查询角色与权限的中间表 */
    *fetchRolePer({ payload }, { call, put }) {
      const response = yield call(queryRolePermission, payload);
      yield put({
        type: 'saveRolePermission',
        payload: response,
      });
    },
    /* 查询用户 */
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'saveUser',
        payload: response,
      });
    },
    *add({ payload }, { call }) {
      const response = yield call(addRole, payload);
      payload.resolve(response)
    },
    *insertRole({ payload }, { call, put }) {
      const response = yield call(insertRoles, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(removeRole, payload);
      payload.resolve(response)
      // const response = yield call(removeRole, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *update({ payload }, { call }) {
      const response = yield call(updateRole, payload);
      payload.resolve(response)
    },
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(updateRoleStatus, payload);
      payload.resolve(response)
      // const response = yield call(updateRoleStatus, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *fetchExperimental({ payload }, { call, put }) {
      const response = yield call(queryExperimental, payload);
      yield put({
        type: 'saveExper',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      const request = {
        list: action.payload,
        total: action.payload.length,
      };
      return {
        ...state,
        data: request,
      };
    },
    savePrivilege(state, action) {
      return {
        ...state,
        privilege: action.payload,
      };
    },
    saveUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    saveRolePermission(state, action) {
      return {
        ...state,
        RolePermission: action.payload,
      };
    },
    saveExper(state, action) {
      return {
        ...state,
        fileStatuss: action.payload,
      };
    },
  },
};
