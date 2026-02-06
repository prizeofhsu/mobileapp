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

      if (result === "0") {
        window.alert("1つ選択(select)してください。");
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

      // A: 確認ダイアログの結果を変数にセット
      let w_confirm = confirm(`LocalStorageに ${key} ${value} を保存(save)しますか?`);

      // B: 確認ダイアログで「OK」を押されたとき、この処理を実行する
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
        window.alert("削除するデータを選んでください!");
        return;
      }

      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;

      // C: 確認ダイアログの結果を変数にセット
      let w_confirm = confirm(`LocalStorageから ${key} ${value} を削除(delete)しますか?`);

      // B: 確認ダイアログで「OK」を押されたとき、この処理を実行する
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