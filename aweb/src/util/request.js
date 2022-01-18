import axios from 'axios'
import { get } from 'lodash'
import store from '@/store'
import { message } from "ant-design-vue"
import router from "../router";
/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create({
    // 配置了baseURL，不会走代理配置，会有跨域问题
    baseURL: process.env.VUE_APP_URL,
    //timeout: 1000000, //超时时间
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
  // 请求拦截
  service.interceptors.request.use(
    config => {
      if (store.getters['user/token']) {
        config.headers['x-token'] = store.getters['user/token'];
      }
      // message.loading({content:'网络请求中',duration:0,key:'requestMsg'})
      return config;
    },
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      if(response.config.responseType==='blob'){
        download(response)
        return
      }
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data
      // 这个状态码是和后端约定的
      const { code } = dataAxios
      // 根据 code 进行判断
      if (code === undefined) {
        // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        // 后端传过来需要重新登录
        if(dataAxios.data.hasOwnProperty('login')&&dataAxios.data.login){
          store.dispatch('user/logout')
        }
        // 有 code 代表这是一个后端接口 可以进行进一步的判断
        switch (code) {
          case 0:
            // [ 示例 ] code === 0 代表没有错误
            //   message.success({content:`${dataAxios.msg}`,key:'requestMsg'})
            //   message.destroy({key:'requestMsg'})
            return dataAxios
          default:
            // errorCreate(`${dataAxios.code}: ${dataAxios.msg}`)
            message.error({content:`${dataAxios.msg}`,key:'requestMsg'})
            return Promise.reject(dataAxios.msg)
        }
      }

    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400: message.error( {content:'请求错误',key:'requestMsg'}); break
        case 401: message.error({content:'未授权，请登录',key:'requestMsg'}); break
        case 403: message.error({content:'拒绝访问',key:'requestMsg'}); break
        case 404: message.error({content:`请求地址出错: ${error.response.config.url}`,key:'requestMsg'}); break
        case 408: message.error({content:'请求超时',key:'requestMsg'}); break
        case 500: message.error({content:'服务器内部错误',key:'requestMsg'}); break
        case 501: message.error({content:'服务未实现',key:'requestMsg'}); break
        case 502: message.error( {content:'网关错误',key:'requestMsg'}); break
        case 503: message.error({content:'服务不可用',key:'requestMsg'}); break
        case 504: message.error({content:'网关超时',key:'requestMsg'}); break
        case 505: message.error( {content:'HTTP版本不受支持',key:'requestMsg'}); break
        default: message.error( {content:'网络请求失败',key:'requestMsg'});break
      }
      // errorLog(error)
      return Promise.reject(error)
    }
  )
  return service
}

// 用于真实网络请求的实例和请求方法
export const request = createService()
// 封装get请求
export const getAxios = (url, data) => {
  return request.get(url, {
    params: data
  });
};
// 封装post请求
export const postAxios = (url, data) => {
  return request.post(url, data);
};
// 封装put方法
export const putAxios = (url, data) => {
  return request.put(url,  data)
};
// 封装delete方法
export const deleteAxios = (url, data) => {
  return request.delete(url, {
    data:data
  })
};

export const postFileUploadAxios = (url, data) => {
  return request.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const getDownloadAxios = (url,data) => {
  return request.get(url, {
    params:data,
    responseType: 'blob'
  });
};

export const postDownloadAxios = (url, data) => {
  return request.post(url, data, { responseType: 'blob' });
};


export const getAxiosById = (url,id) =>{
  return request.get(url+id);
}

function download (res) {
  let reader = new FileReader();
  let data = res.data;
  reader.onload = e => {
    if (e.target.result.indexOf('Result') !== -1 && JSON.parse(e.target.result).Result === false) {
      // 进行错误处理
    } else {
      let fileName = "download.xlsx";
      // 虽然后端传的是大写，但打印后发现前端显示的是小写的，无语
      let contentDisposition = res.headers['content-disposition'];
      fileName = contentDisposition?contentDisposition:fileName
      executeDownload(data, fileName);
    }
  };
  reader.readAsText(data);
}

//  模拟点击a 标签进行下载
function executeDownload (data, fileName) {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
