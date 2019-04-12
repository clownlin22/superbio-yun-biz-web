import { queryFinance,insert,list} from '@/services/mail';
import { querCase} from '@/services/caseapi';
export default {
  namespace: 'mailModel',
  state: {
    data: {
      list: [],
      pagination: {},
    },

    mailData:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFinance, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchMail({ payload }, { call, put }) {
      console.log("fetchMail");
      const response = yield call(list, payload);
      yield put({
        type: 'saveMail',
        payload: response,
      });
    },


    *insert({ payload }, { call, put }){
      const response = yield call(insert, payload.mailList);
      payload.resolve(response)
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    saveMail(state, action) {
      return {
        ...state,
        mailData: action.payload,
      };
    },
  },
};
