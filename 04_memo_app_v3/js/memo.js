"use strict";

// ページ全体が読み込まれたタイミングで実行する
window.addEventListener("DOMContentLoaded", function () {

  // localStorageが使えるか確認
  if (typeof localStorage === "undefined") {
    Swal.fire({
      icon: "error",
      title: "Memo app",
      text: "このブラウザはLocal Storage機能が実装されていません",
    });
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

      // E: 関数「selectCheckBox」に引数をセットする
      const result = selectCheckBox("select");
    }, false);
  }

  // ------------------------------------------------------
  // データ選択チェック処理
  // ------------------------------------------------------
  function selectCheckBox(mode) {
    let w_cnt = 0;
    let w_textKey = "";
    let w_textMemo = "";

    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("list");

    for (let i = 0; i < chkbox1.length; i++) {
      if (chkbox1[i].checked) {
        w_cnt++;

        // 最初にチェックされている行の値を取得
        if (w_cnt === 1) {
          w_textKey = table1.rows[i].cells[1].textContent;
          w_textMemo = table1.rows[i].cells[2].textContent;
          
          document.getElementById("textKey").value = w_textKey;
          document.getElementById("textMemo").value = w_textMemo;
        }
      }
    }

    // F: この関数「selectCheckBox」の引数(mode)が"select"の場合
    if (mode === "select") {
      // チェックボックスがチェックされている行が１つの場合
      if (w_cnt === 1) {
        return w_cnt;
      }

      // チェックボックスがチェックされている行が１つではない場合
      if (w_cnt !== 1) {
        Swal.fire({
          icon: "warning",
          title: "Memo app",
          text: "1つ選択(select)してください。",
        });
      }
    }

    // G: この関数「selectCheckBox」の引数(mode)が"del"の場合
    if (mode === "del") {
      // チェックボックスがチェックされている行が１つ以上の場合
      if (w_cnt >= 1) {
        return w_cnt;
      }

      // チェックボックスがチェックされている行が１つ以上ではない場合
      if (w_cnt < 1) {
        Swal.fire({
          icon: "warning",
          title: "Memo app",
          text: "1つ以上選択(select)してください。",
        });
      }
    }

    return w_cnt;
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
        Swal.fire({
          icon: "error",
          title: "Memo app",
          text: "Key、Memoはいずれも必須です。",
        });
        return;
      }

      Swal.fire({
        title: "Memo app",
        text: `LocalStorageに ${key} ${value} を 保存 (save) しますか?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.value) {
          localStorage.setItem(key, value);
          viewStorage();
          
          Swal.fire({
            icon: "success",
            title: "Memo app",
            text: `LocalStorageに ${key} ${value} を 保存(ほぞん) しました。`,
          });
          
          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";
        }
      });
    }, false);
  }

  // ------------------------------------------------------
  // localStorage から1件削除する処理
  // ------------------------------------------------------
  function delLocalStorage() {
    const del = document.getElementById("del");

    del.addEventListener("click", function (e) {
      e.preventDefault();

      // A: 関数「selectCheckBox」に引数をセットする
      let w_cnt = selectCheckBox("del");

      if (w_cnt < 1) {
        return;
      }

      // B: 確認メッセージの内容を変える（選択されているチェックボックスの件数を表示）
      Swal.fire({
        title: "Memo app",
        text: `LocalStorageから選択されている ${w_cnt} 件を削除 (delete) しますか?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.value) {
          const chkbox1 = document.getElementsByName("chkbox1");
          const table1 = document.getElementById("list");

          // C: for文の定義
          for (let i = chkbox1.length - 1; i >= 0; i--) {
            if (chkbox1[i].checked) {
              const key = table1.rows[i].cells[1].textContent;
              localStorage.removeItem(key);
            }
          }

          // D: 警告ダイアログ（選択されているチェックボックスの件数を表示）
          Swal.fire({
            icon: "success",
            title: "Memo app",
            text: `LocalStorageから${w_cnt}件を削除 (delete) しました。`,
          });

          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";

          viewStorage();
        }
      });
    }, false);
  }

  // ------------------------------------------------------
  // localStorage のデータを全削除する処理
  // ------------------------------------------------------
  function allClearLocalStorage() {
    const allClear = document.getElementById("allclear");

    allClear.addEventListener("click", function (e) {
      e.preventDefault();

      Swal.fire({
        title: "Memo app",
        text: "LocalStorageのデータをすべて削除します。よろしいですか？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.value) {
          localStorage.clear();

          Swal.fire({
            icon: "success",
            title: "Memo app",
            text: "LocalStorageのデータをすべて削除しました。",
          });

          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";

          viewStorage();
        }
      });
    }, false);
  }

}, false);