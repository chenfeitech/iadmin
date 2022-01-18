import {deleteAxios, postDownloadAxios, postAxios, putAxios,postFileUploadAxios} from "@/util/request";

export const sysUserApi = {
    getList:(data)=>{
        return postAxios('/sysUser/getSysUserList',data)
    },
    updateUserInfo:(data)=>{
        return putAxios('/sysUser/updateSysUserInfo',data)
    },
    addUserInfo:(data)=>{
        return postAxios('/sysUser/addSysUserInfo',data)
    },
    deleteBatchUser:(data)=>{
        return deleteAxios('/sysUser/deleteBatchSysUser',data)
    },
    excelOut:(data)=>{
        return postDownloadAxios('/sysUser/excelOut',data)
    },
    excelInPreview:(data)=>{
        return postFileUploadAxios('/sysUser/excelInPreview',data)
    },
    excelIn:(data)=>{
        return postAxios('/sysUser/excelIn',{'saveFileName':data})
    },
    resetPassword:(data)=>{
        return putAxios('/sysUser/resetPassword',{userId:data})
    }
}
