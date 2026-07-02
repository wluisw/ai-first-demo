# api 服务 — 接口

> HTTP 服务。改接口时同步本文件(见 CLAUDE.md「文档同步义务」),对应 skill:`api-doc-output`。

## GET /healthz
健康检查。返回 `200 {"status":"ok"}`。

## GET /api/hello
- Query:`name`(可选;省略回退 `world`)
- 返回:`200 {"message":"hello, <name>"}`
