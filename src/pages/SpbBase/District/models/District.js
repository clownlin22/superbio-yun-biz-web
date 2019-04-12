import {
  getDistrict,
  save,
  removeBatch,
  forceDelete,
  updateDistrictByCode
} from '@/services/District';

export default {
  namespace: 'DistrictModel',

  state: {
    data: {
      list: [],
      total: {},
    },
  },

  effects: {

    *getDistrict({ payload }, { call, put }) {
      const response = yield call(getDistrict, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *checkCode({ payload }, { call, put }) {
      const response = yield call(getDistrict, payload);
      payload.resolve(response)
    },

    *selectDistrictChilendByCode({ payload }, { call, put }) {
      const response = yield call(getDistrict, payload);
      if (response.length!=0) {
        yield put({
          type: 'add',
          payload: response,
        });
      }
    },

    *addDistrict({ payload },{ call, put }){
      const response = yield call (save,payload);
      if (response!==undefined){
        yield put({
          type:'add',
          payload:response,
        })
      }
    },

    *removeBatch({payload},{call,put}){
      const response = yield call(removeBatch,payload);
      yield put({
        type:'remove',
        payload:payload,
      })
    },

    *forceDelete({payload},{call,put}){
      console.log("model层：forceDelete");
      const response = yield call(forceDelete,payload);
      yield put({
        type:'ForceDelete',
        payload:payload
      })
    },

    *updateDistrictByCode({ payload }, { call, put }) {
      const response = yield call(updateDistrictByCode, payload);
       yield put({
         type: 'update',
         payload: response,
       });
    },

  },

  reducers: {

    update(state, action) {
      const { data } = state;
      const newData = data.list.map(item => ({ ...item }));
      newData.splice(newData.findIndex(item => item.code === action.payload.code), 1);
      newData.push(action.payload);

      const request = {
        list:newData,
        total:newData.length
      };
      return {
        ...state,
        data: request,
      };
    },

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

    add(state, action) {
      const { data } = state;
      const newData = data.list.map(item => ({ ...item }));
      if (Array.isArray(action.payload)) {
        newData.push(...action.payload);
      } else {
        newData.push(action.payload);
      }

      let hash = {};
      const dataList = newData.reduce((preVal, curVal) => {
        hash[curVal.code] ? '' : hash[curVal.code] = true && preVal.push(curVal);
        return preVal
      }, []);

      const request = {
        list:dataList,
        total:dataList.length
      };

      return {
        ...state,
        data: request,
      };
    },

    remove(state,action){
      console.log("+++++++++++++++++++++删除");
      const {data} = state;
      const list = data.list;
      for(const i in action.payload){
        list.splice(list.findIndex(item => item.code === action.payload[i].toString()),1);
      }
      const request = {
        list:list,
        total:list.length
      };
      console.log("+++++++++++++++++++++",list);
      return{
        ...state,
        data:request
      }
    },

    ForceDelete(state, action){
      console.log("data");
      const {data} = state;

      const list = data.list;

      for (const i in action.payload) {
        list.splice(list.findIndex(item => item.code === action.payload[i].toString()), 1);
        const NewData = list.filter(item =>
          item.parentCodes.match(new RegExp(action.payload[i].toString()))
        );
        for (const j in NewData) {
          list.splice(list.findIndex(item => item.code === NewData[j].code), 1);
        }
      }

      console.log(list);
      const request = {
        list:list,
        total:list.length
      };

      return{
        ...state,
        data:data
      }
    },

  },
};
