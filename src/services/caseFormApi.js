import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryEntrust(params) {
  return request(`/api/authcenter/entrust?${stringify(params)}`);
}


export async function queryCharging(params) {
  return request(`/api/finance/queryChargesNotes?${stringify(params)}`);
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

export async function querycaseGetId(params) {
  return request(`/biz-cases-web/api/case/get?id=${params.ids}`);
}
export async function queryAttachMent(params) {
  return request(`/spbbase-attachment-web/api/attachment/list?ids=${params}`);
}
export async function queryGetAttach(params) {
  return request(`/spbbase-attachment-web/api/attachment/list?ids=${params.payload}`);
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

export async function addCase(params) {
  return request('/biz-cases-web/api/case/save', {
    method: 'POST',
    body: {
      ...params.formVal,
    },
  });
}


export async function updateCase(params) {
  return request('/biz-cases-web/api/case/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
