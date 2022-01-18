import {getAxios} from "@/util/request";
import {postAxios} from "../../../../util/request";


export const loginApi = {
    getCode:() => {
        return getAxios('/base/captcha')
    },
    login:(data) =>{
        return postAxios('/base/login',data)
    },
    register:(data) =>{
        return postAxios('/base/register',data)
    },
    getSysMenuByToken:(data)=>{
        return getAxios('/sysMenu/getSysMenuByToken',data)
    }
}