<template>
    <div class="report-card" v-if="reports.length > 0">
        <div class="card-header">
            <div class="icon-box theme-blue">
                <i class="fas fa-warehouse"></i>
            </div>
            <h3 class="card-title">Báo cáo Kho - Vật tư</h3>
        </div>

        <ul class="report-list">
            <li v-for="report in reports" :key="report.id" class="report-item" @click="$emit('open-report', report)">
                <div class="item-info">
                    <i class="far fa-file-alt text-icon"></i>
                    <span class="report-name">{{ report.name }}</span>
                </div>
                <div class="action-view">
                    <span>Xem</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
defineProps({ reports: { type: Array, required: true } });
defineEmits(['open-report']);
</script>

<style scoped>
/* Copy toàn bộ CSS từ FinancialReportCard.vue xuống đây, chỉ thay dòng màu cuối cùng */
.report-card {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
}

.report-card:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    border-color: #e2e8f0;
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #e2e8f0;
}

.icon-box {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-right: 16px;
}

.card-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.report-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s ease;
}

.report-item:hover {
    background-color: #f8fafc;
    border-color: #e2e8f0;
}

.item-info {
    display: flex;
    align-items: center;
    color: #475569;
}

.text-icon {
    color: #94a3b8;
    margin-right: 12px;
    font-size: 16px;
}

.report-name {
    font-size: 14px;
    font-weight: 500;
}

.report-item:hover .item-info {
    color: #0f172a;
}

.report-item:hover .text-icon {
    color: #6366f1;
}

.action-view {
    display: flex;
    align-items: center;
    color: #6366f1;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
}

.action-view i {
    margin-left: 6px;
}

.report-item:hover .action-view {
    opacity: 1;
    transform: translateX(0);
}

/* Màu sắc riêng cho thẻ Kho */
.theme-blue {
    background-color: #e0f2fe;
    color: #0ea5e9;
}
</style>