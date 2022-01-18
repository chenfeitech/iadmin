import moment from "moment";
import {notification, Spin} from "ant-design-vue";
import {h} from "vue";
// 判断两个对象是否相等
export function isObjectValueEqual(a, b) {
    if(!a||!b)
        return false
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
        return false;
    }
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        var propA = a[propName]
        var propB = b[propName]
        if ((typeof (propA) === 'object')) {
            if (this.isObjectValueEqual(propA, propB)) {
                return true
            } else {
                return false
            }
        } else if (propA !== propB) {
            return false
        } else { }
    }
    return true
}
// 时间戳转格式时间
export function formatTime(text){
    // moment默认的是用13位时间戳
    return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
}
// 验证手机号格式
export function isPhone(text){
    return (/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(text))
}

export function downloadNotification(){
    notification.success({
        message: `下载请求中~`,
        description:
            '若文件较大可能需要等待一会才会开始下载，正在攻克文件过大无法下载的问题！',
        // 自定义图片，显示加载中~
        icon: h(Spin),
    });
}

export function uploadNotification(){
    notification.success({
        message: `上传请求中~`,
        description:
            '还未实现进度回显和断点上传功能 TAT',
        // 自定义图片，显示加载中~
        icon: h(Spin),
    });
}
