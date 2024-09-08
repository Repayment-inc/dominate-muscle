※※※※エラー※※※※
※1 middleware jwt 周りで下記エラー
console.log("Authenticated user:", req.user); // ログに出力

※2 それか npm run dev 時に下記エラー
[ERROR] 03:36:22 Error: Cannot find module './types/express'
Require stack:

ーー上記エラーが出たときの対処方法ーー

1.app.ts に下記を記述
import './types/express';

2.ビルド
npx tsc --build

3.npm run dev

4.おそらく※2 のエラーが出るため、下記をコメントアウト
import './types/express';

5.npm run dev でうまくいくはず。

もっかい再現したら

1.
2.
3. で ok だった
