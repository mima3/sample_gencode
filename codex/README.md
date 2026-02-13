# メンタルチェックアプリ（React + Vite + TypeScript）

このフォルダは、React + Vite + TypeScript で作成したバーンアウト/ボーアウト診断アプリです。

## 前提

- Node.js 18 以上を推奨
- npm が使えること

## セットアップ

```bash
npm install
```

## 開発環境で試す（ローカル起動）

```bash
npm run dev
```

- 起動後、表示される URL（通常 `http://localhost:5173`）をブラウザで開いて確認します。
- 変更は HMR で即時反映されます。

## チェックする（型チェック / Lint）

### 型チェック

```bash
npm run typecheck
```

- TypeScript の型整合性を確認します。

### Lint チェック

```bash
npm run lint
```

- ESLint による静的解析を実行します。

### テスト（カバレッジ計測）

```bash
npm run test:coverage
```

- Vitest で単体テストを実行し、カバレッジを計測します。
- カバレッジレポートは `coverage/` に出力されます。

## ビルドする（本番用）

```bash
npm run build
```

- `tsc -b` で型チェックを行った後、Vite で本番ビルドします。
- 出力先は `dist/` です。

## ビルド結果をローカル確認する

```bash
npm run preview
```

- `dist/` をローカルサーバーで確認できます。
