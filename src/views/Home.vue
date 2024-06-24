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
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    .contentArea {
        display: flex;

        .routerViewArea {
            height: 600px;
        }
    }
}
</style>