<template>
  <div class="table-container">
    <table class="m-table table-account">
      <thead>
        <tr>
          <th class="sticky-left checkbox-col"><input type="checkbox" /></th>
          <th style="width: 150px">Số hiệu tài khoản</th>
          <th style="width: 250px">Tên tài khoản</th>
          <th style="width: 120px">Tính chất</th>
          <th style="min-width: 300px">Diễn giải</th>
          <th class="text-center sticky-right action-col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" @dblclick="$emit('edit', item)">
          <td class="sticky-left checkbox-col"><input type="checkbox" /></td>

          <td :style="{ paddingLeft: getIndent(item.id) + 'px' }" class="font-bold">
            {{ item.id }}
          </td>

          <td>{{ item.accountName }}</td>
          <td>{{ formatType(item.accountType) }}</td>

          <td class="text-italic color-gray">{{ item.description || '---' }}</td>

          <td class="text-center sticky-right action-col">
            <div class="action-btns">
              <i class="fas fa-edit edit" @click="$emit('edit', item)" title="Sửa"></i>
              <i class="fas fa-trash-alt delete" @click="$emit('delete', item.id)" title="Xóa"></i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps(['data']);
defineEmits(['edit', 'delete']);

const getIndent = (code) => {
  if (!code) return 0;
  return code.length > 3 ? (code.length - 3) * 20 : 0;
};

const formatType = (type) => {
  const maps = { 1: 'Dư Nợ', 2: 'Dư Có', 3: 'Lưỡng tính' };
  return maps[type] || type;
};
</script>

<style lang="scss" scoped>
@use "../../assets/scss/masterData.scss" as *;

/* Css đặc thù riêng cho AccountTable nếu cần, 
phần lớn đã được đẩy sang masterData.scss dùng chung */
.checkbox-col {
  width: 45px;
  min-width: 45px;
  text-align: center;
}

.action-col {
  width: 100px;
  min-width: 100px;
}
</style>