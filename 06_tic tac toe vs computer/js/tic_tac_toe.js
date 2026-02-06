// A: フラグ(ペンギン、白熊)
let flag = "pen-flag";

// B: ターン数(何ターン目か)
let counter = 9;

// C: 勝敗判定のフラグ
let winningFlag = false;

// 勝利ライン保存用
let winningLine = null;

// D: HTMLの9個のマス目の要素を取得
let a_1 = document.getElementById("a_1");
let a_2 = document.getElementById("a_2");
let a_3 = document.getElementById("a_3");
let b_1 = document.getElementById("b_1");
let b_2 = document.getElementById("b_2");
let b_3 = document.getElementById("b_3");
let c_1 = document.getElementById("c_1");
let c_2 = document.getElementById("c_2");
let c_3 = document.getElementById("c_3");

// squaresArrayを作成
let squaresArray = [a_1, a_2, a_3, b_1, b_2, b_3, c_1, c_2, c_3];

// 勝利ラインの定義（8パターン）
let line1 = [a_1, a_2, a_3]; // 横1
let line2 = [b_1, b_2, b_3]; // 横2
let line3 = [c_1, c_2, c_3]; // 横3
let line4 = [a_1, b_1, c_1]; // 縦1
let line5 = [a_2, b_2, c_2]; // 縦2
let line6 = [a_3, b_3, c_3]; // 縦3
let line7 = [a_1, b_2, c_3]; // 斜め1
let line8 = [a_3, b_2, c_1]; // 斜め2

let lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];

// New Game Button要素を取得
let newgamebtn_display = document.getElementById("newgame-btn");
let newgamebtn = document.getElementById("btn90");

// 【追加】サウンドファイルの読み込み
let click_sound1 = new Audio("sound/click_sound1.mp3");
let click_sound2 = new Audio("sound/click_sound2.mp3");
let penwin_sound = new Audio("sound/penwin_sound.mp3");
let bearwin_sound = new Audio("sound/bearwin_sound.mp3");
let draw_sound = new Audio("sound/draw_sound.mp3");

// E-1: a_1のクリックに対応する処理
a_1.addEventListener("click", () => {
    isSelect(a_1);
});

// E-2~9: a_2, a_3, b_1, b_2, b_3, c_1, c_2, c_3のクリックに対応する処理
a_2.addEventListener("click", () => {
    isSelect(a_2);
});

a_3.addEventListener("click", () => {
    isSelect(a_3);
});

b_1.addEventListener("click", () => {
    isSelect(b_1);
});

b_2.addEventListener("click", () => {
    isSelect(b_2);
});

b_3.addEventListener("click", () => {
    isSelect(b_3);
});

c_1.addEventListener("click", () => {
    isSelect(c_1);
});

c_2.addEventListener("click", () => {
    isSelect(c_2);
});

c_3.addEventListener("click", () => {
    isSelect(c_3);
});

// F: クリックした時の処理
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
        
        // H: 勝敗判定を呼び出す
        gameOverFlg = judgeLine();
        
        // J: ターン数のカウンターを1減らす
        counter--;
        
        // K: 引き分け判定
        if (counter === 0 && gameOverFlg === "0") {
            setMessage("draw");
            gameOver("draw");
            gameOverFlg = "1";
        }
        
        // D: ペンギンのターンでGameOverにならなかったときだけクマのターンを実行
        if (gameOverFlg === "0") {
            const squaresBox = document.getElementById("squaresBox");
            squaresBox.classList.add("js-unclickable");
            
            setTimeout(() => {
                bearTurn();
            }, 2000);
        }
    } 
    // G: 白熊のターンの場合
    else if (flag === "bear-flag") {
        selectSquare.classList.add("js-bear-checked");
        selectSquare.classList.remove("js-clickable");
        setMessage("pen-turn");
        // 【追加】白熊のクリック音を再生
        click_sound2.currentTime = 0;
        click_sound2.play();
        
        // H: 勝敗判定を呼び出す
        gameOverFlg = judgeLine();
        
        // J: ターン数のカウンターを1減らす
        counter--;
        
        // K: 引き分け判定
        if (counter === 0 && gameOverFlg === "0") {
            setMessage("draw");
            gameOver("draw");
            gameOverFlg = "1";
        }
    }
    
    return gameOverFlg;
}

// I: 勝敗判定の関数
function judgeLine() {
    let gameOverFlg = "0";
    
    // A: ペンギンの勝利判定
    let penguinWinningLine = isWinner("penguins", lineArray);
    if (penguinWinningLine !== false) {
        setMessage("pen-win");
        winningFlag = true;
        winningLine = penguinWinningLine;
        gameOver("penguins", penguinWinningLine);
        gameOverFlg = "1";
        return gameOverFlg;
    }
    
    // A: 白熊の勝利判定
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
    // B: 勝利ラインをチェック
    let winningLine = false;
    
    lineArray.some(function(line) {
        if (player === "penguins") {
            // C: ペンギンのクラスがすべて含まれているかチェック
            if (line.every(square => square.classList.contains("js-pen-checked"))) {
                winningLine = line;
                return true;
            }
        } else if (player === "bear") {
            // C: 白熊のクラスがすべて含まれているかチェック
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
    // B: squaresBoxをクリック不可にする
    const squaresBox = document.getElementById("squaresBox");
    squaresBox.classList.add("js-unclickable");
    
    // 勝利ラインをハイライト
    if (winningLine) {
        if (winner === "penguins") {
            // B: ペンギンの勝利ラインをハイライト
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
            // B: 白熊の勝利ラインをハイライト
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
    
    // C: New Gameボタンを表示
    newgamebtn_display.classList.remove("js-hidden");
}

// New Game処理
newgamebtn.addEventListener("click", function() {
    // D: フラグとカウンターをリセット
    flag = "pen-flag";
    counter = 9;
    winningFlag = false;
    winningLine = null;
    
    // G: すべてのマス目をリセット
    squaresArray.forEach(function(square) {
        square.classList.remove("js-pen-checked");
        square.classList.remove("js-bear-checked");
        square.classList.remove("js-pen_highLight");
        square.classList.remove("js-bear_highLight");
        square.classList.add("js-clickable");
    });
    
    const squaresBox = document.getElementById("squaresBox");
    squaresBox.classList.remove("js-unclickable");
    
    // D: メッセージをリセット
    setMessage("pen-turn");
    
    // D: New Gameボタンを非表示
    newgamebtn_display.classList.add("js-hidden");
    
    // D: Snowfallを停止
    $(document).snowfall("clear");
});

// **********************************************
// クマのターン
// **********************************************
function bearTurn() {
    let bearTurnEnd = "0";
    let gameOverFlg = "0";

    while(bearTurnEnd === "0") {

        // クマのリーチ行検索(attack)
        bearTurnEnd = isReach("bear");
        if (bearTurnEnd === "1") { //クマのリーチ行あり...この一手で終わり
            gameOverFlg = "1";
            break; //while を終了
        }

        // ペンギンのリーチ行検索(defense)
        bearTurnEnd = isReach("penguins");
        if (bearTurnEnd === "1") {
            break; //while を終了
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
    // D: 勝利メッセージ
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
    // D: 引き分けメッセージ
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

// 初期メッセージを表示
window.onload = function() {
    setMessage("pen-turn");
};