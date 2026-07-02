# 前端流程 e2e:主题切换(theme-toggle)

> 前端流程 e2e(用户视角):用户在 web 上切换亮 / 暗主题的完整流程。
> 藏在 `THEME_TOGGLE` 特性开关后;开关关闭时按钮不出现。

---

## TC-001: 开关开启时切换主题(happy path)
**前置条件:** `THEME_TOGGLE` flag 开启
**操作步骤:**
1. 打开 web 首页
2. 点右上角主题切换按钮

**预期结果:** 主题在亮/暗间翻转;`<html>` class 同步;偏好写入 localStorage;发出 `theme_toggled` 遥测事件
**类型:** e2e
**优先级:** P0

---

## TC-002: 开关关闭时按钮不出现
**前置条件:** `THEME_TOGGLE` flag 关闭
**预期结果:** 页面无主题切换按钮,主题维持默认
**类型:** e2e
**优先级:** P1
