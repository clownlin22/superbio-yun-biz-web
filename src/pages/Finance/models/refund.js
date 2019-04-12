import {
  queryRefunds,
  addChargeNotes,
  removeByIds,
  updateChargeNotes,
  updateStatu,
  updateReason,
  queryCaseInfos,
} from '@/services/refundApi';

export default {
  namespace: 'RefundModal',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    CaseInfos: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRefunds, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * getCaseInfos({ payload }, { call, put }) {
      const response = yield call(queryCaseInfos, payload);
      yield put({
        type: 'CaseInfo',
        payload: response,
      });
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeByIds, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateStatu, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    * updateReasons({ payload, callback }, { call, put }) {
      const response = yield call(updateReason, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
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
    CaseInfo(state, action) {
      const request = {
        list: action.payload,
        total: action.length,
      };
      return {
        ...state,
        CaseInfos: request,
      };
    },
  },

};
