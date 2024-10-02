<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const formData = ref((JSON.parse(sessionStorage.getItem('formData')))) // sessionStorage解析問卷數據
const recordData = ref(JSON.parse(route.query.data)); // query傳遞 該 user 詳細數據

// 将选项option字符串拆分为数组options
formData.value.questionList.forEach(question => {
    question.options = question.option.split(';').map(option => ({ value: option, checked: false }));
    if (question.optionType === '單選') {
        question.radioOption = ''; // 初始化单选题选项
    }
});

// 将recordData中的答案应用到问卷题目中
recordData.value.answers.forEach(answer => {
    const question = formData.value.questionList.find(q => q.quId === answer.questionId);
    if (question) {
        if (question.optionType === '多選') {
            question.options.forEach(option => {
                if (answer.ans.includes(option.value)) {
                    option.checked = true;
                }
            });
        } else if (question.optionType === '單選') {
            question.radioOption = answer.ans;
        }
    }
});
</script>

<template>
    <!-- {{ formData }}
    recordData : {{ recordData }} -->
    <div class="bgArea">
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ formData.questionnaire.startDate + ' ~ ' + formData.questionnaire.endDate }}</p>
            <h2>{{ formData.questionnaire.title }}</h2>
            <p>{{ formData.questionnaire.description }}</p>
        </div>
        <div class="infoArea">
            <div class="personalInfoContentArea">
                <div class="infoTop">基本資料</div>
                <div class="personalInfoContent">
                    <div class="infoinputArea">
                        <label for="">姓名</label>
                        <el-input v-model="recordData.name" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">手機</label>
                        <el-input v-model="recordData.phoneNumber" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">信箱</label>
                        <el-input v-model="recordData.email" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">年齡</label>
                        <el-input :value="recordData.age === 0 ? '' : recordData.age" disabled />
                    </div>
                </div>
            </div>
        </div>
        <div class="questionListArea">
            <!-- 顯示題目列表 -->
            <div class="questionList" v-for="(questionItem, questionIndex) in formData.questionList"
                :key="questionItem.id">
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
                            <el-checkbox v-model="option.checked" disabled>{{ option.value }}</el-checkbox>
                        </div>
                    </div>
                    <div v-else>
                        <div class="option-radio" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-radio-group v-model="questionItem.radioOption" disabled>
                                <el-radio :value="option.value">{{ option.value }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnArea" @click="$router.push('/feedBack')">
                <i class="fa-solid fa-circle-chevron-left">
                </i><span class="backText">Back</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;
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
        margin-bottom: 20px;
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

    .infoArea {
        width: 850px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2% 0 2% 0;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.28);
        color: #6e4e23;
        font-weight: 700;

        .infoTop {
            width: 100%;
            text-align: center;
            margin: 20px 0;
        }

        .personalInfoContentArea {
            width: 790px;
            border: 2px solid #ede9e6;
            border-radius: 10px;

            .personalInfoContent {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                padding: 0 30px;

                .infoinputArea {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;

                    label {
                        width: 40px;
                        margin-right: 10px;
                    }

                    :deep(.el-input__wrapper) {
                        width: 280px;
                        height: 28px;
                        padding-left: 10px;
                        border-radius: 5px;
                        border: 1px solid $textcolor;
                    }

                    :deep(.el-input__inner) {
                        color: $textcolor;

                        &::placeholder {
                            color: $textcolor;
                        }
                    }

                    :deep(.el-input.is-disabled .el-input__inner) {
                        -webkit-text-fill-color: #000000;
                    }
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

                :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner) {
                    // 已選擇的複選框
                    background-color: $textcolor;

                    &::after {
                        border-color: #ffffff;
                    }
                }

                :deep(.el-radio__input.is-disabled.is-checked .el-radio__inner) {
                    // 已選中的單選框
                    background-color: $textcolor;

                    &::after {
                        background-color: #fff;
                    }
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
        height: 30px;
        display: flex;
        margin-bottom: 20px;
        color: $maincolor;

        &:hover {
            opacity: 0.6;
            cursor: pointer;
        }

        .fa-circle-chevron-left {
            font-size: 20pt;
            border-radius: 50%;
            padding: 12px;
            margin: -10px 0 10px;

        }

        .backText {
            font-size: 13pt;
            margin-top: 5px;
        }
    }
}
</style>