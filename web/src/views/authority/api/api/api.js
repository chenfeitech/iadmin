import {deleteAxios, getAxios, postAxios, putAxios,postDownloadAxios,postFileUploadAxios} from "@/util/request";

export const sysApiApi = {
    getList:(data)=>{
        return postAxios('/sysApi/getSysApiList',data)
    },
    getTree:(data)=>{
        return getAxios('/sysApi/getSysApiTree',data)
    },
    updateApiInfo:(data)=>{
        return putAxios('/sysApi/updateSysApiInfo',data)
    },
    addApiInfo:(data)=>{
        return postAxios('/sysApi/addSysApiInfo',data)
    },
    deleteBatchApi:(data)=>{
        return deleteAxios('/sysApi/deleteBatchSysApi',data)
    },
    excelOut:(data)=>{
        return postDownloadAxios('/sysApi/excelOut',data)
    },
    excelInPreview:(data)=>{
        return postFileUploadAxios('/sysApi/excelInPreview',data)
    },
    excelIn:(data)=>{
        return postAxios('/sysApi/excelIn',{'saveFileName':data})
    },

}
