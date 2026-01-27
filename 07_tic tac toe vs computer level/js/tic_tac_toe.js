// フラグ(ペンギン、白熊)
let flag = "pen-flag";

// ターン数(何ターン目か)
let counter = 9;

// 勝敗判定のフラグ
let winningFlag = false;

// 勝利ライン保存用
let winningLine = null;

// class="square" を取得（しゅとく）
const squares = document.getElementsByClassName("square");

// Array に変換（へんかん）
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const squaresArray = Array.from(squares);

// squaresの要素（ようそ）を取得（しゅとく）
const a_1 = document.getElementById("a_1");
const a_2 = document.getElementById("a_2");
const a_3 = document.getElementById("a_3");
const b_1 = document.getElementById("b_1");
const b_2 = document.getElementById("b_2");
const b_3 = document.getElementById("b_3");
const c_1 = document.getElementById("c_1");
const c_2 = document.getElementById("c_2");
const c_3 = document.getElementById("c_3");

// class="level" を取得（しゅとく）
const levels = document.querySelectorAll(".level");

// Array に変換...もしline28でgetElementsByClassNameを使う場合は、forEachが使えないのでArrayに変換すること。
// const levelsArray = Array.from(levels);

// levelの要素を取得　レベル設定エリア
const level_1 = document.getElementById("level_1");
const level_2 = document.getElementById("level_2");
const level_3 = document.getElementById("level_3");

// NewGameボタン取得（しゅとく）
const newgamebtn_display = document.getElementById("newgame-btn");
const newgamebtn = document.getElementById("btn90");

// Win or Lose Judgment Line
const line1 = JudgLine(squaresArray, ["a_1", "a_2", "a_3"]);
const line2 = JudgLine(squaresArray, ["b_1", "b_2", "b_3"]);
const line3 = JudgLine(squaresArray, ["c_1", "c_2", "c_3"]);
const line4 = JudgLine(squaresArray, ["a_1", "b_1", "c_1"]);
const line5 = JudgLine(squaresArray, ["a_2", "b_2", "c_2"]);
const line6 = JudgLine(squaresArray, ["a_3", "b_3", "c_3"]);
const line7 = JudgLine(squaresArray, ["a_1", "b_2", "c_3"]);
const line8 = JudgLine(squaresArray, ["a_3", "b_2", "c_1"]);

const lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];

const lineRandom = cornerLine(squaresArray, ["a_1", "a_3", "c_1", "c_3"]);

// 【追加】サウンドファイルの読み込み
let click_sound1 = new Audio("sound/click_sound1.mp3");
let click_sound2 = new Audio("sound/click_sound2.mp3");
let penwin_sound = new Audio("sound/penwin_sound.mp3");
let bearwin_sound = new Audio("sound/bearwin_sound.mp3");
let draw_sound = new Audio("sound/draw_sound.mp3");

// **********************************************
// ページ本体が読み込まれたタイミングで実行するコード
// **********************************************
window.addEventListener("DOMContentLoaded",
    function() {
        // メッセージ（最初はpenguinsのターンから）
        setMessage("pen-turn");

        // squareがクリック可能かを判断するクラスを追加
        squaresArray.forEach(function (square) {
            square.classList.add("js-clickable");
        });

        LevelSetting(0); // levelの要素を取得　レベル1設定

    }, false
);

// **********************************************
// レベル設定
// **********************************************
let index; //クリックした要素のインデックスを格納する変数
levels.forEach((level) => {
    level.addEventListener("click", () => {
        index = [].slice.call(levels).indexOf(level);
        LevelSetting(index);
    });
});

function LevelSetting(index) {
    // レベル設定ボタン　スタイルクリア
    level_1.classList.remove("level-selected");
    level_2.classList.remove("level-selected");
    level_3.classList.remove("level-selected");
    level_1.classList.remove("level-non-selected");
    level_2.classList.remove("level-non-selected");
    level_3.classList.remove("level-non-selected");
    
    // セッションストレージにkey="tic_tac_toe_access"がある場合は初回ではない
    if(sessionStorage.getItem("tic_tac_toe_access")){
        switch (index) {
            case 0:
                sessionStorage.setItem("tic_tac_toe_access", "1"); 
                level_1.classList.add("level-selected");
                level_2.classList.add("level-non-selected");
                level_3.classList.add("level-non-selected");
                break;
            case 1:
                sessionStorage.setItem("tic_tac_toe_access", "2"); 
                level_1.classList.add("level-non-selected");
                level_2.classList.add("level-selected");
                level_3.classList.add("level-non-selected");
                break;
            case 2:
                sessionStorage.setItem("tic_tac_toe_access", "3"); 
                level_1.classList.add("level-non-selected");
                level_2.classList.add("level-non-selected");
                level_3.classList.add("level-selected");
                break;
            default:
                level_1.classList.add("level-selected");
                level_2.classList.add("level-non-selected");
                level_3.classList.add("level-non-selected");
                break;
        }

    } else {
        // セッションストレージにkey="tic_tac_toe_access"がない場合は初回実行
        sessionStorage.setItem("tic_tac_toe_access", "1");
        level_1.classList.add("level-selected");
        level_2.classList.add("level-non-selected");
        level_3.classList.add("level-non-selected");
    }
}

// **********************************************
// Win or Lose Judgment Lineを配列化
// **********************************************
// JavaScriptでfilterを使う方法：https://techacademy.jp/magazine/15575
function JudgLine(targetArray, idArray) {
    return targetArray.filter(function(e) {
        return (e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2]);
    });
}

// **********************************************
// corner Lineを配列化
// **********************************************
// JavaScriptでfilterを使う方法：https://techacademy.jp/magazine/15575
function cornerLine(targetArray, idArray) {
    return targetArray.filter(function(e) {
        return (e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2] || e.id === idArray[3]);
    });
}

// **********************************************
// squareをクリックしたときにイベント発火（はっか）
// **********************************************
// クリックしたsquareに、penguinsかbearを表示。画像を表示したsquareはクリックできないようにする、win or lose Judgement
squaresArray.forEach(function (square) {
    square.addEventListener('click', () => {
        if (counter===9) {
            const levelBox = document.getElementById("levelBox");
            levelBox.classList.add("js-unclickable"); //ゲーム途中でlevelBoxをクリックできないようにする
        }
        let gameOverFlg = isSelect(square); // gameStatusを返却
        
        //GameOverではない場合、クマのターン（auto）
        if (gameOverFlg === "0") {
            const squaresBox = document.getElementById("squaresBox");
            squaresBox.classList.add("js-unclickable"); //squares-boxをクリックできないようにする
            setTimeout(
                function () {
                    bearTurn();
                }, 
                "2000"
            );

        }
    });
});

// クリックした時の処理
function isSelect(selectSquare) {
    let gameOverFlg = "0";
    
    // ペンギンのターンの場合
    if (flag === "pen-flag") {
        selectSquare.classList.add("js-pen-checked");
        selectSquare.classList.remove("js-clickable");
        setMessage("bear-turn");
        // 【追加】ペンギンのクリック音を再生
        click_sound1.currentTime = 0;
        click_sound1.play();
        
        // 勝敗判定を呼び出す
        gameOverFlg = judgeLine();
        
        // ターン数のカウンターを1減らす
        counter--;
        
        // 引き分け判定
        if (counter === 0 && gameOverFlg === "0") {
            setMessage("draw");
            gameOver("draw");
            gameOverFlg = "1";
        }
    } 
    // 白熊のターンの場合
    else if (flag === "bear-flag") {
        selectSquare.classList.add("js-bear-checked");
        selectSquare.classList.remove("js-clickable");
        setMessage("pen-turn");
        // 【追加】白熊のクリック音を再生
        click_sound2.currentTime = 0;
        click_sound2.play();
        
        // 勝敗判定を呼び出す
        gameOverFlg = judgeLine();
        
        // ターン数のカウンターを1減らす
        counter--;
        
        // 引き分け判定
        if (counter === 0 && gameOverFlg === "0") {
            setMessage("draw");
            gameOver("draw");
            gameOverFlg = "1";
        }
    }
    
    return gameOverFlg;
}

// 勝敗判定の関数
function judgeLine() {
    let gameOverFlg = "0";
    
    // ペンギンの勝利判定
    let penguinWinningLine = isWinner("penguins", lineArray);
    if (penguinWinningLine !== false) {
        setMessage("pen-win");
        winningFlag = true;
        winningLine = penguinWinningLine;
        gameOver("penguins", penguinWinningLine);
        gameOverFlg = "1";
        return gameOverFlg;
    }
    
    // 白熊の勝利判定
    let bearWinningLine = isWinner("bear", lineArray);
    if (bearWinningLine !== false) {
        setMessage("bear-win");
        winningFlag = true;
        winningLine = bearWinningLine;
        gameOver("bear", bearWinningLine);
        gameOverFlg = "1";
        return gameOverFlg;
    }
    
    return gameOverFlg;
}

// 勝者判定関数
function isWinner(player, lineArray) {
    // 勝利ラインをチェック
    let winningLine = false;
    
    lineArray.some(function(line) {
        if (player === "penguins") {
            // ペンギンのクラスがすべて含まれているかチェック
            if (line.every(square => square.classList.contains("js-pen-checked"))) {
                winningLine = line;
                return true;
            }
        } else if (player === "bear") {
            // 白熊のクラスがすべて含まれているかチェック
            if (line.every(square => square.classList.contains("js-bear-checked"))) {
                winningLine = line;
                return true;
            }
        }
        return false;
    });
    
    return winningLine;
}

// ゲームオーバー処理
function gameOver(winner, winningLine) {
    // squaresBoxをクリック不可にする
    const squaresBox = document.getElementById("squaresBox");
    squaresBox.classList.add("js-unclickable");
    
    // 勝利ラインをハイライト
    if (winningLine) {
        if (winner === "penguins") {
            // ペンギンの勝利ラインをハイライト
            winningLine.forEach(function(square) {
                square.classList.add("js-pen_highLight");
            });
            // 【追加】ペンギン勝利音を再生
            penwin_sound.currentTime = 0;
            penwin_sound.play();
            // Snowfall for penguins (丸い雪)
            $(document).snowfall({
                flakeCount: 100,
                maxSpeed: 5,
                maxSize: 10,
                minSize: 1,
                round: true
            });
        } else if (winner === "bear") {
            // 白熊の勝利ラインをハイライト
            winningLine.forEach(function(square) {
                square.classList.add("js-bear_highLight");
            });
            // 【追加】白熊勝利音を再生
            bearwin_sound.currentTime = 0;
            bearwin_sound.play();
            // Snowfall for bear (丸い水色の雪)
            $(document).snowfall({
                flakeCount: 100,
                maxSpeed: 5,
                maxSize: 10,
                minSize: 1,
                round: true,
                flakeColor: '#00d4ff'
            });
        }
    } else if (winner === "draw") {
        // 【追加】引き分け音を再生
        draw_sound.currentTime = 0;
        draw_sound.play();
    }
    
    // New Gameボタンを表示
    newgamebtn_display.classList.remove("js-hidden");
}

// **********************************************
// NewGameボタン　クリック時、ゲーム初期化
// **********************************************
// classListの使い方まとめ：https://qiita.com/tomokichi_ruby/items/2460c5902d19b81cace5
newgamebtn.addEventListener("click", function () {
    // penguinsのターン
    flag = "pen-flag";
    // ターン数カウンター
    counter = 9;
    winningFlag = false;
    winningLine = null;
    
    // すべてのマス目をリセット
    squaresArray.forEach(function (square) {
        square.classList.remove("js-pen-checked");
        square.classList.remove("js-bear-checked");
        square.classList.remove("js-unclickable");
        square.classList.remove("js-pen_highLight");
        square.classList.remove("js-bear_highLight");
        square.classList.add("js-clickable"); // squareがクリック可能かを判断するクラスを追加
    });
    const squaresBox = document.getElementById("squaresBox"); // 2022/12/22 fukada-add
    squaresBox.classList.remove("js-unclickable"); //squares-boxをクリックできるようにする
    levelBox.classList.remove("js-unclickable"); //levelBoxをクリックできるようにする

    setMessage("pen-turn");
    newgamebtn_display.classList.add("js-hidden");
    
    // snowfall stop
    $(document).snowfall("clear");
});

// **********************************************
// クマのターン
// **********************************************
function bearTurn() {
    // levelを取得
    let level = sessionStorage.getItem("tic_tac_toe_access");

    let bearTurnEnd = "0";
    let gameOverFlg = "0";

    while(bearTurnEnd === "0") {
        
        if (level === "1" || level === "2" || level === "3") {
            // クマのリーチ行検索(attack)
            bearTurnEnd = isReach("bear");
            if (bearTurnEnd === "1") { //クマのリーチ行あり...この一手で終わり
                gameOverFlg = "1";
                break; //while を終了
            }
        }

        if (level === "2" || level === "3") {
            // ペンギンのリーチ行検索(defense)
            bearTurnEnd = isReach("penguins");
            if (bearTurnEnd === "1") {
                break; //while を終了
            }
        }

        if (level === "2" || level === "3") {
            // 真ん中のマス目b_2が空いていたら選ぶ
            if (b_2.classList.contains("js-clickable")) {
                gameOverFlg = isSelect(b_2);
                bearTurnEnd = "1"; // クマのターン終了
                break; //while を終了
            }
        }

        if (level === "3") {
            // 角のマス目a_1,a_3,c_1,c_3が空いていたら選ぶ
            for (let square of lineRandom) {
                if (square.classList.contains("js-clickable")) {
                    gameOverFlg = isSelect(square);
                    bearTurnEnd = "1"; // クマのターン終了
                    break; // forのloopを終了
                }
            }
            if (bearTurnEnd === "1") break; //while を終了
        }

        // まだマス目を選んでいない場合、クリックできるマス目をランダムにえらぶ
        const bearSquare = squaresArray.filter(function(square) {
            return square.classList.contains("js-clickable");
        });

        let n = Math.floor(Math.random() * bearSquare.length);
        gameOverFlg = isSelect(bearSquare[n]);
        break; //while を終了

    }

    //GameOverではない場合、
    if (gameOverFlg === "0") {
        const squaresBox = document.getElementById("squaresBox"); // 2022/12/22 fukada-add
        squaresBox.classList.remove("js-unclickable"); //squares-boxをクリックできるようにする
    }
    
}

// **********************************************
// リーチ行をさがす
// **********************************************
function isReach(status) {
    let bearTurnEnd = "0"; // クマのターン "1":終了
    
    lineArray.some(function (line) {
        let bearCheckCnt = 0; //クマがチェックされている数
        let penCheckCnt = 0; //ペンギンがチェックされている数

        line.forEach(function (square) {
            if (square.classList.contains("js-bear-checked")) {
                bearCheckCnt++; //クマがチェックされている数
            }
            if (square.classList.contains("js-pen-checked")) {
                penCheckCnt++; //ペンギンがチェックされている数
            }
        });
        
        // クマのリーチ行検索時に、クマのリーチ行あり
        if (status === "bear" && bearCheckCnt === 2 && penCheckCnt === 0) {
            bearTurnEnd = "1"; // クマのリーチ行あり
        }

        // ペンギンのリーチ行検索時に、ペンギンのリーチ行あり
        if (status === "penguins" && bearCheckCnt === 0 && penCheckCnt === 2) {
            bearTurnEnd = "1"; // ペンギンのリーチ行あり
        }

        // クマかペンギンのリーチ行ありの場合、空いているマス目を選択する
        if(bearTurnEnd === "1"){
            line.some(function (square) {
                if (square.classList.contains("js-clickable")) {
                    isSelect(square);
                    return true; //line.someのloop をぬける
                }
            })
            return true; //lineArray.someのloop をぬける
        }

    });

    return bearTurnEnd;
}

// メッセージ表示の関数
function setMessage(id) {
    let msgtext = document.getElementById("msgtext");
    let currentPlayerImg = document.getElementById("current-player-img");
    
    if (id === "pen-turn") {
        msgtext.innerHTML = "Penguins Attack! (your turn)";
        flag = "pen-flag";
        // アニメーションクラスを削除
        msgtext.classList.remove("win-animation-right", "win-animation-left", "draw-animation");
        // 通常の1枚画像表示に戻す
        currentPlayerImg.innerHTML = '<img id="player-icon" src="img/penguins.jpg" alt="player">';
    } else if (id === "bear-turn") {
        msgtext.innerHTML = "White Bear Attack! (computer turn)";
        flag = "bear-flag";
        // アニメーションクラスを削除
        msgtext.classList.remove("win-animation-right", "win-animation-left", "draw-animation");
        // 通常の1枚画像表示に戻す
        currentPlayerImg.innerHTML = '<img id="player-icon" src="img/whitebear.jpg" alt="player">';
    } 
    // 勝利メッセージ
    else if (id === "pen-win") {
        msgtext.innerHTML = "Penguins Win!!";
        currentPlayerImg.innerHTML = '<img id="player-icon" src="img/penguins.jpg" alt="player">';
        // 【追加】ペンギン勝利メッセージにアニメーションを追加（右から）
        msgtext.classList.remove("win-animation-right", "win-animation-left", "draw-animation");
        setTimeout(() => {
            msgtext.classList.add("win-animation-right");
        }, 10);
    } else if (id === "bear-win") {
        msgtext.innerHTML = "White Bear Win!!";
        currentPlayerImg.innerHTML = '<img id="player-icon" src="img/whitebear.jpg" alt="player">';
        // 【追加】白熊勝利メッセージにアニメーションを追加（左から）
        msgtext.classList.remove("win-animation-right", "win-animation-left", "draw-animation");
        setTimeout(() => {
            msgtext.classList.add("win-animation-left");
        }, 10);
    } 
    // 引き分けメッセージ
    else if (id === "draw") {
        msgtext.innerHTML = "Draw!!";
        // 【追加】引き分け時は両方の画像を表示
        currentPlayerImg.innerHTML = '<div class="draw-icons"><img src="img/penguins.jpg" alt="penguin"><img src="img/whitebear.jpg" alt="bear"></div>';
        // 【追加】引き分けメッセージにアニメーションを追加（上から）
        msgtext.classList.remove("win-animation-right", "win-animation-left", "draw-animation");
        setTimeout(() => {
            msgtext.classList.add("draw-animation");
        }, 10);
    }
}