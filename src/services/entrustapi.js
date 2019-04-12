import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/entrustapi/project/notice');
}

export async function queryActivities() {
  return request('/entrustapi/activities');
}

export async function queryRule(params) {
  return request(`/api/authcenter/entrust?${stringify(params)}`);
}
export async function queryAll() {
  return request(`/api/authcenter/entrust`);
}
export async function addRule(params) {
  return request('/api/authcenter/entrust', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function removeRule(params) {
  return request('/api/authcenter/entrust', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}



export async function updateEntrust(params) {
  return request('/api/authcenter/entrust', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryExperimental() {
  return request(`/api/permission`);
}
export async function fakeSubmitForm(params) {
  return request('/entrustapi/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/entrustapi/fake_chart_data');
}

export async function queryTags() {
  return request('/entrustapi/tags');
}

export async function queryBasicProfile() {
  return request('/entrustapi/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/entrustapi/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/entrustapi/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/entrustapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}
export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/entrustapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/entrustapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/entrustapi/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/entrustapi/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/entrustapi/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/entrustapi/captcha?mobile=${mobile}`);
}

export async function queryChooses() {
  return request(`/entrustapi/setChooses`);
}

export async function queryCategorys() {
  return request(`/api/authcenter/getCategorys`);
}

