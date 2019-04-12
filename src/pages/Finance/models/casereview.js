import {
  queryCase,
  removeCase,
  addCase,
  queryCaseState,
  updateStatu,
  updateReason,
  queryCaseData,
  queryfileData,
  queryfileById,
} from '@/services/casereviewapi';

export default {
  namespace: 'casereview',

  state: {
    data1: {
      // list: [],
      // pagination: {},

    },
    remittanceState: [],
    attachmentList: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCase, payload);
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
    * remittanceStates({ payload, callback }, { call, put }) {
      const response = yield call(queryCaseState, payload);
      yield put({
        type: 'remittanceState',
        payload: response,
      });
    },
    * caseDatas({ payload }, { call, put }) {
      const response = yield call(queryCaseData, payload);
      yield put({
        type: 'caseData',
        payload: {
          ...payload,
          cases: response,
        },
      });
    },
    * fileDatas({ payload }, { call, put }) {
      const response = yield call(queryfileData, payload);
      payload.resolve(response);
      // yield put({
      //   type: 'fileData',
      //   payload: {
      //     ...payload,
      //     cases: response,
      //   },
      // });
    },
    * fileById({ payload }, { call, put }) {
      const response = yield call(queryfileById, payload);
      yield put({
        type: 'saveAttachMent',
        fileInfo: response,
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
        data1: request,
      };
    },
    remittanceState(state, action) {
      return {
        ...state,
        remittanceState: action.payload,
      };
    },

    caseData(state, action) {
      const { data1 } = state;
      const list = data1.list;
      const newList = list.map(item => {
        if (item.id == action.payload.remittanceBillId) {
          return {
            ...item,
            cases: action.payload.cases,
          };
        }
        return item;
      });
      return {
        ...state,
        data1: {
          list: newList,
          total: list.length,
        },
      };
    },
    saveAttachMent(state, action) {
      return {
        ...state,
        attachmentList: action.fileInfo,
      };
    },

  },
};
