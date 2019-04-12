import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryFinance(params) {
  // return request(`/api/finance/list?${stringify(params)}`);
  // return request(`/biz-finance-web/api/financePro?${stringify(params)}`);
  return request(`/biz-cases-web/api/case/list?${stringify(params)}`);
}

export async function queryCase(params) {
  return request(`/biz-finance-web/api/remittanceBill/list?${stringify(params)}`);
}

export async function queryCaseBill(params) {
  return request(`/biz-finance-web/api/remittanceBillBiz?${stringify(params)}`);
}

export async function addFinancePro(params) {
  return request(`/biz-finance-web/api/remittanceBill/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addFinanceRefund(params) {
  return request(`/biz-finance-web/api/financeRefund/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function selectProfessionalTypes() {
  return request(`/api/finance/ProfessionalTypes`);
}

export async function selectClient() {
  return request(`/api/finance/client`);
}

export async function selectStatus() {
  return request(`/api/finance/status`);
}

export async function selectMoneyStatus() {
  return request(`/api/finance/moneyStatus`);
}

export async function updateCase(params) {
  return request(`/api/finance/list`, {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function upload(params) {

  return request(`/spbbase-attachment-web/api/attachment`, {
    method: 'POST',
    body: params.formData,
  });
}


