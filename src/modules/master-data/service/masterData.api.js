import axios from 'axios';

const BASE_URL = '/api/v1/master-data';

export const MasterDataService = {
  // Lấy danh sách kèm phân trang & tìm kiếm
  getAll(params) {
    return axios.get(`${BASE_URL}`, { params });
  },
  // Lưu mới hoặc cập nhật
  save(data) {
    return data.Id ? axios.put(`${BASE_URL}/${data.Id}`, data) : axios.post(BASE_URL, data);
  },
  // Xóa đối tượng
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
};