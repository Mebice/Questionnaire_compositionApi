<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  // 引入 Element Plus 的消息提示
import 'element-plus/theme-chalk/el-message.css'; // 引入 Element Plus 消息提示样式

const route = useRoute();
const router = useRouter();
const formData = ref(JSON.parse(route.query.data || sessionStorage.getItem('formData'))); // 獲取從使用者首頁query傳遞的數據
const name = ref(''); // 綁定名字
const phone = ref(''); // 綁定電話
const email = ref(''); // 綁定信箱
const age = ref(''); // 綁定年齡
const returnDialog = ref(false); // 打開是否確認返回對話框

// 将选项字符串拆分为数组
formData.value.questionList.forEach(question => {
    question.options = question.option.split(';').map(option => ({ value: option, checked: false }));
    if (question.optionType === '單選') {
        question.radioOption = ''; // 初始化单选题选项
    }
});

// 保存到本地存储
const saveToSessionStorage = () => {
    const userAnswerData = {
        name: name.value,
        phone: phone.value,
        email: email.value,
        age: age.value,
        qnId: formData.value.questionnaire.id,
        answers: formData.value.questionList.map(question => ({
            quId: question.quId,
            options: question.options,
            radioOption: question.radioOption // 保存单选题的选项
        }))
    };
    sessionStorage.setItem('formData', JSON.stringify(formData.value));
    sessionStorage.setItem('userAnswerData', JSON.stringify(userAnswerData));
};

// 从本地存储加载
const loadFromSessionStorage = () => {
    const userAnswerData = JSON.parse(sessionStorage.getItem('userAnswerData'));
    if (userAnswerData) {
        name.value = userAnswerData.name;
        phone.value = userAnswerData.phone;
        email.value = userAnswerData.email;
        age.value = userAnswerData.age;
        formData.value.questionList.forEach(question => {
            const savedQuestion = userAnswerData.answers.find(answer => answer.quId === question.quId);
            if (savedQuestion) {
                question.options = savedQuestion.options;
                question.radioOption = savedQuestion.radioOption; // 恢复单选题的选项
            }
        });
    }
};

// 清空数据并返回
const goBack = () => {
    sessionStorage.removeItem('userAnswerData');
    // 返回
    router.push('/');
};

// 检查是否有未填写的必填题目
const checkNecessary = () => {
    let necessaryList = []; // 放置必填題目
    formData.value.questionList.forEach((question, questionIndex) => {  // 蒐集必填題目
        if (question.necessary) {
            if (question.optionType === '單選' && !question.radioOption) {
                necessaryList.push(`${questionIndex + 1}. ${question.qTitle}`);
            }
            if (question.optionType === '多選' && !question.options.some(option => option.checked)) {
                necessaryList.push(`${questionIndex + 1}. ${question.qTitle}`);
            }
        }
    });
    if (necessaryList.length > 0) {
        ElMessage({
            message: `以下必填题目未填写: \n${necessaryList.join('\n')}`,
            type: 'warning',
        });
        return false;
    }
    return true;
};

// 跳转到下一页并检查必填题目
const goNext = () => {
    if (checkNecessary()) {
        router.push('/answerCheckout');
    }
};

// 监听数据变化，优化监听，仅对特定字段进行深度监听
watch(
    () => ({ name: name.value, phone: phone.value, email: email.value, age: age.value }),
    saveToSessionStorage,
    { deep: true }
);

// 监听问卷答案的变化
watch(
    () => formData.value.questionList,
    saveToSessionStorage,
    { deep: true }
);

onMounted(() => {
    // 从本地存储加载formData數據
    loadFromSessionStorage();
});
</script>

<template>
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
                        <el-input v-model="name" placeholder="請輸入名字或暱稱" clearable />
                    </div>
                    <div class="infoinputArea">
                        <label for="">手機</label>
                        <el-input v-model="phone" placeholder="請輸入手機號碼或電話" clearable />
                    </div>
                    <div class="infoinputArea">
                        <label for="">信箱</label>
                        <el-input v-model="email" placeholder="請輸入電子信箱" clearable />
                    </div>
                    <div class="infoinputArea">
                        <label for="">年齡</label>
                        <el-input v-model="age" placeholder="請輸入年紀" clearable />
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
                            <el-checkbox v-model="option.checked">{{ option.value }}</el-checkbox>
                        </div>
                    </div>
                    <div v-else>
                        <div class="option-radio" v-for="(option, optionIndex) in questionItem.options"
                            :key="optionIndex">
                            <el-radio-group v-model="questionItem.radioOption">
                                <el-radio :value="option.value">{{ option.value }}</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 返回或確認頁 -->
            <div class="button-container">
                <i class="fa-solid fa-rotate-left" @click="returnDialog = true"></i>
                <!-- 彈出是否確認返回對話框 -->
                <el-dialog v-model="returnDialog" width="500" align-center center>
                    <div class="content" style="display: flex; justify-content: center;padding-bottom:10px;">
                        <i class="fa-solid fa-circle-question"
                            style="color: #6e4e23;font-size: 20pt;margin-right: 10px;"></i>
                        <span style="color: #6e4e23;font-weight: 700;font-size: 16pt">放棄填寫 ?</span>
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

                :deep(.el-checkbox__label),
                :deep(.el-radio__label) {
                    // 複選框和單選框文字
                    font-weight: 700;
                    color: $textcolor;
                }
            }
        }
    }

    .button-container {
        width: 93%;
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;

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
</style>