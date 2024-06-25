<script setup>
import dayjs from 'dayjs'  //  dayjs 库，用于处理日期
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  // 提示框
import 'element-plus/theme-chalk/el-message.css' // 提示框樣式

const router = useRouter()
const title = ref('')
const description = ref('')
const startDate = ref('') // 绑定開始時間
const endDate = ref('') // 绑定結束時間
const questionList = ref([{ qTitle: '', optionType: '', necessary: true, options: [{ value: '' }, { value: '' }] }])  // 绑定題目數組
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
const returnDialog = ref(false) // 打開是否確認返回對話框


const addQuestion = () => {  // 添加題目
    questionList.value.push({ qTitle: '', optionType: '', necessary: true, options: [{ value: '' }, { value: '' }] })
}

const removeQuestion = (questionIndex) => { // 刪除題目
    questionList.value.splice(questionIndex, 1)
}
const addOption = (questionIndex) => { // 添加選項
    questionList.value[questionIndex].options.push({ value: '' })
}

const removeOption = (questionIndex, optionIndex) => { // 刪除選項
    questionList.value[questionIndex].options.splice(optionIndex, 1)
}

// 保存到本地存储
const saveToSessionStorage = () => {
    const formData = {
        title: title.value,
        description: description.value,
        startDate: startDate.value,
        endDate: endDate.value,
        questionList: questionList.value,
    }
    sessionStorage.setItem('formData', JSON.stringify(formData))
}

// 从本地存储加载
const loadFromSessionStorage = () => {
    const formData = JSON.parse(sessionStorage.getItem('formData'))
    if (formData) {
        title.value = formData.title
        description.value = formData.description
        startDate.value = formData.startDate
        endDate.value = formData.endDate
        questionList.value = formData.questionList
    }
}

// 前往下一頁
const goNext = () => {
    if (!title.value || !description.value || !startDate.value || !endDate.value) {
        ElMessage.warning('標題、描述、開始時間和結束時間不得為空');
        return;
    }
    if(questionList.value.length < 1){
        ElMessage.warning('請至少新增一道題目')
        return
    }
    for (let i = 0; i < questionList.value.length; i++) {
        const question = questionList.value[i];
        if (!question.qTitle || !question.optionType) {
            ElMessage.warning(`第 ${i + 1} 題的標題和題型不得為空`);
            return;
        }
        if (question.options.length < 2) {
            ElMessage.warning(`第 ${i + 1} 題請至少新增兩個選項`);
            return;
        }
        for (let j = 0; j < question.options.length; j++) {
            if (!question.options[j].value) {
                ElMessage.warning(`第 ${i + 1} 題的選項不得為空`);
                return;
            }
        }
    }
    router.push('/addCheckout')
}

// 清空数据并返回
const goBack = () => {
    sessionStorage.removeItem('formData')
    // 返回
    router.push('/managerHome')
}

// 监听数据变化，优化监听，仅对特定字段进行深度监听
watch(
    () => ({ title: title.value, description: description.value, startDate: startDate.value, endDate: endDate.value, questionList: questionList.value }),
    saveToSessionStorage,
    { deep: true }
)

onMounted(() => {
    // 初始默認日期: 開始日期+2, 結束日期+7
    const todayPlusTwo = dayjs().add(2, 'day').format('YYYY-MM-DD')
    startDate.value = todayPlusTwo
    const todayPlusSeven = dayjs().add(7, 'day').format('YYYY-MM-DD')
    endDate.value = todayPlusSeven

    // 从本地存储加载formData數據
    loadFromSessionStorage()
})

</script>
<template>
    <div class="bgArea">
        <div class="form-container">
            <h3>新增問卷</h3>
            <div class="inside">
                <label for="questionnaireTitle">標題 : </label>
                <el-input v-model="title" placeholder="請輸入標題" clearable />

                <label for="describe">描述：</label>
                <el-input v-model="description" :autosize="{ minRows: 6, maxRows: 12 }" type="textarea"
                    placeholder="請輸入描述" />

                <div class="dateInputArea">
                    <div class="dateCombination">
                        <label class="dateText1" for="startDate">開始時間：</label>
                        <el-date-picker v-model="startDate" type="date" placeholder="請選擇日期" value-format="YYYY-MM-DD"
                            style="width: 240px;" />
                    </div>
                    <div class="dateCombination">
                        <label class="dateText2" for="endDate">結束時間：</label>
                        <el-date-picker v-model="endDate" type="date" placeholder="請選擇日期" value-format="YYYY-MM-DD"
                            style="width: 240px;" />
                    </div>
                </div>
                <div v-for="(questionItem, questionIndex) in questionList" :key="questionItem.id" class="frame">
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
                <i class="fa-solid fa-rotate-left" @click="returnDialog = true"></i>
                <!-- 彈出是否確認返回對話框 -->
                <el-dialog v-model="returnDialog" width="500" align-center center>
                    <div class="content" style="display: flex; justify-content: center;padding-bottom:10px;">
                        <i class="fa-solid fa-circle-question"
                            style="color: #6e4e23;font-size: 20pt;margin-right: 10px;"></i>
                        <span style="color: #6e4e23;font-weight: 700;font-size: 16pt">放棄新增 ?</span>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="returnDialog = false">取消</el-button>
                            <el-button type="primary" @click="goBack">確認</el-button>
                        </div>
                    </template>
                </el-dialog>
                <!-- 到下一頁確認頁 -->
                <i class="fa-solid fa-arrow-right" @click="goNext"></i>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bgArea {
    padding: 50px 170px;

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