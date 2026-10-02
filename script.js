```javascript
// =========================
// ①〜⑤の説明データ
// =========================

const stepData = {

  1: {
    number: "STEP 1",

    title: "天気をお願いする",

    icon: "🙋",

    description:
      "まず、自分のプログラムから「神戸の天気を教えてください」と天気サービスにお願いをします。"
      + "<br><br>"
      + "このように、APIを使うと別のサービスに情報を要求することができます。"
  },


  2: {
    number: "STEP 2",

    title: "APIが情報をつなぐ",

    icon: "🔌",

    description:
      "APIは、プログラムと天気サービスの間をつなぐ「窓口」のような役割をします。"
      + "<br><br>"
      + "自分のプログラムが天気サービスの内部に直接入るのではなく、APIを通して情報をやり取りします。"
  },


  3: {
    number: "STEP 3",

    title: "天気データが届く",

    icon: "☀️",

    description:
      "天気サービスから、天気・気温・湿度などのデータが返ってきます。"
      + "<br><br>"
      + "例えば「晴れ」「25℃」「湿度60%」というようなデータです。"
  },


  4: {
    number: "STEP 4",

    title: "データを加工する",

    icon: "💻",

    description:
      "受け取ったデータを、そのまま使う必要はありません。"
      + "<br><br>"
      + "JavaScriptなどのプログラムを使って、文章を追加したり、デザインを変えたりして、自分が使いやすい形に加工できます。"
  },


  5: {
    number: "STEP 5",

    title: "WebサイトやSNSで使う",

    icon: "📱",

    description:
      "加工したデータをWebサイトに表示したり、アプリで使ったり、SNSへ投稿したりできます。"
      + "<br><br>"
      + "このようにAPIを利用すると、複数のサービスを組み合わせて便利な仕組みを作ることができます。"
  }

};


// =========================
// HTMLの要素を取得
// =========================

const cards = document.querySelectorAll(".card");

const detail = document.getElementById("detail");

const detailNumber =
  document.getElementById("detailNumber");

const detailTitle =
  document.getElementById("detailTitle");

const detailDescription =
  document.getElementById("detailDescription");

const detailIllustration =
  document.getElementById("detailIllustration");

const closeButton =
  document.getElementById("closeButton");


// =========================
// カードをクリックしたとき
// =========================

cards.forEach(function(card) {

  card.addEventListener("click", function() {

    // 何番目がクリックされたか取得
    const step = card.dataset.step;

    // 対応する説明を取得
    const data = stepData[step];


    // 詳細情報を変更
    detailNumber.textContent = data.number;

    detailTitle.textContent = data.title;

    detailDescription.innerHTML =
      data.description;

    detailIllustration.textContent =
      data.icon;


    // すべてのカードからactiveを削除
    cards.forEach(function(item) {
      item.classList.remove("active");
    });


    // クリックしたカードを選択状態にする
    card.classList.add("active");


    // 詳細説明を表示
    detail.classList.add("show");


    // 詳細説明の位置までスクロール
    detail.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  });

});


// =========================
// ×ボタン
// =========================

closeButton.addEventListener("click", function() {

  detail.classList.remove("show");


  // 選択状態を解除

  cards.forEach(function(card) {

    card.classList.remove("active");

  });

});
```
