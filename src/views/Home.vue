<script setup>
import Drawer from '@/components/Home/Drawer.vue'; // 引入抽屜組件

</script>

<template>
    <div class="bgArea">
        <div class="contentArea">
            <Drawer />
            <div class="routerViewArea">
                <router-view></router-view>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    background-color: #ffffff;
    .contentArea {
        display: flex;

        .routerViewArea {
            min-height: 550px;
        }
    }

    .footer {
        height: 60px;
        background-color: #d1bfa5;
    }

}
</style>