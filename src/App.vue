<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Drawer from '@/components/Drawer.vue'; // 引入抽屜組件

const route = useRoute()
</script>

<template>
  <!-- <header>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
  </header> -->
  <div class="bgArea">
    <div v-if="route.path === '/userHome'" style="height: 50px;display: flex;align-items: center;justify-content: center;background-color: #A4804C;">
      <i class="fa-solid fa-pen-to-square"
            style="font-size: 20pt;margin-left:60px;margin-right: 10px;color: #fff;"></i>
        <span style="font-size: 20pt;color: #fff;font-family: Georgia, 'Times New Roman', Times, serif;">Questionnaire</span>
    </div>
    <div class="searchArea" v-if="route.path === '/'">
      <i class="fa-solid fa-pen-to-square"
            style="font-size: 20pt;margin-left:30px;margin-right: 10px;color: #fff;"></i>
        <span style="font-size: 18pt;margin-right: 30px;;color: #fff;font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Questionnaire</span>
      <div style="width: 2px;height: 50%;margin-right: 10px;background-color: #fff;"></div>
      <div class="searchTitle">
        <span class="titleText">標題</span>
        <el-input v-model="title" placeholder="請輸入關鍵字" clearable />
      </div>
      <div class="searchDate">
        <span>開始時間</span>
        <el-date-picker style="width:27%" v-model="startDate" type="date" placeholder="請選擇日期"
          value-format="YYYY-MM-DD" />
        <span>結束時間</span>
        <el-date-picker style="width:27%" v-model="endDate" type="date" placeholder="請選擇日期" value-format="YYYY-MM-DD" />

        <i class="fa-solid fa-magnifying-glass" @click="search"></i>
      </div>
    </div>
    <div style="display: flex;">
      <div v-if="route.path === '/' || route.path === '/userHome'" style="margin-top: 58px;margin-right:80px;">
        <Drawer />
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bgArea {
  background-color: #f4f4ed;

  .fa-trash,
  .fa-square-plus {
    font-size: 18pt;
    color: #fff;

    &:hover {
      color: #DBD3A4;
      cursor: pointer;
    }
  }

  .searchArea {
    height: 70px;
    background-color: $maincolor;
    display: flex;
    align-items: center;
    justify-content: center;


    .searchTitle {
      display: flex;
      align-items: center;
      padding: 0 10px;
      color: #fff;
      font-weight: 700;

      .titleText {
        width: 40px;
        padding-left: 10px;
      }

      :deep(.el-input__wrapper) {
        width: 300px;
        height: 28px;
        margin-left: 10px;
        padding-left: 10px;
        border-radius: 5px;
      }

      :deep(.el-input__inner) {
        color: $textcolor;

        &::placeholder {
          color: $textcolor;
        }

      }
    }

    .searchDate {
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: 700;

      span {
        padding: 0 10px;
      }

      :deep(.el-input__wrapper) {
        // background-color: #e2e8ee;
      }

      :deep(.el-input__inner) {
        color: $textcolor;

        &::placeholder {
          color: $textcolor;
        }
      }

      :deep(.el-input__prefix) {
        color: $textcolor;
      }


      .fa-magnifying-glass {
        padding-left: 20px;
        padding-right: 10px;
        font-size: 20pt;
        color: #fff;

        &:hover {
          cursor: pointer;
          color: #DBD3A4;
        }
      }
    }
  }
}
</style>
