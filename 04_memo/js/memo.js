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
  delLocalStorage(); // 削除処理のイベント登録

  // ------------------------------------------------------
  // 「保存」ボタンがクリックされた時の処理
  // ------------------------------------------------------
  document.getElementById("save").addEventListener("click", function (e) {
    e.preventDefault(); 

    const key = document.getElementById("textKey").value;
    const value = document.getElementById("textMemo").value;

    if (key === "" || value === "") {
      window.alert("Key、Memoはいずれも必須です。");
      return;
    } else {
      localStorage.setItem(key, value);

      viewStorage();

      window.alert(`LocalStorageに ${key} : ${value} を保存しました`);

      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";
    }
  }, false);

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

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "radio1";
      td1.appendChild(radio);

      td2.textContent = w_key;
      td3.textContent = w_value;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);

      list.appendChild(tr);
    }
  }

  // ------------------------------------------------------
  // データ選択処理
  // ------------------------------------------------------
  function selectTable() {
    const select = document.getElementById("select");

    select.addEventListener("click", function (e) {
      e.preventDefault();

      const result = selectRadioBtn();

      if (result === "0") {
        window.alert("1つ選択（select）してください。");
        return false;
      }
    }, false);
  }

  // ------------------------------------------------------
  // データ選択チェック処理
  // ------------------------------------------------------
  function selectRadioBtn() {
    let w_sel = "0";

    const radio1 = document.getElementsByName("radio1");
    const table1 = document.getElementById("list");

    for (let i = 0; i < radio1.length; i++) {
      if (radio1[i].checked) {

        document.getElementById("textKey").value =
          table1.rows[i].cells[1].textContent;

        document.getElementById("textMemo").value =
          table1.rows[i].cells[2].textContent;

        return "1";
      }
    }
    return w_sel;
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
        window.alert("削除するデータを選んでください");
        return;
      }

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      localStorage.removeItem(key);

      window.alert(`LocalStoragから ${key} : ${value} を削除しました。`);

      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";

      viewStorage();
    }, false);
  }

}, false);