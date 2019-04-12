import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryReportData(params) {

  // return request(`/api/authcenter/dictValue?${stringify(params)}`);
  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);

}

export async function updateStatu(params) {
  // return request(`/api/authcenter/dictValue`, {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'updateStatusValue',
  //   },
  // });
  // return request(`/biz-cases-web/api/case/status`,{
  //   method: 'POST',
  //   body: params,
  // })
  return request(`/biz-cases-web/api/case/status?ids=${params.ids}&status=${params.status}`, {
    method: 'POST',
  });
}

export async function queryChooses() {
  return request(`/dictapi/setChooses`);
}

export async function queryCaseState() {
  return request('/caseapi/getCaseStates');
}
