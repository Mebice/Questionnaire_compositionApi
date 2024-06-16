<script setup>
import { ref, onMounted } from 'vue';

const title = ref('');
const description = ref('');
const startDate = ref('');
const endDate = ref('');
const questionList = ref([{ qTitle: '', type: '', isNecessary: true, options: [{ value: '' }, { value: '' }] }]);

// 从本地存储加载
const loadFromSessionStorage = () => {
    const formData = JSON.parse(sessionStorage.getItem('formData'));
    if (formData) {
        title.value = formData.title;
        description.value = formData.description;
        startDate.value = formData.startDate;
        endDate.value = formData.endDate;
        questionList.value = formData.questionList;
    }
};

onMounted(() => {
    loadFromSessionStorage();
});
</script>

<template>
    <div class="bgArea">
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ startDate + ' ~ ' + endDate }}</p>
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
        </div>
        <div class="infoArea">
            <div class="personalInfoContentArea">
                <div class="infoTop">基本資料</div>
                <div class="personalInfoContent">
                    <label for="">姓名</label>
                    <input type="text" :disabled="true">
                    <label for="">手機</label>
                    <input type="text" :disabled="true">
                </div>
                <div class="personalInfoContent">
                    <label for="">信箱</label>
                    <input type="text" :disabled="true">
                    <label for="">年齡</label>
                    <input type="text" :disabled="true">
                </div>
            </div>
        </div>
        <!-- 顯示題目列表 -->
        <div class="questionListArea">
            <div class="questionList" v-for="(questionItem, questionIndex) in questionList" :key="questionItem.id">
                <div class="questionListInside">
                    <div class="qTitleAndNecessary">
                        <p>{{ questionIndex + 1 + '. ' + questionItem.qTitle + ' (' + questionItem.type + ')' }}</p>
                        <span v-if="questionItem.isNecessary" style="color: red;font-size:10pt">*[必填]</span>
                    </div>
                    <!-- 根據問題類型呈現選項 -->
                    <div v-if="questionItem.type === '多選'">
                        <div class="option-checkbox" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-checkbox v-model="option.value" disabled>{{ option.value }}</el-checkbox>
                        </div>
                    </div>
                    <div v-else>
                        <div class="option-radio" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-radio-group v-model="option.value" disabled>
                                <el-radio value="option" >{{ option.value }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.bgArea {

    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f4f4ed;

    .titleArea {
        width: 850px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        padding-top: 15px;
        padding-bottom: 10px;
        margin: 20px 0;
        color: #6e4e23;
        font-weight: 700;

        h2 {
            height: 15px;
            margin-top: 10px;
        }
    }

    .infoArea {
        width: 850px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        padding: 2% 0 2% 0;
        margin-bottom: 20px;
        color: #6e4e23;
        font-weight: 700;

        .infoTop {
            width: 100%;
            text-align: center;
            margin: 20px 0;
        }

        .personalInfoContentArea {
            width: 790px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 2px solid #ede9e6;
            border-radius: 10px;

            .personalInfoContent {
                margin-left: 55px;
                padding: 0 0 3% 0;

                input {
                    width: 250px;
                    height: 18px;
                    margin: 0 60px 0 10px;
                    padding-left: 5px;
                    border-radius: 7px;
                }
            }
        }
    }

    .questionListArea {
        width: 850px;
        background-color: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 25px 0 3px 0;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        margin-bottom: 3%;
        color: #6e4e23;
        font-weight: 700;

        .questionList {
            width: 93%;
            background-color: #fff;
            border-radius: 10px;
            margin-bottom: 23px;
            border: 2px solid #ede9e6;

            .questionListInside {
                padding: 0 5% 10px 5%;

                .qTitleAndNecessary {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }

    .btnArea {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        padding: 15px 0;
        margin: -12px 0 30px 0;
        color: #6e4e23;
        font-weight: 700;

        span {
            margin-left: 10px;
        }

        .fa-arrow-left {
            // color: rgba(161, 158, 158, 0.804);
            // background-color: rgba(211, 211, 211, 0.804);
            font-size: 20pt;
            position: relative;
            margin-bottom: 50px;
            transition: all 0.5s ease;
            border-radius: 50%;
            padding: 12px;
            margin: 0 60px;

            &:hover {
                background-color: rgba(143, 143, 143, 0.804);
                cursor: pointer;
            }

            /* 使用伪元素添加文字 */
            &::after {
                content: '上一頁';
                color: rgb(255, 255, 255);
                font-size: 10pt;
                display: block;
                position: absolute;
                top: 50%;
                /* 相对于父元素垂直居中 */
                left: 50%;
                /* 相对于父元素水平居中 */
                transform: translate(-50%, -50%);
                /* 平移并旋转文字 */
                opacity: 0;
                /* 初始状态透明 */
                transition: opacity 0.3s ease;
                /* 添加过渡效果 */
                white-space: nowrap;
                /* 防止文字换行 */
            }

            &:hover::after {
                opacity: 1;
            }
        }

        .fa-floppy-disk {
            // color: rgba(161, 158, 158, 0.804);
            // background-color: rgba(211, 211, 211, 0.804);
            font-size: 20pt;
            position: relative;
            margin-bottom: 50px;
            margin: 0 60px;
            transition: all 0.5s ease;
            border-radius: 50%;
            padding: 12px 15px;

            &:hover {
                background-color: rgba(143, 143, 143, 0.804);
                cursor: pointer;
            }

            /* 使用伪元素添加文字 */
            &::after {
                content: '儲存';
                color: white;
                font-size: 10pt;
                display: block;
                position: absolute;
                top: 50%;
                /* 相对于父元素垂直居中 */
                left: 50%;
                /* 相对于父元素水平居中 */
                transform: translate(-50%, -50%);
                /* 平移并旋转文字 */
                opacity: 0;
                /* 初始状态透明 */
                transition: opacity 0.3s ease;
                /* 添加过渡效果 */
                white-space: nowrap;
                /* 防止文字换行 */
            }

            &:hover::after {
                opacity: 1;
            }
        }
    }
}
</style>