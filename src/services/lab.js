import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/lab/project/notice');
}

export async function queryActivities() {
  return request('/lab/activities');
}
//
export async function queryExper(params) {
  return request(`/lab/exper?${stringify(params)}`);
}

export async function removeExper(params) {
  return request('/lab/exper', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addExper(params) {
  return request('/lab/exper', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateExper(params) {
  return request('/lab/exper', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

//
export async function queryExce(params) {
  return request(`/lab/exce?${stringify(params)}`);
}

export async function removeExce(params) {
  return request('/lab/exce', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addExce(params) {
  return request('/lab/exce', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateExce(params) {
  return request('/lab/exce', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

//
export async function queryMana(params) {
  return request(`/lab/mana?${stringify(params)}`);
}

export async function removeMana(params) {
  return request('/lab/mana', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addMana(params) {
  return request('/lab/mana', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateMana(params) {
  return request('/lab/mana', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryBasicProfile() {
  return request('/lab/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/lab/profile/advanced');
}

export async function fakeChartData() {
  return request('/lab/fake_chart_data');
}
