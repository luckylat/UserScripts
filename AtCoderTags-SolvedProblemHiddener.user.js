// ==UserScript==
// @name         AtCoderTags-SolvedProblemHiddener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AtCoderTagsで灰色に表示される既に解いた問題を非表示にします
// @author       luckYrat
// @match        https://atcoder-tags.herokuapp.com/tag_search/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const Problems = document.querySelectorAll(".table-borderd")[0].querySelectorAll("tbody");
    const SolvedProblems = [...Problems].filter((element) => {
        const x = element.querySelector("tr").querySelector("td");
        if (x.style.backgroundColor[0] === 'r'){
            element.style.display = "None";
        }
    })
})();
