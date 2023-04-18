const display = document.getElementById("display");
const answer = document.getElementById("answer");
const questionArea = document.getElementById("question-area");
const questionText = document.getElementById("question");
const answerArea = document.getElementById("answer-area");
const startLabel = document.getElementById("start-label");
const scoreLabel = document.getElementById("score");
const timeLabel = document.getElementById("time");


let isRunning = false;
let question = "";
let score = 0;
const timelimit = 60;


// ゲームスタート
function gameStart() {
    if (isRunning) return;

    // スコア初期化
    score = 0;

    isRunning = true;

    // カウントダウン
    let count = 3;
    startLabel.innerText = count;

    const id = setInterval(() => {
        count--;
        startLabel.innerText = count;

        if(count <= 0) {
            init();
            clearInterval(id);

            initTimer();
        }

    },1000);
}


function init() {
    initAnswer();
    showGameDisplay(true);
    display.onclick = "";

    // 問題を生成
    while (true) {
        const q = makeQuestion();
        if (q != question) {
            question = q;
            questionText.innerText = question;
            break;
        }
    }
}


function showGameDisplay(flag) {
    // スタート画面を隠す
    startLabel.style.visibility = flag ? "hidden" : "visible";
    // ゲーム画面を表示
    questionArea.style.display = flag ? "block" : "none";
    answerArea.style.display = flag ? "block" : "none";
}


function initTimer() {
    // タイマー
    let time = timelimit;
    timeLabel.innerText = "██████████████████████████████";

    let id = setInterval(function() {
        time--;
        if (time % (timelimit / 30) === 0) {
            timeLabel.innerText = timeLabel.innerText.slice(0, -1);
        }
        if (time === 0) {
            finishGame();
            clearInterval(id);
        }
    }, 100);
}


function makeQuestion() {
    const qList = Object.values(answerList);

    return qList[Math.floor(Math.random() * qList.length)];
}


function initAnswer() {
    answer.innerText = "▯▯▯▯";
}

// キー入力時
document.onkeydown = (e) => {
	if (!e) return;

    const key = e.key.toUpperCase()
    const innerText = answer.innerText.replaceAll("▯", "");

    if (innerText.length <= 4) {
        let answerText = "";

        // １文字削除
        if (key == "BACKSPACE") {
            answerText = innerText.slice(0, -1);

        } else if (key == "ENTER") {
            judgeAnswer()

        // 単体入力
        } else if (key.length == 1 && innerText.length < 4) {
            answerText = (innerText + key);
        
        // それ以外
        } else {
            answerText = innerText;
        }

        answer.innerText = answerText.padEnd(4, "▯");
    }
};


function judgeAnswer() {
    const a = answer.innerText;
    const aList = Object.keys(answerList);

    if (aList.includes(a)) {
        if (question == answerList[answer.innerText]) {
            correct();
            return;
        }
    }

    incorrect();
}

// 正解
function correct() {
    score++;
    updateScore();

    init();
}

// 不正解
function incorrect() {
    let count = 3;

    // 不正解エフェクト
    const id = setInterval(() => {
        count--;
        answer.style = `margin: ${Math.sin(count * 90) * 30}px`;

        if(count <= 0) clearInterval(id);
        
    },20);
}


function updateScore() {
    scoreLabel.innerText = "score: " + score;
}


function finishGame() {
    questionText.innerText = "score: " + score;
    answer.innerText = "Click to Restart"

    isRunning = false;
    display.onclick = readyToRestart;
}

function readyToRestart() {
    startLabel.innerText = "Click to Start";
    showGameDisplay(false);
}