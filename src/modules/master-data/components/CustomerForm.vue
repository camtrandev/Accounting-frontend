<template>
  <div class="bg-white p-4 rounded-xl shadow">
    <h3 class="text-lg font-semibold mb-3">
      Khách hàng / NCC (Demo)
    </h3>

    <input placeholder="Tên khách hàng" class="input mb-2 w-full" />
    <input placeholder="Số điện thoại" class="input mb-2 w-full" />
    <input placeholder="Địa chỉ" class="input mb-2 w-full" />

    <button class="btn-primary mt-2">
      Lưu
    </button>
  </div>
</template>

<style scoped>
.input {
  border: 1px solid #ddd;
  padding: 6px;
  border-radius: 6px;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
}
</style>