import {deleteAxios, getAxios, postAxios, putAxios,postDownloadAxios} from "@/util/request";

export const sysRoleApi = {
    getList:(data)=>{
        return getAxios('/sysRole/getSysRoleList',data)
    },
    updateRoleInfo:(data)=>{
        return putAxios('/sysRole/updateSysRoleInfo',data)
    },
    addRoleInfo:(data)=>{
        return postAxios('/sysRole/addSysRoleInfo',data)
    },
    deleteBatchRole:(data)=>{
        return deleteAxios('/sysRole/deleteBatchSysRole',data)
    },
    updateRoleMenuConfig:(data)=>{
        return putAxios('/sysRole/updateSysRoleMenuConfig',data)
    },
    updateCasbin:(data)=>{
        return postAxios('/casbin/updateCasbin',data)
    },
    setDefaultRouter:(data)=>{
        return putAxios('/sysRole/setRoleDefaultRouter',data)
    },
    getCasbin:(data)=>{
        return postAxios('/casbin/getPolicyPathByRoleId',data)
    },
    excelOut:(data)=>{
        return postDownloadAxios('/sysRole/excelOut',data)
    }
}
