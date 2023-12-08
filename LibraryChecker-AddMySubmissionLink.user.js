// ==UserScript==
// @name         LibraryChecker - Add MySubmission Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ヘッダーに自分の提出を表示するリンクを追加します
// @author       CleyL
// @match        https://judge.yosupo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yosupo.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const isLogin = () => {
        const header = document.querySelector('header');
        return [...header.children[0].children].filter((el) => el.tagName == 'BUTTON').length == 1;
    }
    const getUserName = () => {
        if(isLogin()){
            const header = document.querySelector('header');
            return [...header.children[0].children].filter((el) => el.tagName == 'BUTTON')[0].innerText;
        }else{
            return "tourist"; //lol because the sentence is unreachable;
        }
    }
    const addSubmissionLink = () => {
        const mySubmissionLink = document.createElement('a');
        const userName = getUserName();
        mySubmissionLink.href = `https://judge.yosupo.jp/submissions?user=${userName}`;
        mySubmissionLink.innerText = "MySubmissions"
        mySubmissionLink.classList.add("MuiButtonBase-root", "MuiButton-root", "MuiButton-text", "MuiButton-textInherit", "MuiButton-sizeMedium", "MuiButton-textSizeMedium", "MuiButton-colorInherit", "css-1l7gx4k")
        const headerElement = document.querySelector('header').children[0];
        const laterElement = headerElement.children[2];
        headerElement.insertBefore(mySubmissionLink, laterElement);
    }
    window.addEventListener('load', () => {
        if(isLogin()){
            addSubmissionLink();
        }
        const id = setInterval(() => {
            const userData = [...document.querySelector('header').children[0].children];
            if(userData.filter((el) => el.tagName == 'BUTTON').length){
                if(isLogin()){
                    clearInterval(id);
                    addSubmissionLink();
                }
            }
        }, 500)
    })
})();
