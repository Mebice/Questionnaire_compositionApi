<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';  // 提示框
import 'element-plus/theme-chalk/el-message.css' // 提示框樣式

const title = ref('');
const description = ref('');
const startDate = ref('');
const endDate = ref('');
const questionList = ref([{ qTitle: '', optionType: '', necessary: true, options: [{ value: '' }, { value: '' }] }]);
const isPublish = ref(false)
const saveDialog = ref(false) // 打開是否確認返回對話框
const router = useRouter()

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

const save = async () => {
    await axios.post('http://localhost:8080/api/quiz/create', {
        questionnaire: {
            title: title.value,
            description: description.value,
            published: isPublish.value,
            startDate: startDate.value,
            endDate: endDate.value,
        },
        questionList: questionList.value.map((item, index) => ({
            quId: `${index + 1}`,
            qTitle: item.qTitle,
            optionType: item.optionType,
            necessary: item.necessary,
            option: item.options.map(option => option.value).join(';'),
        })),
    })
    ElMessage({ message: '新增成功', type: 'success', })
    // 清空本地数据
    sessionStorage.removeItem('formData')
    // 返回管理首頁
    router.push('/managerHome')

}

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
        <div class="questionListArea">
            <!-- 顯示題目列表 -->
            <div class="questionList" v-for="(questionItem, questionIndex) in questionList" :key="questionItem.id">
                <div class="questionListInside">
                    <div class="qTitleAndNecessary">
                        <p>{{ questionIndex + 1 + '. ' + questionItem.qTitle + ' (' + questionItem.optionType + ')' }}</p>
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
                <i class="fa-solid fa-arrow-left" @click="$router.push('/add')"></i>
                <el-checkbox v-model="isPublish" label="發布問卷" />
                <i class="fa-solid fa-floppy-disk" @click="saveDialog = true"></i>
                <!-- 彈出是否確認儲存對話框 -->
                <el-dialog v-model="saveDialog" width="500" align-center center>
                    <div class="content" style="display: flex; justify-content: center;padding-bottom:10px;">
                        <i class="fa-solid fa-circle-question"
                            style="color: #6e4e23;font-size: 20pt;margin-right: 10px;"></i>
                        <span style="color: #6e4e23;font-weight: 700;font-size: 16pt">儲存嗎 ?</span>
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
        padding: 15px 0 10px;
        margin: 20px 0;
        color: #6e4e23;
        font-weight: 700;

        h2 {
            height: 20px;
            margin-top: 10px;
        }

        p{
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