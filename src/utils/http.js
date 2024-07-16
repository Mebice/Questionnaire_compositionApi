//axios基礎的封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const httpInstance = axios.create({
baseURL:'http://localhost:8080/api', // 基礎URL
timeout:8000
})

// 攔截器

// // axiosi請求攔截器
// httpInstance.interceptors.request.use(config =>{
// }, e => Promise.reject(e))

// // axios響應式攔截器
// httpInstance.interceptors.response.use(res => res.data, e => {

//     // 統一錯誤提示
//     ElMessage({
//         type: 'warning',
//         message: e.response.data.message
//     })

//     return Promise.reject(e)
//     })
    
export default httpInstance