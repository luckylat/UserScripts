// ==UserScript==
// @name         yukicoder unsolved filter
// @namespace    https://github.com/luckylat/UserScripts/blob/master/yukicoder-SolvedFilter.user.js
// @version      0.1.3
// @description  yukicoderの提出ページで解いている問題を非表示にします
// @author       CleyL
// @match        https://yukicoder.me/submissions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yukicoder.me
// @grant        GM_xmlhttpRequest
// @connect      https://yukicoder.me/api/v1/*
// ==/UserScript==

(function() {
    'use strict';
    const isLogin = () => {
        const userMenu = document.querySelector('#usermenu-btn');
        if(!userMenu)return false;
        return true;
    }
    const getMyId = () => {
        const userMenu = document.querySelector('#usermenu-btn');
        if(!userMenu)return;
        const reg = new RegExp("[0-9]*$");
        const userId = reg.exec(userMenu);
        return userId;
    }
    //自分の解いている問題一覧を取得して、localstrageに保存する
    const fetchMySolvedData = async (userId) => {
        //'https://yukicoder.me/api/v1/solved/id/6894'
        const fetchURL = "https://yukicoder.me/api/v1/solved/id/" + userId
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GeT',
                url: fetchURL,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: ((response) => {
                    const idReg = new RegExp('\"No\"\:[0-9]*', 'g');
                    const numReg = new RegExp('[0-9]+');
                    const lawproblems = [...response.responseText.matchAll(idReg)];
                    const problemSet = new Set();
                    lawproblems.forEach((element) => {
                        problemSet.add(numReg.exec(element[0])[0])
                    })
                    resolve(problemSet);
                })
            })
        })

    }



    //提出されている問題一覧をフィルターする
    const filterProblemList = (problemSet) => {
        const problemIdReg = new RegExp("^No.[0-9]+");
        const numReg = new RegExp('[0-9]+');
        const problems = document.querySelector('#content').children[1].children[0].children[1];
        [...problems.children].forEach((problem) => {
            const problemId = problemIdReg.exec(problem.children[4].innerText);
            const problemNum = numReg.exec(problemId)[0];
            //9000番台も非表示にする
            if(problemSet.has(problemNum) || problemNum[0] == '9'){
                problem.remove();
            }
        })


    }

    //フィルターを掛ける
    const excludeSolvedProblems = () => {

    }

    //DOMにチェックリストを追加する(localStorageで管理)

    //読み込み時
    window.addEventListener('load', async () => {
        if(isLogin()){
            const id = getMyId();
            const solvedData = await fetchMySolvedData(id);
            filterProblemList(solvedData);
        }

    })

})();
