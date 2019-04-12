import {
  queryDeparts,
  removeDepart,
  addDepart,
  updateDepart,
  queryExperimentals,
  queryConfStates,
  getDistrict,
  queryDepartList,
} from '@/services/manage';

export default {
  namespace: 'departMent',

  state: {
    data: [],
    dataList:[],
    Result: [],
    Experimental: [],
    ConfState: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDeparts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchExperimental({ payload }, { call, put }) {
      const response = yield call(queryExperimentals, payload);
      yield put({
        type: 'saveExperimental',
        payload: response,
      });
    },
    *fetchConfState({ payload }, { call, put }) {
      const response = yield call(queryConfStates, payload);
      yield put({
        type: 'saveConfState',
        payload: response,
      });
    },
    *add({ payload }, { call }) {
      const response = yield call(addDepart, payload);
      payload.resolve(response)

      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *remove({ payload }, { call,put }) {
      const response = yield call(removeDepart, payload);
      payload.resolve(response);
      yield put({
        type:'ForceDelete',
        payload
      })
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateDepart, payload);
      payload.resolve(response)
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *getDistrict({ payload }, { call, put }) {
      const response = yield call(getDistrict, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDistrict({ payload }, { call, put }) {
      const response = yield call(queryDepartList, payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },

  },

  reducers: {
    save(state, action) {
      const request = {
        list:action.payload,
        total:action.payload.length
      };
      return {
        ...state,
        data: request
      };
    },
    saveResult(state, action) {
      return {
        ...state,
        Result: action.payload,
      };
    },
    saveExperimental(state, action) {
      return {
        ...state,
        Experimental: action.payload,
      };
    },
    saveConfState(state, action) {
      return {
        ...state,
        ConfState: action.payload,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
    ForceDelete(state, action){
      const {data} = state;

      const lists = data.list;

      for (const i in action.payload) {
        lists.splice(lists.findIndex(item => item.id === action.payload[i].toString()), 1);
        const NewData = lists.filter(item =>
          item.parentIds.match(new RegExp(action.payload[i].toString()))
        );
        for (const j in NewData) {
          lists.splice(lists.findIndex(item => item.id === NewData[j].id), 1);
        }
      }

      return{
        ...state,
        data
      }
    },
  },
};
