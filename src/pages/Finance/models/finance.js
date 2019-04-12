import {
  queryFinance,
  updateCase,
  selectCategory,
  selectStatus,
  moneyStatus,
  deleteRows,
  addFinancePro,
  addFinanceRefund,
  queryCase,
  queryCaseBill,
  upload,
} from '@/services/finance';

export default {
  namespace: 'financeModel',

  state: {
    data: {
      // list: [],
      // pagination: {},
    },
    ProfessionalTypes: [
      {
        title: '亲子鉴定',
        dataIndex: 0,
      },
      {
        title: '文书鉴定',
        dataIndex: 1,
      },
      {
        title: '酒精鉴定',
        dataIndex: 2,
      },
      {
        title: '车辆痕迹鉴定',
        dataIndex: 3,
      },
      {
        title: '法医临床鉴定',
        dataIndex: 4,
      },
      {
        title: '法医病理鉴定',
        dataIndex: 5,
      },
    ],
    status: [
      {
        title: '已登记',
        dataIndex: 0,
      },
      {
        title: '待审核',
        dataIndex: 1,
      },
      {
        title: '审核不通过',
        dataIndex: 2,
      },
      {
        title: '实验中',
        dataIndex: 3,
      },
      {
        title: '报告制作',
        dataIndex: 4,
      },
      {
        title: '签发中',
        dataIndex: 5,
      },
      {
        title: '报告打印',
        dataIndex: 6,
      },
      {
        title: '发放中',
        dataIndex: 7,
      },
      {
        title: '归档',
        dataIndex: 8,
      },
    ],
    moneyStatus: [
      {
        title: '未汇款',
        dataIndex: 0,
      },
      {
        title: '已汇款',
        dataIndex: 1,
      },
      {
        title: '已退款',
        dataIndex: 2,
      },
    ],
    BillBiz: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryFinance, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetch2({ payload }, { call, put }) {
      const response = yield call(queryCaseBill, payload);
      yield put({
        type: 'save1',
        payload: response,
      });
    },
    * selectCategory({ payload }, { call, put }) {
      const response = yield call(selectCategory, payload);
      yield  put({
        type: 'save',
        payload: response,
      });
    },
    * selectStatus({ payload }, { call, put }) {
      const response = yield call(selectStatus, payload);
      yield  put({
        type: 'save',
        payload: response,
      });
    },
    * selectMoneyStatus({ payload }, { call, put }) {
      const response = yield call(moneyStatus, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateCase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteRows, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addFinancePro, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    * addRefund({ payload, callback }, { call, put }) {
      const response = yield call(addFinanceRefund, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      // if (callback) callback();
    },
    * upload({ payload }, { call, put }) {
      const response = yield call(upload, payload);
      // payload.resolve(response);
      // const response = yield call(upload,payload);
      // yield put({
      //   type: 'load',
      //   payload: response
      // });
      // payload.resolve(response)
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
    save1(state, action) {
      const request = {
        list: action.payload,
        total: action.length,
      };
      return {
        ...state,
        BillBiz: request,
      };
    },
  },

};
