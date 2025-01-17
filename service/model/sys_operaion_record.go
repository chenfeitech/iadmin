package model

import (
	"time"

	"ginProject/global"
)

type SysOperationRecord struct {
	global.GvaModel
	Ip           string        `json:"ip" form:"ip" gorm:"column:ip;comment:请求ip"`                                   // 请求ip
	Method       string        `json:"method" form:"method" gorm:"column:method;comment:请求方法"`                       // 请求方法
	Path         string        `json:"path" form:"path" gorm:"column:path;comment:请求路径"`                             // 请求路径
	Status       int           `json:"status" form:"status" gorm:"column:status;comment:请求状态"`                       // 请求状态
	Latency      time.Duration `json:"latency" form:"latency" gorm:"column:latency;comment:延迟" swaggertype:"string"` // 延迟
	Agent        string        `json:"agent" form:"agent" gorm:"column:agent;comment:代理"`                            // 代理
	ErrorMessage string        `json:"error_message" form:"error_message" gorm:"column:error_message;comment:错误信息"`  // 错误信息
	Body         string        `json:"body" form:"body" gorm:"type:longtext;column:body;comment:请求Body"`             // 请求Body
	Resp         string        `json:"resp" form:"resp" gorm:"type:longtext;column:resp;comment:响应Body"`             // 响应Body
	UserID       uint          `json:"user_id" form:"user_id" gorm:"column:user_id;comment:用户id"`                    // 用户id
	User         SysUser       `json:"user"`
}

func SysOperationRecordExcelOutTableHeadName() (tableHeadName []string) {
	tableHeadName = []string{"ID", "请求ip", "发起用户", "请求路径", "请求body", "请求方法", "代理", "请求状态", "延迟", "响应body", "错误信息", "创建时间", "最后更新时间"}
	return tableHeadName
}

func SysOperationRecordExcelOutTableData(sysOperationRecordList []SysOperationRecord) (tableData [][]string) {
	for _, sysOperationRecord := range sysOperationRecordList {
		menuInfo := []string{global.Uint2String(sysOperationRecord.ID), sysOperationRecord.Ip, sysOperationRecord.User.RealName, sysOperationRecord.Path,
			sysOperationRecord.Body, sysOperationRecord.Method, sysOperationRecord.Agent, global.Int2String(sysOperationRecord.Status), sysOperationRecord.Resp, global.Int642string(int64(sysOperationRecord.Latency)), sysOperationRecord.ErrorMessage, global.Timestamp2DateTime(sysOperationRecord.CreatedAt), global.Timestamp2DateTime(sysOperationRecord.UpdatedAt)}
		tableData = append(tableData, menuInfo)
	}
	return tableData
}
