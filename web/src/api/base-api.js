import {getAxios, getDownloadAxios, postFileUploadAxios} from "../util/request";
export const baseApi = {
    downloadExcelInTemplate:(data)=>{
        return getDownloadAxios('/base/downloadExcelInTemplate',{databaseName:data})
    },
    uploadFile:(data) =>{
        return postFileUploadAxios('/file/upload',data)
    },
    /* 获得加密密钥 */
    getRSAKey:(data)=>{
        return getAxios('/base/generateRSAKey',data)
    }
}
