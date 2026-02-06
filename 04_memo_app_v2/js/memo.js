"use strict";

// ページ全体が読み込まれたタイミングで実行する
window.addEventListener("DOMContentLoaded", function () {

  // localStorageが使えるか確認
  if (typeof localStorage === "undefined") {
    window.alert("このブラウザはLocal Storage機能が実装されていません");
    return;
  }

  viewStorage();   // データ一覧を表示
  selectTable();   // データ選択処理
  saveLocalStorage();  // 保存処理のイベント登録
  delLocalStorage(); // 削除処理のイベント登録
  allClearLocalStorage();  // 全削除処理のイベント登録

  // ------------------------------------------------------
  // localStorageのデータを一覧表示する関数
  // ------------------------------------------------------
  function viewStorage() {
    const list = document.getElementById("list");

    // 既存の行を削除
    while (list.rows.length > 0) {
      list.deleteRow(0);
    }

    // localStorageの全データを取得して表示
    for (let i = 0; i < localStorage.length; i++) {
      const w_key = localStorage.key(i);
      const w_value = localStorage.getItem(w_key);

      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");

      // D: ラジオボタンをチェックボックスに変更
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "chkbox1";
      td1.appendChild(checkbox);

      td2.textContent = w_key;
      td3.textContent = w_value;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      list.appendChild(tr);
    }
    $("#table1").tablesorter({
      sortList: [[1, 0]]
    });
    $("#table1").trigger("update");
  }

  // ------------------------------------------------------
  // データ選択処理
  // ------------------------------------------------------
  function selectTable() {
    const select = document.getElementById("select");

    select.addEventListener("click", function (e) {
      e.preventDefault();

      const result = selectRadioBtn();
    }, false);
  }

  // ------------------------------------------------------
  // データ選択チェック処理
  // ------------------------------------------------------
  function selectRadioBtn() {
    let w_sel = "0";
    let w_count = 0;
    let w_textKey = "";
    let w_textMemo = "";

    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("list");

    for (let i = 0; i < chkbox1.length; i++) {
      if (chkbox1[i].checked) {
        w_count++;

        // A: 最初にチェックされている行の値を取得
        if (w_count === 1) {
          // C: 最初にチェックされている行の値を画面にセット
          w_textKey = table1.rows[i].cells[1].textContent;
          w_textMemo = table1.rows[i].cells[2].textContent;
          
          document.getElementById("textKey").value = w_textKey;
          // B: 最初にチェックされている行の値を画面にセット
          document.getElementById("textMemo").value = w_textMemo;
        }
      }
    }

    // チェックされている行が１つの場合
    if (w_count === 1) {
      w_sel = "1";
      return w_sel;
    }

    // チェックされている行が１つではない場合
    if (w_count !== 1) {
      window.alert("1つ選択(select)してください。");
    }

    return w_sel;
  }

  // ------------------------------------------------------
  // 保存処理
  // ------------------------------------------------------
  function saveLocalStorage() {
    const save = document.getElementById("save");

    save.addEventListener("click", function (e) {
      e.preventDefault();

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      if (key === "" || value === "") {
        window.alert("Key、Memoはいずれも必須です。");
        return;
      }

      // 確認ダイアログの結果を変数にセット
      let w_confirm = confirm(`LocalStorageに ${key} ${value} を保存(save)しますか?`);

      // 確認ダイアログで「OK」を押されたとき、この処理を実行する
      if (w_confirm === true) {
        localStorage.setItem(key, value);
        viewStorage();
        let w_msg = `LocalStorageに ${key} ${value} を保存(ほぞん)しました。`;
        window.alert(w_msg);
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    }, false);
  }

  // ------------------------------------------------------
  // localStorage から1件削除する処理
  // ------------------------------------------------------
  function delLocalStorage() {
    const del = document.getElementById("del");

    del.addEventListener("click", function (e) {
      e.preventDefault();

      let w_sel = selectRadioBtn();

      if (w_sel !== "1") {
        return;
      }

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      // 確認ダイアログの結果を変数にセット
      let w_confirm = confirm(`LocalStorageから ${key} ${value} を削除(delete)しますか?`);

      // 確認ダイアログで「OK」を押されたとき、この処理を実行する
      if (w_confirm === true) {
        localStorage.removeItem(key);

        window.alert(`LocalStorageから ${key} ${value} を削除(delete)しました。`);

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";

        viewStorage();
      }
    }, false);
  }

  // ------------------------------------------------------
  // localStorage のデータを全削除する処理
  // ------------------------------------------------------
  function allClearLocalStorage() {
    const allClear = document.getElementById("allclear");

    allClear.addEventListener("click", function (e) {
      e.preventDefault();

      let confirmResult = confirm("LocalStorageのデータをすべて削除します。よろしいですか？");

      if (confirmResult === true) {
        localStorage.clear();

        window.alert("LocalStorageのデータをすべて削除しました。");

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";

        viewStorage();
      }
    }, false);
  }

}, false);