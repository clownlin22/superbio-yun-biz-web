import { stringify } from 'qs';
import request from '@/utils/request';

export async function getDistrict(params) {
  return request(`/spbbase-district-web/api/districts?${stringify(params)}`)
}

export async function save(params) {
  return request(`/spbbase-district-web/api/districts/save?${stringify(params)}`,{
    method:'POST'
  })
}

export async function updateDistrictByCode(params) {
  return request(`/spbbase-district-web/api/districts?${stringify(params)}`,{
    method:'PUT'
  });
}

export async function removeBatch(params) {
  return request(`/spbbase-district-web/api/districts?codes=${params}`,{
    method:'DELETE',
  });
}

export async function forceDelete(params) {
  return request(`/spbbase-district-web/api/districts/enforcement?codes=${params}`,{
    method:'DELETE',
  });
}


















export async function insertDistrict(params) {
  return request(`/spbbase-authcenter-web/api/District/insertOne?${stringify(params)}`);
}

export async function selectDistrictByCodeOrName(params) {
  return request(`/spbbase-district-web/api/districts?${stringify(params)}`)
}

export async function selectDistrictChilendByCode(params) {
  return request(`/spbbase-district-web/api/districts?${stringify(params)}`)
}
