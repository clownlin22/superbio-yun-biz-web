import { queryChargesNotes,addChargeNotes,removeByIds,updateChargeNotes } from '@/services/chargesnotes';

export default {
  namespace: 'ChargesNotesModal',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryChargesNotes, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addChargeNotes, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeByIds, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      console.log(payload,'payload')
      const response = yield call(updateChargeNotes, payload);
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
  },

};
