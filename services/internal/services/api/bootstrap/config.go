// Package bootstrap 负责 API 服务的启动期配置读取(env),不含业务逻辑。
package bootstrap

import "os"

// Config 是 API 服务的启动配置。
type Config struct {
	Addr string // HTTP 监听地址,如 ":8080"
}

// Load 从环境变量读取配置,提供安全默认值。
func Load() Config {
	addr := os.Getenv("API_ADDR")
	if addr == "" {
		addr = ":8080"
	}
	return Config{Addr: addr}
}
