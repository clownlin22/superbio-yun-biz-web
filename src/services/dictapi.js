import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/dictapi/project/notice');
}

export async function queryActivities() {
  return request('/dictapi/activities');
}

export async function queryRule(params) {
  return request(`/api/authcenter/dict?${stringify(params)}`);
}
export async function queryAll() {
  return request(`/api/authcenter/dict`);
}
export async function addRule(params) {
  return request('/api/authcenter/dict', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function removeRule(params) {
  return request('/api/authcenter/dict', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}


export async function updateStatus(params) {
  return request(`/api/authcenter/dict`, {
    method: 'POST',
    body: {
      ...params,
      method: 'updateStatus',
    },
  });


}
export async function updateExper(params) {
  return request('/api/authcenter/dict', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryDictData(params) {
  return request(`/api/authcenter/dictValue?${stringify(params)}`);
}

export async function updateStatusValue(params) {
  return request(`/api/authcenter/dictValue`, {
    method: 'POST',
    body: {
      ...params,
      method: 'updateStatusValue',
    },
  });
}
export async function updateDictStatus(params) {
  return request(`/api/authcenter/dict`, {
    method: 'POST',
    body: {
      ...params,
      method: 'updateStatusValue',
    },
  });
}

export async function removeDictData(params) {
  return request(`/api/authcenter/dictValue`, {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addDictData(params) {
  return request('/api/authcenter/dictValue', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateDictData(params) {
  return request('/api/authcenter/dictValue', {
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
  return request('/dictapi/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/dictapi/fake_chart_data');
}

export async function queryTags() {
  return request('/dictapi/tags');
}

export async function queryBasicProfile() {
  return request('/dictapi/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/dictapi/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/dictapi/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/dictapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/dictapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/dictapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/dictapi/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/dictapi/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/dictapi/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/dictapi/captcha?mobile=${mobile}`);
}

export async function queryChooses() {
  return request(`/dictapi/setChooses`);
}

