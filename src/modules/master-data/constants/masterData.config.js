// constants/masterData.config.js
export const MASTER_DATA_TYPES = {
  ACCOUNT: 'ACCOUNT',
  CUSTOMER: 'CUSTOMER',
  SUPPLIER: 'SUPPLIER',
  PRODUCT: 'PRODUCT',
  WAREHOUSE: 'WAREHOUSE'
};

export const MENU_CONFIG = [
  { id: MASTER_DATA_TYPES.ACCOUNT, label: 'Hệ thống tài khoản', icon: 'pi pi-book' },
  { id: MASTER_DATA_TYPES.CUSTOMER, label: 'Khách hàng', icon: 'pi pi-users' },
  { id: MASTER_DATA_TYPES.SUPPLIER, label: 'Nhà cung cấp', icon: 'pi pi-truck' },
  { id: MASTER_DATA_TYPES.PRODUCT, label: 'Vật tư hàng hóa', icon: 'pi pi-box' },
  { id: MASTER_DATA_TYPES.WAREHOUSE, label: 'Kho', icon: 'pi pi-home' }
];

// Định nghĩa cột hiển thị cho từng loại
export const COLUMN_CONFIG = {
  [MASTER_DATA_TYPES.CUSTOMER]: [
    { field: 'code', header: 'Mã khách hàng', width: '150px' },
    { field: 'name', header: 'Tên khách hàng', width: '250px' },
    { field: 'taxCode', header: 'Mã số thuế', width: '150px' },
    { field: 'address', header: 'Địa chỉ', width: '300px' },
  ],
  [MASTER_DATA_TYPES.ACCOUNT]: [
    { field: 'accountNumber', header: 'Số hiệu tài khoản', width: '150px' },
    { field: 'accountName', header: 'Tên tài khoản', width: '250px' },
    { field: 'type', header: 'Tính chất', width: '150px' },
  ],
  // ... các danh mục khác tương tự
};