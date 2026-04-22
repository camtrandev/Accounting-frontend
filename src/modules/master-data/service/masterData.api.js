export async function getAccounts() {
  return [
    { id: 1, code: "1", name: "Tài sản", parentId: null, level: 1, type: "Tài sản", nature: "Nợ", active: true },
    { id: 2, code: "11", name: "Tiền", parentId: 1, level: 2, type: "Tài sản", nature: "Nợ", active: true },
    { id: 3, code: "111", name: "Tiền mặt", parentId: 2, level: 3, type: "Tài sản", nature: "Nợ", active: true },

    { id: 4, code: "131", name: "Phải thu KH", parentId: 1, level: 2, type: "Công nợ", nature: "Có", active: true },

    { id: 5, code: "338", name: "Phải trả", parentId: null, level: 1, type: "Công nợ", nature: "Có", active: false }
  ]
}