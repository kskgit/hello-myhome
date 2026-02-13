# Requirements Document

## Introduction

プロフィール管理機能は、Hello My Home アプリケーションにおける個人財務情報の登録・管理機能である。ユーザーの年収・貯蓄額・金利条件等の財務プロファイルを管理し、物件評価の「資金適合性」（50%ウェイト）カテゴリで使用される基礎データを提供する。MVP段階ではシングルユーザー前提とし、1つのプロフィールのみを管理する。

## Requirements

### Requirement 1: プロフィール情報の登録

**Objective:** ユーザーとして、自分の財務情報（年収・貯蓄額・金利等）を登録したい。物件評価時に資金適合性を正確に判定するためである。

#### Acceptance Criteria
1. The Hello My Home shall 以下の財務情報の入力フィールドを提供する: 年収（万円）、貯蓄額（万円）、想定金利（%）、返済期間（年）、頭金割合（%）
2. When ユーザーが全ての必須フィールドを入力して保存ボタンを押した時, the Hello My Home shall プロフィール情報をデータベースに保存する
3. When プロフィールの保存が成功した時, the Hello My Home shall 保存完了のフィードバックをユーザーに表示する

### Requirement 2: プロフィール情報の表示

**Objective:** ユーザーとして、登録済みの財務情報を確認したい。現在の設定内容を把握し、必要に応じて修正するためである。

#### Acceptance Criteria
1. When ユーザーがプロフィール管理画面にアクセスした時, the Hello My Home shall 登録済みのプロフィール情報を各フィールドに表示する
2. If プロフィールが未登録の場合, the Hello My Home shall 空のフォームを表示し、初回登録を促すメッセージを表示する

### Requirement 3: プロフィール情報の編集

**Objective:** ユーザーとして、登録済みの財務情報を変更したい。年収変動や金利変更等の状況変化を反映するためである。

#### Acceptance Criteria
1. When ユーザーが既存のプロフィール情報を変更して保存ボタンを押した時, the Hello My Home shall 変更内容でデータベースを更新する
2. When プロフィールの更新が成功した時, the Hello My Home shall 更新完了のフィードバックをユーザーに表示する

### Requirement 4: 入力バリデーション

**Objective:** ユーザーとして、入力した財務情報の妥当性を即座に確認したい。誤った値による不正確な物件評価を防ぐためである。

#### Acceptance Criteria
1. The Hello My Home shall 全ての財務項目に対して数値のみの入力を受け付ける
2. The Hello My Home shall 各フィールドに対して以下の範囲制約を検証する: 年収（0以上）、貯蓄額（0以上）、想定金利（0以上かつ20以下）、返済期間（1以上かつ50以下）、頭金割合（0以上かつ100以下）
3. If バリデーションエラーが発生した場合, the Hello My Home shall 該当フィールドの近くにエラーメッセージを表示する
4. While バリデーションエラーが存在する間, the Hello My Home shall 保存ボタンを無効化する

### Requirement 5: データ永続化

**Objective:** ユーザーとして、登録した財務情報がブラウザを閉じても保持されてほしい。再アクセス時に毎回入力し直す必要がないようにするためである。

#### Acceptance Criteria
1. The Hello My Home shall プロフィール情報を PostgreSQL データベースに永続化する
2. When ユーザーがアプリケーションに再アクセスした時, the Hello My Home shall 最後に保存されたプロフィール情報を復元して表示する
3. The Hello My Home shall シングルユーザー前提で1件のプロフィールレコードのみを管理する
