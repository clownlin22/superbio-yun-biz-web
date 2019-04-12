import {
  queryReportData,
  updateStatu,
  queryChooses,
  queryCaseState,
} from '@/services/reportApi';

export default {
  namespace: 'reportData',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    Choose: [],
    caseState: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryReportData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * updateStatusValue({ payload, callback }, { call, put }) {
      const response = yield call(updateStatu, payload);
    },
    * fetchChooses({ payload }, { call, put }) {
      const response = yield call(queryChooses, payload);
      yield put({
        type: 'Choose',
        payload: response,
      });
    },
    * caseStates({ payload, callback }, { call, put }) {
      const response = yield call(queryCaseState, payload);
      yield put({
        type: 'caseState',
        payload: response,
      });
    },
  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     data: action.payload,
    //   };
    // },
    save(state, action) {
      const request = {
        list: action.payload,
        total: action.length,
      };
      return {
        ...state,
        data: request,
      };
    },
    Choose(state, action) {
      return {
        ...state,
        Choose: action.payload,
      };
    },
    caseState(state, action) {
      return {
        ...state,
        caseState: action.payload,
      };
    },
  },
};
