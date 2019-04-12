import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryRefunds(params) {
  // return request(`/api/finance/queryChargesNotes?${stringify(params)}`);
  return request(`/biz-finance-web/api/financeRefund?${stringify(params)}`);
}

export async function queryCaseInfos(params) {

  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);
}

export async function updateStatu(params) {
  return request(`/biz-finance-web/api/financeRefund/auditTrue`, {
    method: 'POST',
    body: params,
  });
}

export async function updateReason(params) {
  return request(`/biz-finance-web/api/financeRefund/auditFalse`, {
    method: 'POST',
    body: params,
  });
}

export async function removeByIds(params) {

  // return request(`/biz-finance-web/api/chargeItem?ids=${stringify(params)}`, {
  //     method: 'DELETE',
  //
  //   });
  return request(`/biz-finance-web/api/financeRefund?ids=${params.ids}&rebbids=${params.rebbids}`, {
    method: 'DELETE',
  });

}


