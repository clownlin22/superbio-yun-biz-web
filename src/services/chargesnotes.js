import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryChargesNotes(params) {
  // return request(`/api/finance/queryChargesNotes?${stringify(params)}`);
  return request(`/biz-finance-web/api/chargeItem?${stringify(params)}`);
}

export async function addChargeNotes(params) {
  return request(`/biz-finance-web/api/chargeItem/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function removeByIds(params) {

  // return request(`/biz-finance-web/api/chargeItem?ids=${stringify(params)}`, {
  //     method: 'DELETE',
  //
  //   });
  return request(`/biz-finance-web/api/chargeItem?ids=${params}`,{
    method:'DELETE',
  });

}

export async function updateChargeNotes(params) {

  return request(`/biz-finance-web/api/chargeItem/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
