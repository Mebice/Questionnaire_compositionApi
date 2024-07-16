<script setup>
import { getQuestionListAPI } from '@/apis/api'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const questionnaire = ref(JSON.parse(route.query.data));
const questionList = ref([])
// 依據問卷ID獲取題目列表
const getQuestionList = async () => {
    const res = await getQuestionListAPI(route.params.id)
    questionList.value = res.data.questionList

    // 将选项字符串拆分为数组
    questionList.value.forEach(question => {
        question.options = question.option.split(';').map(option => ({ value: option }));
    });
}

onMounted(() => getQuestionList())
</script>

<template>
    <div class="bgArea">
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ questionnaire.startDate + ' ~ ' + questionnaire.endDate }}</p>
            <h2>{{ questionnaire.title }}</h2>
            <p>{{ questionnaire.description }}</p>
        </div>
        <div class="questionListArea">
            <!-- 顯示題目列表 -->
            <div class="questionList" v-for="(questionItem, questionIndex) in questionList" :key="questionItem.quId">
                <div class="questionListInside">
                    <div class="qTitleAndNecessary">
                        <p>{{ questionIndex + 1 + '. ' + questionItem.qTitle + ' (' + questionItem.optionType + ')' }}
                        </p>
                        <span v-if="questionItem.necessary" style="color: red;font-size:10pt">*[必填]</span>
                    </div>
                    <!-- 根據問題類型呈現選項 -->
                    <div v-if="questionItem.optionType === '多選'">
                        <div class="option-checkbox" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-checkbox v-model="option.value" disabled>{{ option.value }}</el-checkbox>
                        </div>
                    </div>
                    <div v-else>
                        <div class="option-radio" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-radio-group v-model="option.value" disabled>
                                <el-radio value="option">{{ option.value }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnArea">
                <i class="fa-solid fa-circle-chevron-left" @click="$router.push('/managerHome')">
                </i><span class="backText">Back</span>
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
            height: 20px;
            margin-top: 10px;
        }

        p {
            padding: 0 60px;
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
        margin-bottom: 30px;
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

                :deep(.el-checkbox__inner),
                :deep(.el-radio__inner) {
                    // 複選框和單選框
                    border: 1px solid $textcolor;
                }

                :deep(.el-checkbox__label),
                :deep(.el-radio__label) {
                    // 複選框和單選框文字
                    font-weight: 700;
                    color: $textcolor;
                }
            }
        }
    }

    .btnArea {
        display: flex;

        .fa-circle-chevron-left {
            font-size: 20pt;
            border-radius: 50%;
            padding: 12px;
            margin: -10px 0 10px;

            &:hover {
                opacity: 0.6;
                cursor: pointer;
            }
        }

        .backText {
            font-size: 13pt;
            margin-top: 5px;
        }
    }
}
</style>