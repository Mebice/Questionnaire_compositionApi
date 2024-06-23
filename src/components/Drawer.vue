<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const currentPage = ref(1); // 當前頁碼
const drawer = ref(false) // 用於控制抽屜開閉狀態
const direction = ref('ltr'); // 用於設定抽屜開啟方向，可以是 'ltr', 'rtl', 'ttb', 'btt'
const isHovered1 = ref(false);  // 綁hover時的樣式
const isHovered2 = ref(false);  // 綁hover時的樣式
const isHoveredBack = ref(false);  // 綁hover時的樣式

// 切換管理或用戶的頁面
const activeRouterLink = () => {
    currentPage.value = 1  // 讓當前頁回到第一頁
    sessionStorage.setItem('currentPage', JSON.stringify(currentPage.value)) // 將當前頁存在sessionStorage
}

// 處理切換後的樣式
const activeStyle = {
    backgroundColor: '#A4804C',
    color: '#fff',
};

// hover時的樣式
const hoverStyle = {
    backgroundColor: '#A4804C',
    color: '#fff',
    opacity: '0.6',
};
// hover時的樣式
const hoverBackStyle = {
    color: '#A4804C',
    opacity: '0.6',
};

</script>

<template>
    <i class="fa-solid fa-circle-chevron-right" @click="drawer = true"></i>

    <el-drawer v-model="drawer" :direction="direction" :with-header="false" style="padding-top: 50px;">
        <i class="fa-solid fa-pen-to-square"
            style="font-size: 20pt;margin-left:60px;margin-right: 10px;color: #A4804C;"></i>
        <span
            style="font-size: 20pt;color: #A4804C;font-family: Georgia, 'Times New Roman', Times, serif;">Questionnaire</span>
        <br />
        <div style="height: 2px;margin-top: 60px;background-color: #A4804C;"></div>
        <div class="routerItemArea" style="margin-top: 60px;">

            <RouterLink :style="$route.path === '/' ? activeStyle : 'color: #A4804C', isHovered1 ? hoverStyle : ''" @click="activeRouterLink"
                @mouseenter="isHovered1 = true" @mouseleave="isHovered1 = false" class="routerLinkItem1" :to="'/'"
                style="font-size:15pt;padding: 5px 110px;text-decoration: none;">
                <i class="fa-solid fa-gear"></i>
                <span class="routerText1" style="margin-left: 10px;">Manager</span>
            </RouterLink>
            <div style="height: 20px;"></div>
            <RouterLink :style="$route.path === '/userHome' ? activeStyle : 'color: #A4804C', isHovered2 ? hoverStyle : ''" @click="activeRouterLink"
                @mouseenter="isHovered2 = true" @mouseleave="isHovered2 = false" class="routerLinkItem2"
                :to="'/userHome'" style="font-size:15pt;padding: 5px 145px 5px 110px;text-decoration: none;">
                <i class="fa-solid fa-circle-user"></i>
                <span class="routerText2" style="margin-left: 10px;">User</span>
            </RouterLink>
        </div>
        <template #footer>
            <el-button link @click="drawer = false" :style="isHoveredBack ? hoverBackStyle : ''" 
            @mouseenter="isHoveredBack = true" @mouseleave="isHoveredBack = false" style="font-size:15pt;margin-right:130px;color:#A4804C;">
                <i class="fa-solid fa-circle-chevron-left" style="margin-right: 10px;"></i>Back</el-button>
        </template>
    </el-drawer>
</template>

<style lang="scss" scoped>
.fa-circle-chevron-right {
    font-size: 18pt;
    color: $maincolor;

    &:hover {
        color: #DBD3A4;
        cursor: pointer;
    }
}

:deep(.el-drawer) {
    padding-top: 50px;

    .routerItemArea {
        display: flex;
        flex-direction: column;
        margin-top: 60px;

        .routerLinkItem1,
        .routerLinkItem2 {
            font-size: 15pt;
            color: $maincolor;

            &:hover {
                background-color: $maincolor;
                color: #fff;
                opacity: 0.6;
            }

            &.active {
                background-color: $maincolor;
                color: #fff;
            }
        }

        .routerLinkItem1 {
            padding: 5px 107px;
        }

        .routerLinkItem2 {
            padding: 5px 65px 5px 108px;
        }

        .routerText1,
        .routerText2 {
            margin-left: 10px;
            text-decoration: none;
            font-family: Arial, Helvetica, sans-serif;
        }
    }
}

:deep(.el-button) {
    font-size: 16pt;
    margin-right: 130px;
    color: #A4804C;

    &:hover {
        color: #DBD3A4;
    }
}
</style>