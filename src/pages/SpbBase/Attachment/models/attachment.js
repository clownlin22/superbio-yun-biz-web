import { page,add,removeByIds,enabled,update,download} from '@/services/attachment';

export default {
  namespace: 'AttachmentModal',

  state: {
    data: {
    },

    bizType:[
      {
        title:"亲子鉴定",
        dataIndex:"亲子鉴定"
      },
      {
        title:"文书鉴定",
        dataIndex:"文书鉴定"
      },
      {
        title:"酒精鉴定",
        dataIndex:"酒精鉴定"
      },
      {
        title:"车辆痕迹鉴定",
        dataIndex:"车辆痕迹鉴定"
      },
      {
        title:"法医临床鉴定",
        dataIndex:"法医临床鉴定"
      },
    ]
  },

  effects: {
    *page({ payload }, { call, put }) {
      const response = yield call(page, payload);
      yield put({
        type: 'save',
        payload: {
          ...response,
          pageSize:payload.pageSize,
          current:payload.currentPage
        },
      });
    },

    *add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      payload.resolve(response)
    },

    *removeByIds({payload},{call,put}){
      const response = yield call(removeByIds,payload.ids);
      payload.resolve(response)
    },

    *enabled({payload},{call,put}){
      console.log(payload.AttachmentList);
      const response = yield call(enabled,payload.AttachmentList);
    },

    *update({payload},{call,put}){
      console.log("payload.AttachmentList",payload.AttachmentList)
      const response = yield call(update,payload.AttachmentList);
      payload.resolve(response)
    },

    *download({payload},{call,put}){
      const response = yield call(download,payload);
      payload.resolve(response)
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list:action.payload.items,
          pagination: {
            total:action.payload.count,
            pageSize:action.payload.pageSize,
            current:action.payload.current,
          },
        }
      };
    },
  },
};
