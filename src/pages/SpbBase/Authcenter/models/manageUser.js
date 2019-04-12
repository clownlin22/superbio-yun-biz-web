import {
  queryUser,
  removeUser,
  queryDepart,
  queryRole,
  addUser,
  updateStatusUser,
  updateUserPass,
  updateUser,
  insertRoles,
  queryUserDept,
  queryUserRole,
  queryConfState,
  queryDepartList,
} from '@/services/manage';

export default {
  namespace: 'manageUser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    department: [],
    role: [],
    fileStatuss: [{
      id:0,
      experState:"否"
    },{
      id:1,
      experState:"是"
    }],
    experResult: [],
    confState: [],
    Reagent: [],
    userRole: [],
    userDept: [],
  },

  effects: {
    // 查询
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 添加
    *add({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      payload.resolve(response)
    },
    // 删除
    *remove({ payload }, { call }) {
      const response = yield call(removeUser, payload);
      payload.resolve(response)
    },
    *fetchDepart({ payload }, { call, put }) {
      const response = yield call(queryDepart, payload);
      yield put({
        type: 'saveDepart',
        payload: response,
      });
    },
    // 查询角色
    *fetchRoles({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'saveRole',
        payload: response,
      });
    },
    // 修改
    *update({ payload }, { call }) {
      const response = yield call(updateUser, payload);
      payload.resolve(response)
    },
    *insertRole({ payload }, { call }) {
      yield call(insertRoles, payload);
    },
    // 修改状态
    *updateStatus({ payload }, { call }) {
      const response = yield call(updateStatusUser, payload);
      payload.resolve(response)
    },
    // 修改密码
    *updatePass({ payload }, { call }) {
      const response = yield call(updateUserPass, payload);
      payload.resolve(response)
    },
    // 用户部门中间表
    *fetchUserDept({ payload }, { call, put }) {
      const response = yield call(queryUserDept, payload);
      yield put({
        type: 'saveUserDept',
        payload: response,
      });
    },
    // 用户角色中间表
    *fetchUserRole({ payload }, { call, put }) {
      const response = yield call(queryUserRole, payload);
      yield put({
        type: 'saveUserRole',
        payload: response,
      });
    },
    // *fetchExperResult({ payload }, { call, put }) {
    //   const response = yield call(queryResult, payload);
    //   yield put({
    //     type: 'saveResult',
    //     payload: response,
    //   });
    // },
    // 伪角色数据
    *fetchConfState({ payload }, { call, put }) {
      const response = yield call(queryConfState, payload);
      yield put({
        type: 'saveConfState',
        payload: response,
      });
    },
    // 部门数据
    *fetchReagent({ payload }, { call, put }) {
      const response = yield call(queryDepartList, payload);
      yield put({
        type: 'saveReagent',
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
    saveDepart(state, action) {
      return {
        ...state,
        department: action.payload,
      };
    },
    saveRole(state, action) {
      return {
        ...state,
        role: action.payload,
      };
    },
    saveUserDept(state, action) {
      return {
        ...state,
        userDept: action.payload,
      };
    },
    saveUserRole(state, action) {
      return {
        ...state,
        userRole: action.payload,
      };
    },
    saveResult(state, action) {
      return {
        ...state,
        experResult: action.payload,
      };
    },
    saveConfState(state, action) {
      return {
        ...state,
        confState: action.payload,
      };
    },
    saveReagent(state, action) {
      return {
        ...state,
        Reagent: action.payload,
      };
    },
  },
};
