<template>
  <div class="card" :class="color">

    <div class="icon">
      {{ icon }}
    </div>

    <div class="content">

      <div class="title">
        {{ title }}
      </div>

      <div class="value">
        {{ value }}
      </div>

      <div class="change" :class="trend">
        {{ change }}
      </div>

    </div>

  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  change: String,
  trend: String, // up | down
  color: String, // blue | green | yellow | purple
  icon: String
})
</script>

<style scoped>

.card {

  display: flex;
  align-items: center;

  padding: 16px;

  border-radius: 12px;

  min-width: 220px;

  background: white;

  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* Icon */

.icon {

  width: 48px;
  height: 48px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;

  margin-right: 12px;
}

/* Content */

.title {
  font-size: 13px;
  color: #6b7280;
}

.value {
  font-size: 18px;
  font-weight: 700;
  margin: 4px 0;
}

.change {
  font-size: 12px;
}

/* Trend */

.up {
  color: #16a34a;
}

.down {
  color: #dc2626;
}

/* Color variants */

.blue .icon {
  background: #dbeafe;
  color: #2563eb;
}

.green .icon {
  background: #dcfce7;
  color: #16a34a;
}

.yellow .icon {
  background: #fef9c3;
  color: #ca8a04;
}

.purple .icon {
  background: #ede9fe;
  color: #7c3aed;
}

</style>