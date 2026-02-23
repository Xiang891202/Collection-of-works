# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


<!-- src/
├── views/                     # 頁面級元件（每個代表一個完整頁面）
│   ├── Home.vue                # 首頁（含 Hero、ProjectList、Footer）
│   └── AboutView.vue           # 關於我頁面（使用 AboutSection + Footer）
│
├── components/                 # 可複用的 UI 元件
│   ├── Header.vue               # 導覽列（含 Logo、導覽項目、ModeToggle）
│   ├── ModeToggle.vue           # 模式切換按鈕
│   ├── HeroSection.vue          # 首屏大標題區（僅用於首頁）
│   ├── ProjectCard.vue          # 單一專案卡片
│   ├── ProjectList.vue          # 專案列表（內含 projects / practice 兩區）
│   ├── AboutSection.vue         # 個人資訊區塊（技能、證照、經歷、聯絡方式）
│   └── Footer.vue               # 頁尾
│
├── router/                     # 路由設定
│   └── index.ts                 # 定義路徑與頁面的對應關係                
│
├── composables/                 # 組合式函式（共享邏輯與狀態）
│   └── useMode.js               # 管理全域模式狀態（展示版/專業版）
│
├── data/
│   └── projects.js              # 專案假資料
│
└── App.vue                      # 根元件（僅包含 <router-view> 及基礎樣式） 
└── main.ts                      -->