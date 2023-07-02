// ==UserScript==
// @name         redirection to AOJ 2.0
// @namespace    https://github.com/luckylat/UserScripts/edit/master/AOJ-RedirectToVersion2.user.js
// @version      0.2.1
// @description  AOJ2.0にリダイレクトするユーザースクリプト
// @author       CleyL
// @match        https://judge.u-aizu.ac.jp/onlinejudge/*
// @grant        none
// ==/UserScript==

const URL = location.href;
const reg = /[0-9]{4}/;
if(URL.match(reg)){
    const id = URL.match(reg)[0]
    location.replace("https://onlinejudge.u-aizu.ac.jp/challenges/search/volumes/" + id);
}else{
    // AOJ Course
    const reg2 = /id=[A-Z]{3,4}[1-2]{0,1}_[0-9]*_[A-Z]/;
    const courseId = 1; //TODO
    const courseName = "A" // TODO
    const id = URL.match(reg2)[0].substring(3);
    location.replace(`https://onlinejudge.u-aizu.ac.jp/courses/library/${courseId}/${courseName}/all/${id}`);
}
