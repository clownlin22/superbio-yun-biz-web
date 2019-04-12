import { queryCase,upload, removeCase, addCase, updateStatu,querycaseGetId,queryCaseState,queryMater } from '@/services/caseapi';
// import { add } from '@/services/attachment';

export default {
  namespace: 'casedemo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    caseState:[],
    caseGetIds: [],
    caseMater: [],
    caseUpload: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetch2({ payload }, { call, put }) {
      const response = yield call(queryCase, payload);
      payload.resolve(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *caseGetId({ payload }, { call, put }) {
      const response = yield call(querycaseGetId, payload);
      yield put({
        type: 'fetchCaseGetId',
        payload: response,
      });
    },
    *queryMaterials({ payload }, { call, put }) {
      const response = yield call(queryMater, payload);
      yield put({
        type: 'fetchMater',
        payload: response,
      });
      payload.resolve(response)
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *upload({ payload }, { call,put }) {
      const response = yield call(upload, payload);
      payload.resolve(response)
      // const response = yield call(upload,payload);
      // yield put({
      //   type: 'load',
      //   payload: response
      // });
      // payload.resolve(response)
    },
    *remove({ payload }, { call }) {
      const response = yield call(removeCase, payload);
      payload.resolve(response)
     /* yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(); */
    },
    * updateAudit({ payload, callback }, { call, put }) {
      const response = yield call(updateStatu, payload);
      payload.resolve(response)
    },
    *caseStates({ payload, callback }, { call, put }) {
      const response = yield call(queryCaseState, payload);
      yield put({
        type: 'caseState',
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
    caseState(state, action) {
      return {
        ...state,
        caseState: action.payload,
      };
    },
    load(state, action) {
      return {
        ...state,
        caseUpload: action.payload,
      };
    },
    fetchCaseGetId(state, action) {
      return {
        ...state,
        caseGetIds: action.payload,
      };
    },
    fetchMater(state, action) {
      return {
        ...state,
        caseMater: action.payload,
      };
    },

  },
};
