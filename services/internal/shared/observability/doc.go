// Package observability 提供跨服务共享的结构化日志构造。
//
// 与 ba-trading 一致:所有服务只用 log/slog 输出 JSON,禁 fmt.Print*;
// 日志固定带 service 字段,供 triage 自愈环按服务聚类(见 CLAUDE.md 编码规范)。
package observability
