<template>
    <div class="voucher-partner-container">
        <div class="info-grid">
            <!-- Ô 1: Khách hàng -->
            <div class="field-group flex-2">
                <label class="label-premium">{{ $attrs.label || 'Khách hàng' }}</label>
                <div class="input-wrapper">
                    <i class="fas fa-user-tie icon-inside"></i>
                    <select v-model="model.PartnerId" class="input-premium">
                        <option :value="null">-- Chọn khách hàng --</option>
                        <option v-for="p in partners" :key="p.id" :value="p.id">
                            {{ p.partnerName }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Ô 2: Người mua hàng -->
            <div class="field-group flex-1">
                <label class="label-premium">Người mua hàng</label>
                <div class="input-wrapper">
                    <i class="fas fa-user icon-inside"></i>
                    <input type="text" v-model="model.BuyerName" placeholder="Tên người nhận..."
                        class="input-premium" />
                </div>
            </div>

            <!-- Ô 3: Ngày hạch toán -->
            <div class="field-group flex-1">
                <label class="label-premium">Ngày hạch toán</label>
                <div class="input-wrapper">
                    <i class="fas fa-calendar-alt icon-inside"></i>
                    <input type="date" v-model="model.DocumentDate" class="input-premium" />
                </div>
            </div>

            <!-- Ô 4: Số chứng từ -->
            <div class="field-group flex-1">
                <label class="label-premium">Số chứng từ</label>
                <div class="input-wrapper"> 
                    <i class="fas fa-hashtag icon-inside"></i>
                    <input type="text" v-model="model.DocumentNo" placeholder="HDBH-0001" class="input-premium" />
                </div>
            </div>

            <!-- Ô 5: Kho hàng (MỚI THÊM) -->
            <div class="field-group flex-1">
                <label class="label-premium">Kho hàng</label>
                <div class="input-wrapper">
                    <i class="fas fa-warehouse icon-inside"></i>
                    <select v-model="model.WarehouseId" class="input-premium">
                        <option :value="null">-- Chọn kho --</option>
                        <option v-for="w in warehouses" :key="w.id" :value="w.id">
                            {{ w.warehouseName }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Thêm 'warehouses' vào props để nhận danh sách kho từ cha (PurchaseInvoicePage)
defineProps(['model', 'partners', 'warehouses']);
</script>

<style scoped>
.voucher-partner-container {
    width: 100%;
}

.info-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    /* Cho phép tự xuống hàng nếu màn hình quá hẹp */
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.flex-1 {
    flex: 1;
    min-width: 150px;
    /* Đảm bảo ô không bị quá nhỏ */
}

.flex-2 {
    flex: 2;
    min-width: 250px;
}

.label-premium {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-left: 4px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-wrapper:focus-within {
    border-color: #4f46e5;
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.12), 0 4px 6px -2px rgba(79, 70, 229, 0.04);
}

.input-premium {
    width: 100%;
    border: none;
    background: transparent;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    outline: none;
}

.icon-inside {
    margin-left: 12px;
    color: #94a3b8;
    font-size: 14px;
}

.input-wrapper.readonly {
    background: #f1f5f9;
    border-style: dashed;
}

.input-wrapper.readonly:focus-within {
    transform: none;
    box-shadow: none;
}

select.input-premium {
    cursor: pointer;
}
</style>