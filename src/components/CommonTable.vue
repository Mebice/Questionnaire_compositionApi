<!-- CommonTable.vue -->
<template>
    <div class="bgArea">
        <el-table stripe :data="data" style="width: 990px;"
            @row-click="onRowClick" :highlight-current-row="true">
            <slot></slot>
        </el-table>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: Array
});

const emit = defineEmits(['row-click']);

const currentRow = ref(null);

const onRowClick = (row) => {
    currentRow.value = row;
    emit('row-click', row);
};
</script>

<style lang="scss" scoped>

.bgArea{
    display: flex;
    justify-content: center;
    
}

  /* table整個 */
  :deep(.el-table) {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.28);
  }

  /* table標題 */
  :deep(.el-table th.el-table__cell) {
    text-align: center;
    padding: 7px 0;
    background-color: $maincolor;
    color: #ffffff;
    border-left: 1px solid #dddddd;
  }

  /* table表格內容 */
  :deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    text-align: center;
    padding: 5px 0;
    border: 1px solid #dddddd;
    color: $textcolor;
  }

  /* table 高亮行 */
  :deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background-color: #f3eee7;
  }

</style>