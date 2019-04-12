import { queryEntrust,queryCharging,queryAttachMent,removeCase, addCase, updateCase,querycaseGetId,queryGetAttach } from '@/services/caseFormApi';

export default {
  namespace: 'caseform',

  state: {
    dataEntrust: [],
    dataCharging: [],
    caseMater: [],
    attachmentList: [],
  },

  effects: {
    // 查询案例
    *fetchEntrust({ payload }, { call, put }) {
      const response = yield call(queryEntrust, payload);
      yield put({
        type: 'saveEntrust',
        payload: response,
      });
    },
    // 查询文件（字典匹配类型）
    *fetchAttachMent({ payload }, { call, put }) {
      const response = yield call(queryAttachMent, payload);
      yield put({
        type: 'saveAttachMent',
        payload: response,
      });
    },
    // 点击编辑时查询单个文件（拼接成fileList展示）
    *getAttachMent({ payload }, { call, put }) {
      const response = yield call(queryGetAttach, payload);
      payload.resolve(response)
    },
    // 查询收费项目
    *queryCharging({ payload }, { call, put }) {
      const response = yield call(queryCharging, payload);
      yield put({
        type: 'saveCharging',
        payload: response,
      });
    },
    // 查询单个案例
    *caseGetId({ payload }, { call, put }) {
      const response = yield call(querycaseGetId, payload);
      yield put({
        type: 'fetchCaseGetId',
        payload: response,
      });
      payload.resolve(response)
    },
    // 添加案例
    *add({ payload }, { call, put }) {
      const response = yield call(addCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      payload.resolve(response)
    },
    // 删除案例
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    // 修改案例
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      payload.resolve(response)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveEntrust(state, action) {
      return {
        ...state,
        dataEntrust: action.payload,
      };
    },
    saveCharging(state, action) {
      return {
        ...state,
        dataCharging: action.payload,
      };
    },
    saveAttachMent(state, action) {
      return {
        ...state,
        attachmentList: action.payload,
      };
    },
    fetchCaseGetId(state, action) {
      return {
        ...state,
        caseGetIds: action.payload,
      };
    },
    locationGetId(state) {
      return {
        ...state,
        caseGetIds:undefined,
      };
    },
  },
};
