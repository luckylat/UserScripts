// ==UserScript==
// @name         LibraryChecker-CodeCopier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Library Checkerの提出画面のコードをコピーするボタンを追加します
// @author       CleyL
// @match        https://judge.yosupo.jp/submission/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yosupo.jp
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
        const CopyButton = document.createElement('button');
        CopyButton.addEventListener('click', () => {
            const code = document.querySelector('.monaco-editor').children[1].children[1].innerText; //ボタンを追加するため、直下のchildren elementの番号は1となる
            GM_setClipboard(code);
        })
        CopyButton.innerText = "Copy the code";
        CopyButton.className = "Mui"
        let editor = document.querySelector('.monaco-editor')
        // TODO: SPAなのでMutationObserverを使う
        const id = setInterval(() => {
            editor = document.querySelector('.monaco-editor')
            if(editor){
                editor.prepend(CopyButton);
                clearInterval(id);
            }
        }, 2000)
    })
})();
