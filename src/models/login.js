import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { queryAuthorities, getFakeCaptcha, getToken, removetoken } from '@/services/api';
import { setAuthority } from '@/utils/authority';
// import { setToken } from '@/utils/token';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const tokenParams = {
        grant_type: 'password',
        username: payload.userName,
        password: payload.password,
      };
      const resToken = yield call(getToken, tokenParams);
      let response = {};
      if (resToken) {
        const resAuths = yield call(queryAuthorities, payload);
        console.log(resAuths)
        response = {
          status: 'ok',
          type: payload.type,
          token: resToken.access_token,
          currentAuthority: resAuths,
        };
      } else {
        response = {
          status: 'error',
          type: payload.type,
        };
      }
      // const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      yield call(removetoken);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          token: '',
          currentAuthority: '',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setToken(payload.token);
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
