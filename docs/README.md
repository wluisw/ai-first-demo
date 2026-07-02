# ai-first-demo 文档

单仓多项目(前端 `apps/web` + Go 后端 `services/`(api、ws))的设计与规范文档,全在本仓(原共享 docs-repo 已转入)。

## 导航
- [`architecture.md`](architecture.md):总体架构。
- [`多模型适配.md`](多模型适配.md):切换 LLM 厂商说明。
- [`services/`](services/):每服务施工图,目录用**英文可读名**(`API Service`、`WS Service`),内含 `api.md`(接口)、`CHANGELOG.md`。
- [`standards/`](standards/):前端 / Go 开发规范。
- [`test-cases/`](test-cases/):测试用例,**双维度**(`web/` 前端流程 e2e + `<服务>/` 后端契约),供 auto-tests 生成脚本。

## 约定
- 改接口 → 更新对应 `services/<英文可读名>/api.md`(skill:`api-doc-output`)。
- 功能变更 → 追加 `services/<英文可读名>/CHANGELOG.md`(skill:`changelog-output`)。
- 详见根 `CLAUDE.md`「文档同步义务」。英文可读名 ↔ kebab 映射:`API Service`↔`api`、`WS Service`↔`ws`。
