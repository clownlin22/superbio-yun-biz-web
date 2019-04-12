import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/casereviewapi/project/notice');
}

export async function queryActivities() {
  return request('/casereviewapi/activities');
}

export async function queryRule(params) {
  return request(`/casereviewapi/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/casereviewapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/casereviewapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/casereviewapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/casereviewapi/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/casereviewapi/fake_chart_data');
}

export async function queryTags() {
  return request('/casereviewapi/tags');
}

export async function queryBasicProfile() {
  return request('/casereviewapi/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/casereviewapi/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/casereviewapi/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/casereviewapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/casereviewapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/casereviewapi/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/casereviewapi/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/casereviewapi/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/casereviewapi/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/casereviewapi/captcha?mobile=${mobile}`);
}

export async function queryCaseState() {
  return request('/casereviewapi/getCaseStates');
}

export async function addCase(params) {
  return request('/casereviewapi/casereview', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryCase(params) {
  return request(`/biz-finance-web/api/remittanceBill/list?${stringify(params)}`);
}

export async function removeCase(params) {
  // return request('/casereviewapi/casereview', {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'delete',
  //   },
  // });
  return request(`/biz-finance-web/api/remittanceBill?ids=${params}`, {
    method: 'DELETE',
  });
}

export async function updateStatu(params) {
  return request(`/biz-finance-web/api/remittanceBill/auditTrue`, {
    method: 'POST',
    body: params,
  });
}

export async function updateReason(params) {
  return request(`/biz-finance-web/api/remittanceBill/auditFalse`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCaseData(params) {
  return request(`/biz-finance-web/api/remittanceBillBiz/infoList?${stringify(params)}`);
}
export async function getCaseData(params) {
  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);
}

export async function queryfileData(params) {
  return request(`/biz-finance-web/api/remittanceBillAttachment?${stringify(params)}`);
}

export async function queryfileById(params) {
  return request(`/spbbase-attachment-web/api/attachment/list?ids=${params}`);
}
