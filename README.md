# DeepSeek Harness (Self-Hosted Edition)

English | [中文](README.zh.md)

This is a **self-hosted, independently maintained edition** of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`), an open-source agent harness originally developed by [DeepSeek AI](https://deepseek.com), released under the MIT license.

It uses an architecture where **everything is a plugin**, and is powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://github.com/cordiverse/paper).

> This repository is maintained by [zhemed](https://github.com/zhemed). It tracks upstream and adds self-hosting fixes: LAN access, plain-HTTP compatibility, and DeepSeek V4 thinking-effort passthrough.

## Run from source

```sh
git clone https://github.com/zhemed/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

The command starts the Web UI, served at `http://127.0.0.1:3080` by default. See [Web UI guide](docs/user/guide/index.md).

> The official npm package (`npx @deepseek-ai/dsh web`) is published by DeepSeek AI; this self-hosted edition is deployed from source.

## Feedback and support

- Report issues: [zhemed/deepseek-harness Issues](https://github.com/zhemed/deepseek-harness/issues)
- Add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your plugin repository for discoverability.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

For agents, follow [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE)

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).