<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';  // 提示框
import 'element-plus/theme-chalk/el-message.css' // 提示框樣式

const router = useRouter()
const userAnswerData = ref({}); // 綁定用戶答案數據
const formData = ref({})
const saveDialog = ref(false) // 打開是否確認返回對話框

const save = async () => {
    const allAns = userAnswerData.value.answers.map(question => {
        if (question.radioOption) {
            return { quId: question.quId, selected: question.radioOption };
        } else {
            const selectedOptions = question.options.filter(option => option.checked).map(option => option.value).join(';')
            return { quId: question.quId, selected: selectedOptions }
        }
    });
    // console.log(allAns);
    for (const answer of allAns) {
        // console.log(answer.quId)
        // console.log(answer.selected)
        await axios.post('http://localhost:8080/api/user/create', {
            user: {
                name: userAnswerData.value.name,
                phoneNumber: userAnswerData.value.phone,
                email: userAnswerData.value.email,
                age: userAnswerData.value.age,
                questionnaireId: userAnswerData.value.qnId,
                questionId: answer.quId,
                ans: answer.selected
            }
        })
        ElMessage({ message: '提交成功', type: 'success', })
        // 清空本地数据
        sessionStorage.removeItem('formData')
        sessionStorage.removeItem('userAnswerData')
        // 回管理首頁
        router.push('/')
    }
}

// 从本地存储加载数据
const loadFromSessionStorage = () => {
    userAnswerData.value = JSON.parse(sessionStorage.getItem('userAnswerData'));
    formData.value = JSON.parse(sessionStorage.getItem('formData'));
};

onMounted(() => {
    // 从本地存储加载数据
    loadFromSessionStorage();
});
</script>

<template>
    <div class="bgArea">
        <!-- 顯示問卷基本信息 -->
        <div class="titleArea">
            <p>{{ formData.questionnaire?.startDate + ' ~ ' + formData.questionnaire?.endDate }}</p>
            <h2>{{ formData.questionnaire?.title }}</h2>
            <p>{{ formData.questionnaire?.description }}</p>
        </div>
        <div class="infoArea">
            <div class="personalInfoContentArea">
                <div class="infoTop">基本資料</div>
                <div class="personalInfoContent">
                    <div class="infoinputArea">
                        <label for="">姓名</label>
                        <el-input v-model="userAnswerData.name" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">手機</label>
                        <el-input v-model="userAnswerData.phone" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">信箱</label>
                        <el-input v-model="userAnswerData.email" disabled />
                    </div>
                    <div class="infoinputArea">
                        <label for="">年齡</label>
                        <el-input v-model="userAnswerData.age" disabled />
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
                                <el-radio :label="option.value">{{ option.value }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnArea">
            <i class="fa-solid fa-arrow-left" @click="$router.push('/answer')"></i>
            <i class="fa-solid fa-floppy-disk" @click="saveDialog = true"></i>
            <!-- 彈出是否確認儲存對話框 -->
            <el-dialog v-model="saveDialog" width="500" align-center center>
                <div class="content" style="display: flex; justify-content: center;padding-bottom:10px;">
                    <i class="fa-solid fa-circle-question"
                        style="color: #6e4e23;font-size: 20pt;margin-right: 10px;"></i>
                    <span style="color: #6e4e23;font-weight: 700;font-size: 16pt">提交作答嗎 ?</span>
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="saveDialog = false">取消</el-button>
                        <el-button type="primary" @click="save">確認</el-button>
                    </div>
                </template>
            </el-dialog>
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
        width: 850px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 20px;

        :deep(.el-checkbox__inner) {
            border: 1px solid $textcolor;
        }

        :deep(.el-checkbox__label) {
            font-size: 12pt;
            font-weight: 700;
            color: $textcolor;
        }

        .fa-arrow-left {
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