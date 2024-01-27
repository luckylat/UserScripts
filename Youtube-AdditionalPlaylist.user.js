// ==UserScript==
// @name         Youtube Additional Playlist
// @namespace    https://github.com/luckylat/UserScripts/blob/master/Youtube-AdditionalPlaylist.user.js
// @version      0.2.2.2
// @description  add (un)read property whether it is in youur video history or not.
// @author       CleyL
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==




(function() {
    'use strict';
    const playlistUrl = 'https://www.youtube.com/playlist?list='

    const getPlaylist = () => {
        return new Promise(async (resolve, reject) => {
            const playlist = await new Promise(async (resolve,reject) => {
                const pid = setInterval(() => {
                    const playlistBrowser = document.querySelector("ytd-two-column-browse-results-renderer")

                    const pl = playlistBrowser.children[0].children[0].children[1]
                    if(pl){
                        clearInterval(pid)
                        resolve(pl)
                    }
                }, 1500)
            })
            return resolve(playlist)
        })
    }

    const checkReadStatus = (movieId) => {
        const playlistData = window.localStorage.getItem("ReadPlaylistId")
        if(playlistData){
            const parsedPlaylistData = JSON.parse(playlistData)
            return parsedPlaylistData[movieId]
        }else{
            return false
        }
    }

    const changeReadStatus = (movieId, readButton) => {
        const playlistData = window.localStorage.getItem("ReadPlaylistId")
        let modifiedPlaylistData = {}
        if(playlistData){
            const parsedPlaylistData = JSON.parse(playlistData)
            parsedPlaylistData[movieId] = parsedPlaylistData[movieId] ? false : true
            modifiedPlaylistData = parsedPlaylistData

        }else{
            modifiedPlaylistData[movieId] = true
        }
        window.localStorage.setItem('ReadPlaylistId', JSON.stringify(modifiedPlaylistData))
    }

    const addButton = async (videoElement) => {
        const movieIdRegex = /\?v=[0-9a-zA-Z-_]*/
        const meta = videoElement.children[1].children[0].children[1].children[0]
        const movieLink = videoElement.children[1].children[0].children[0].children[0].href
        const movieId = movieLink.match(movieIdRegex)[0].substring(3)
        const readStatus = await checkReadStatus(movieId)
        // add button
        const readButton = document.createElement('button')
        readButton.classList.add('read-status-button')
        readButton.innerText = readStatus ? "Change to Unwatched" : "Change to Watched"
        readButton.addEventListener('click', () => {
            changeReadStatus(movieId,readButton)
            readButton.innerText = readButton.innerText === "Change to Watched" ? "Change to Unwatched" : "Change to Watched"
        })
        meta.append(readButton)
    }

    // execute in playlist without playlist toppage
    const core = async () => {
        const withinPlaylist = await getPlaylist()
        const playlist = withinPlaylist.children[0].children[2].children[0].children[2]

        Array.prototype.forEach.call(playlist.children, async (el) => {
            addButton(el)
        })
    }

    const deleteButton = async () => {
        const readButtons = document.querySelectorAll('.read-status-button')
        Array.prototype.forEach.call(readButtons, async (el) => {
            el.remove()
        })
    }

    // observe URL
    let lastUrl = location.href
    new MutationObserver((el) => {
        const url = location.href
        if (url !== lastUrl) {
            lastUrl = url
            deleteButton()
            if(url.startsWith(playlistUrl)){
                core()
            }
        }else if(url !== undefined && url.startsWith(playlistUrl)){
            const addedVideo = el.filter((mutationRecord) => mutationRecord.target.id && mutationRecord.target.id.startsWith('contents') && mutationRecord.removedNodes.length === 0)
            if(addedVideo.length){
                Array.prototype.forEach.call(addedVideo[0].addedNodes, async (el) => {
                    addButton(el)
                })
            }
        }
    }).observe(document, {subtree: true, childList: true})

    if(location.href.startsWith(playlistUrl))core()
})();
