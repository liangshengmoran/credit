/*
 * MIT License
 *
 * Copyright (c) 2025 linux.do
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package config

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/linux-do/pay/internal/model"
	"github.com/linux-do/pay/internal/util"
)

// PublicConfigResponse 公共配置响应
type PublicConfigResponse struct {
	DisputeTimeWindowHours int `json:"dispute_time_window_hours"` // 争议时间窗口（小时）
}

// GetPublicConfig 获取公共配置
// @Tags config
// @Accept json
// @Produce json
// @Success 200 {object} util.ResponseAny
// @Router /api/v1/config/public [get]
func GetPublicConfig(c *gin.Context) {
	// 获取争议时间窗口配置
	disputeTimeHours, err := model.GetIntByKey(c.Request.Context(), model.ConfigKeyDisputeTimeWindowHours)
	if err != nil {
		c.JSON(http.StatusInternalServerError, util.Err(err.Error()))
		return
	}

	response := PublicConfigResponse{
		DisputeTimeWindowHours: disputeTimeHours,
	}

	c.JSON(http.StatusOK, util.OK(response))
}
