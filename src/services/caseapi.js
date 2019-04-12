import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/caseapi/project/notice');
}

export async function queryActivities() {
  return request('/caseapi/activities');
}

export async function queryRule(params) {
  return request(`/caseapi/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/caseapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/caseapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/caseapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/caseapi/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/caseapi/fake_chart_data');
}

export async function queryTags() {
  return request('/caseapi/tags');
}

export async function queryBasicProfile() {
  return request('/caseapi/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/caseapi/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/caseapi/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/caseapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/caseapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/caseapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/caseapi/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/caseapi/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/caseapi/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/caseapi/captcha?mobile=${mobile}`);
}

/* 案件列表 */
export async function queryCase(params) {
  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);
}

export async function querycaseGetId(params) {
  return request(`/biz-cases-web/api/case/get?id=${params}`);
}

export async function queryMater(params) {
  return request(`/biz-cases-web/api/case/getMaterials?id=${params.ids}`);
}

export async function removeCase(params) {
  console.log(params.ids,'params.ids')
  return request(`/biz-cases-web/api/case/removeBatch?ids=${params.ids}`, {
    method: 'GET',
  });
}

export async function updateStatu(params) {
  return request(`/biz-cases-web/api/case/status?ids=${params.ids}&status=${params.status}`, {
    method: 'POST',
  });
}

export async function addCase(params) {
  return request('/biz-cases-web/api/case/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateCase(params) {
  return request('/caseapi/casedemo', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
export async function queryCaseState() {
  return request('/caseapi/getCaseStates');
}

export async function upload(params) {
  // return request(`/biz-cases-web/api/case/upload`,{
  //   method: 'POST',
  //   body:params.formData,
  // })
  return request(`/spbbase-attachment-web/api/attachment`,{
    method: 'POST',
    body:params.formData,
  })
}
