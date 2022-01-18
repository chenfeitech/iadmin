import {deleteAxios, postDownloadAxios, postAxios, putAxios} from "@/util/request";

export const sysMenuApi = {
    getList:(data)=>{
        return postAxios('/sysMenu/getSysRouteList',data)
    },
    updateMenuInfo:(data)=>{
        return putAxios('/sysMenu/updateSysMenuInfo',data)
    },
    addMenuInfo:(data)=>{
        return postAxios('/sysMenu/addSysMenuInfo',data)
    },
    deleteBatchMenu:(data)=>{
        return deleteAxios('/sysMenu/deleteBatchSysMenu',data)
    },
    excelOut:(data)=>{
        return postDownloadAxios('/sysMenu/excelOut',data)
    }
}
