<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter()
const formData = ref(JSON.parse(route.query.data || sessionStorage.getItem('formData')));
const typeOptions = [ // 绑定題型選項
    {
        type: '單選',
        label: '單選',
    },
    {
        type: '多選',
        label: '多選',
    }
]
// 将选项字符串拆分为数组
formData.value.questionList.forEach(question => {
    question.options = question.option.split(';').map(option => ({ value: option }));
});

// 添加題目
const addQuestion = () => {
    formData.value.questionList.push({
        qnId: formData.value.questionnaire.id, // 使用问卷的id作为qnId
        qTitle: '',
        optionType: '',
        necessary: true,
        options: [{ value: '' }, { value: '' }]
    })
}

// 刪除題目
const removeQuestion = (questionIndex) => {
    formData.value.questionList.splice(questionIndex, 1)
}

// 添加选项
const addOption = (questionIndex) => {
    formData.value.questionList[questionIndex].options.push({ value: '' });
};

// 刪除選項
const removeOption = (questionIndex, optionIndex) => {
    formData.value.questionList[questionIndex].options.splice(optionIndex, 1)
}

// 监听数据变化，保存到 sessionStorage
const saveToSessionStorage = () => {
    sessionStorage.setItem('formData', JSON.stringify(formData.value));
};

// 在页面加载时从 sessionStorage 加载数据
const loadFromSessionStorage = () => {
    const storedData = sessionStorage.getItem('formData');
    if (storedData) {
        Object.assign(formData.value, JSON.parse(storedData));
    }
};

// 监听 formData 变化，保存到 sessionStorage
watch(formData, saveToSessionStorage, { deep: true });

// 清空数据并返回
const clearDataAndReturn = () => {
    sessionStorage.removeItem('formData')
    // 返回
    router.push('/')
}

onMounted(() => {
    loadFromSessionStorage();
});
</script>

<template>
    <div class="bgArea">
        <div class="form-container">
            <h3>編輯問卷</h3>
            {{ formData }}
            <div class="inside">
                <label for="questionnaireTitle">標題 : </label>
                <el-input v-model="formData.questionnaire.title" placeholder="請輸入標題" clearable />

                <label for="describe">描述：</label>
                <el-input v-model="formData.questionnaire.description" :autosize="{ minRows: 6, maxRows: 12 }"
                    type="textarea" placeholder="請輸入描述" />

                <div class="dateInputArea">
                    <div class="dateCombination">
                        <label class="dateText1" for="startDate">開始時間：</label>
                        <el-date-picker v-model="formData.questionnaire.startDate" type="date" placeholder="請選擇日期"
                            value-format="YYYY-MM-DD" style="width: 240px;" />
                    </div>
                    <div class="dateCombination">
                        <label class="dateText2" for="endDate">結束時間：</label>
                        <el-date-picker v-model="formData.questionnaire.endDate" type="date" placeholder="請選擇日期"
                            value-format="YYYY-MM-DD" style="width: 240px;" />
                    </div>
                </div>
                <div v-for="(questionItem, questionIndex) in formData.questionList" :key="questionItem.id"
                    class="frame">
                    <i class="fa-solid fa-square-xmark" @click="removeQuestion(questionIndex)"></i>
                    <p>第 {{ questionIndex + 1 }} 題</p>
                    <label for="qTitle">題目 : </label>
                    <el-input v-model="questionItem.qTitle" :autosize="{ minRows: 1, maxRows: 6 }" type="textarea"
                        placeholder="請輸入題目" />
                    <label for="type">題型 : </label>
                    <el-select v-model="questionItem.optionType" placeholder="請選擇題型" style="width: 240px">
                        <el-option v-for="item in typeOptions" :key="item.type" :label="item.label"
                            :value="item.type" />
                    </el-select>
                    <br>
                    <div class="necessaryArea">
                        <span>必填 : </span>
                        <el-checkbox v-model="questionItem.necessary" />
                    </div>
                    <label for="question">選項 : </label>
                    <div class="option-item" v-for="(option, optionIndex) in questionItem.options" :key="optionIndex">
                        <el-input v-model="option.value" :autosize="{ minRows: 1, maxRows: 3 }" type="textarea"
                            placeholder="請輸入選項" />
                        <i class="fa-solid fa-circle-xmark" @click="removeOption(questionIndex, optionIndex)"></i>
                    </div>
                    <i class="fa-solid fa-circle-plus" @click="addOption(questionIndex)"><span
                            class="addOptionText">添加選項</span></i>
                </div>
                <i class="fa-solid fa-square-plus" @click="addQuestion"><span class="addQuestionText">添加題目</span></i>
            </div>
            <!-- 返回或確認頁 -->
            <div class="button-container">
                <i class="fa-solid fa-rotate-left" @click="clearDataAndReturn"></i>
                <i class="fa-solid fa-arrow-right" @click="$router.push('/editCheckout')"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    display: flex;
    align-items: center;
    /* 垂直置中 */
    justify-content: center;
    /* 水平置中 */
    padding: 50px 0;

    .form-container {
        width: 850px;
        background-color: #fff;
        color: #6e4e23;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        h3 {
            text-align: center;
        }

        .inside {
            padding: 0 50px;

            label {
                display: block;
                margin-bottom: 8px;
            }

            .el-input {
                border: 1px solid #b5a897;
                border-radius: 5px;
                margin-bottom: 20px;
            }

            :deep(.el-textarea__inner) {
                border: 1px solid #b5a897;
                border-radius: 5px;
                margin-bottom: 20px;
                resize: none;
            }

            .dateInputArea {
                display: flex;
                margin-top: 16px;
                margin-bottom: 40px;
                justify-content: space-between;

                .dateCombination {
                    display: flex;
                    flex-direction: column;

                    :deep(.el-input__wrapper) {
                        border: 1px solid #b5a897;
                        border-radius: 5px;
                    }
                }
            }

            .frame {
                position: relative;
                padding: 0 40px 30px;
                border: 1.5px solid #d3cfca;
                border-radius: 5px;

                .fa-square-xmark {
                    font-size: 18pt;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: $maincolor;

                    &:hover {
                        color: #e8da8c;
                        cursor: pointer;
                    }

                }

                p {
                    text-align: center;
                }

                :deep(.el-select__wrapper) {
                    border: 1px solid #b5a897;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }

                .necessaryArea {
                    display: flex;

                    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
                        background-color: $maincolor;
                    }

                    :deep(.el-checkbox__input) {
                        margin-top: 4px;
                        margin-left: 10px;
                        border: 1px solid #b5a897;
                        border-radius: 2px;
                    }

                }

                .fa-circle-plus {
                    width: 90px;
                    display: flex;
                    align-items: center;
                    font-size: 16pt;
                    margin-left: 300px;
                    color: $maincolor;

                    &:hover {
                        color: #DBD3A4;
                        cursor: pointer;
                    }
                }

                .addOptionText {
                    margin-left: 10px;
                    font-size: 11pt;
                }

                .option-item {
                    display: flex;
                    align-items: first baseline;

                    .fa-circle-xmark {
                        font-size: 12pt;
                        margin-left: 10px;
                        color: $maincolor;

                        &:hover {
                            color: #e8da8c;
                            cursor: pointer;
                        }

                    }
                }
            }

            .fa-square-plus {
                width: 100px;
                font-size: 18pt;
                display: flex;
                align-items: center;
                padding-top: 20px;
                margin-left: 340px;
                color: $maincolor;

                &:hover {
                    color: #DBD3A4;
                    cursor: pointer;
                }

                .addQuestionText {
                    font-size: 12pt;
                    margin-left: 10px;
                }

            }

        }

        .button-container {
            display: flex;
            justify-content: space-between;
            padding: 20px 50px;

            .fa-rotate-left {
                color: rgba(161, 158, 158, 0.804);
                background-color: rgba(211, 211, 211, 0.804);
                font-size: 20pt;
                transition: all 0.5s ease;
                border-radius: 50%;
                padding: 12px;
                position: relative;

                &:hover {
                    background-color: rgba(143, 143, 143, 0.804);
                    cursor: pointer;
                }

                /* 使用伪元素添加文字 */
                &::after {
                    content: '返回';
                    color: #ffffff;
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

            .fa-arrow-right {
                color: rgba(161, 158, 158, 0.804);
                background-color: rgba(211, 211, 211, 0.804);
                font-size: 20pt;
                transition: all 0.5s ease;
                border-radius: 50%;
                padding: 12px;
                position: relative;

                &:hover {
                    background-color: rgba(143, 143, 143, 0.804);
                    cursor: pointer;
                }

                /* 使用伪元素添加文字 */
                &::after {
                    content: '確認頁';
                    color: #fff;
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
}
</style>
