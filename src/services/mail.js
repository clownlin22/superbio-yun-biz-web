import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryFinance(params) {
  return request(`/api/maillist/list?${stringify(params)}`);
}

export async function insert(params) {
  return request(`/biz-mail-web/api/biz_mail/insert`,{
    method: 'POST',
    body:params
  });
}


export async function list(params) {
  console.log("list");
  return request(`/biz-mail-web/api/biz_mail/list`,{
    method: 'POST',
    body:params
  });
}

export async function queryFinance1(params) {
  return request(`/api/maillist/list?${stringify(params)}`);
}
