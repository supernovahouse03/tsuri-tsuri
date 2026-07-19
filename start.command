#!/bin/bash
# つりつりゲームを起動する(ダブルクリックでOK)
cd "$(dirname "$0")"
PORT=5198
if ! [ -d dist ]; then
  echo "dist がありません。先に npm run build を実行してください"
  read -r -p "Enterで閉じる"
  exit 1
fi
(sleep 1; open "http://localhost:$PORT") &
echo "つりつりゲーム: http://localhost:$PORT  (このウィンドウを閉じると終了します)"
python3 -m http.server "$PORT" -d dist
