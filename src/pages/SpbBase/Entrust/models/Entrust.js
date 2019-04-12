import {
  queryRule,
  removeRule,
  addRule,
  updateEntrust,
  updateDictStatus,
  queryAll,
  queryChooses,
  updateById,
  queryCategorys,
} from '@/services/entrustapi';

export default {
  namespace: 'Entrust',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    Choose: [],
    Category: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * updateStatus({ payload, callback }, { call, put }) {
      const response = yield call(updateDictStatus, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * queryAll({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateEntrust, payload);
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
    * fetchCategorys({ payload }, { call, put }) {
      const response = yield call(queryCategorys, payload);
      yield put({
        type: 'Category',
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
    Category(state, action) {
      return {
        ...state,
        Category: action.payload,
      };
    },
  },
};
