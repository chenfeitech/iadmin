package middleware

import (
	"fmt"

	"ginProject/global"
	"ginProject/model/request"
	"ginProject/model/response"
	"ginProject/service"

	"github.com/gin-gonic/gin"
)

// 拦截器
func CasbinHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, _ := c.Get("claims")
		waitUse := claims.(*request.CustomClaims)
		// 获取请求的URI
		obj := c.Request.URL.RequestURI()
		// 获取请求方法
		act := c.Request.Method
		// 获取用户的角色
		sub := fmt.Sprintf("%d", waitUse.RoleId)
		e := service.Casbin()
		// 判断策略中是否存在
		success, _ := e.Enforce(sub, obj, act)
		//success, _ := e.Enforce("1", "​/api​/sysMenu​/getSysMenuByToken", "GET")
		//success, _ := e.Enforce("1", "/api/sysMenu/getSysMenuByToken", "GET")
		if global.GvaConfig.System.Env == "develop" || success {
			c.Next()
		} else {
			response.FailWithDetailed(gin.H{}, "权限不足", c)
			c.Abort()
			return
		}
	}
}
