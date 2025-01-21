// ==UserScript==
// @name         巴哈姆特 Now!樣式修改
// @description  修改Now的樣式，讓他在網頁版從無法直視變得勉強可看
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.0.0
// @homepage     https://home.gamer.com.tw/profile/index_creation.php?owner=nathan60107&folder=425332
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://now.gamer.com.tw/chat_list.php*
// @icon         https://ani.gamer.com.tw/apple-touch-icon-144.jpg
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

GM_addStyle(`
  .now_chatroom-container .chatroom .msg_container {
    margin-top: 12px !important;
    margin-bottom: 12px !important;
  }
  .now_chatroom-container.is-bpage {
    height: 90vh !important;
  }
  div[class^="user-runes runes_lv"] {
    display: none !important;
  }
`);

async function retry(callback, count = 100) {
  if (count === 0) return null;

  const result = callback();
  if (result) return result;
  else {
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    return await retry(callback, count - 1);
  }
}

function action() {
  const elements = document.querySelectorAll("[data-uid]");

  for (let i = 0; i < elements.length - 1; i++) {
    const current = elements[i];
    const next = elements[i + 1];

    // 如果當前元素和下一個元素的 data-uid 相同
    if (current.dataset.uid === next.dataset.uid) {
      // 從下一個開始處理
      for (
        let j = i + 1;
        j < elements.length && elements[j].dataset.uid === current.dataset.uid;
        j++
      ) {
        // 尋找 j 之下的 .now_user-info 並設置 display: none
        const nowUserInfo = elements[j].querySelector(".now_user-info");
        if (nowUserInfo) {
          nowUserInfo.style.display = "none";
        }

        // 尋找 j 之下的 .user-headshot 並設置 visibility: hidden
        const userHeadshot = elements[j].querySelector(".user-headshot");
        if (userHeadshot) {
          userHeadshot.style.visibility = "hidden";
          userHeadshot.style.height = 0;
        }
      }
    }
  }
}

(async function () {
  await retry(() => {
    if (!document.querySelector(".msg_container")) return false;
    action();
    setInterval(action, 1500);
    return true;
  });
})();

/* Ref:
 * https://stackoverflow.com/a/19392142
 */
