import {postAxios,deleteAxios,postDownloadAxios} from "@/util/request";

export const sysOperationRecordApi = {
    getList:(data)=>{
        return postAxios('/sysOperationRecord/getSysOperationRecordList',data)
    },
    deleteBatch:(data)=>{
        return deleteAxios('/sysOperationRecord/deleteBatchSysOperationRecord',data)
    },
    excelOut:(data)=>{
        return postDownloadAxios('/sysOperationRecord/excelOut',data)
    }
}