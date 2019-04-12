import { stringify } from 'qs';
import request from '@/utils/request';

export async function page(params) {
  return request(`/spbbase-attachment-web/api/attachment/page?${stringify(params)}`);
}

export async function removeByIds(params) {
  return request(`/spbbase-attachment-web/api/attachment?ids=${params}`,{
    method:'DELETE',
  });
}

export async function download(params) {
  return request(`/spbbase-attachment-web/api/attachment/{id}/download?${stringify(params)}`,{
    method:'GET',
  });
}

export async function see(params) {
  return request(`/spbbase-attachment-web/api/attachment/see?${stringify(params)}`,{
    method:'GET',
  });
}

export async function enabled(params) {
  return request(`/spbbase-attachment-web/api/attachment/{id}?${stringify(params)}`,{
    method:'PUT',
  });
}

export async function add(params) {
  return request(`/spbbase-attachment-web/api/attachment`,{
    method: 'POST',
    body:params.formData,
  })
}

export async function update(params) {
  return request(`/spbbase-attachment-web/api/attachment`,{
    method: 'PUT',
    body: params
  })
}

