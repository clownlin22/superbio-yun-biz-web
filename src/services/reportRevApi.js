import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryReportRevData(params) {
  // return request(`/api/authcenter/dictValue?${stringify(params)}`);
  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);
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

export async function queryChooses() {
  return request(`/dictapi/setChooses`);
}

export async function queryCaseState() {
  return request('/caseapi/getCaseStates');
}
