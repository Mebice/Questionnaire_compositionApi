import request from "@/utils/http";

// 獲取問卷列表
export function getQuestionnaireListAPI(params) {
    return request({
        url: '/quiz/searchQuestionnaireList',
        params
    })
}

// 依據問卷ID獲取對應的題目
export function getQuestionListAPI(qnId) {
    return request({
        url: '/quiz/searchQuestionList',
        params:{
            qnId
        }
    })
}
