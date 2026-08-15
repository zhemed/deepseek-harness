# DeepSeek Harness

[English](README.md) | 中文

DeepSeek Harness（`dsh`）是一个采用 MIT 协议的开源 agent harness（智能体框架），由 [DeepSeek AI](https://deepseek.com) 发起开发。

它采用**一切皆插件**的架构，并由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://github.com/cordiverse/paper)。

> 本仓库由 [zhemed](https://github.com/zhemed) 维护，提供局域网访问、明文 HTTP 兼容、DeepSeek V4 思考档位透传等能力。

## 从源码运行

```sh
git clone https://github.com/zhemed/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

该命令会启动 Web UI，默认地址为 `http://127.0.0.1:3080`。详见 [Web UI 指南](docs/user/guide/index.md)。

> 本仓库以源码方式部署 `dsh`。

## 反馈与支持

- 问题反馈：[zhemed/deepseek-harness Issues](https://github.com/zhemed/deepseek-harness/issues)
- 为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，便于被发现。

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开发

请先阅读[开发指南](docs/development.md)与[架构文档](docs/architecture.md)。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 许可证

[MIT](LICENSE)

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。