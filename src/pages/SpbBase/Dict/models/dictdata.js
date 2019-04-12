import { queryDictData, removeDictData, addDictData, updateDictData, updateStatusValue,queryChooses } from '@/services/dictapi';

export default {
  namespace: 'dictdata',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    Choose: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryDictData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addDictData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeDictData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateDictData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updateStatusValue({ payload, callback }, { call, put }) {
      const response = yield call(updateStatusValue, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * fetchChooses({ payload }, { call, put }) {
      const response = yield call(queryChooses, payload);
      yield put({
        type: 'Choose',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    Choose(state, action) {
      return {
        ...state,
        Choose: action.payload,
      };
    },
  },
};
