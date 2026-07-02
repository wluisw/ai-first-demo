# ws 服务 — 接口

> WebSocket 服务。改接口时同步本文件(见 CLAUDE.md「文档同步义务」),对应 skill:`api-doc-output`。

## GET /healthz
健康检查。返回 `200 {"status":"ok"}`。

## /ws (WebSocket)
建立 WebSocket 连接后,服务对每条入站消息回显 `echo: <msg>`(文本帧)。
客户端关闭或连接出错即结束该连接。
