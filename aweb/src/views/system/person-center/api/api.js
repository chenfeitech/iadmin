import {putAxios} from "@/util/request";

export const centerApi = {
    updatePassword:(data)=>{
        return putAxios('/sysUser/updatePasswordByToken',data)
    },
    updateUserBasicInfo:(data)=>{
        return putAxios('/sysUser/updateBasicInfoByToken',data)
    }
}