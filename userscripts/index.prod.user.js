// ==UserScript==
// @name rust-drops-marker
// @version 0.0.2
// @namespace http://tampermonkey.net/
// @description Marker rust twitch drops as completed
// @author erisberg
// @homepage https://github.com/ERisberg/rust-drops-marker#readme
// @updateURL https://github.com/ERisberg/rust-drops-marker/raw/refs/heads/main/userscripts/index.prod.user.js
// @downloadURL https://github.com/ERisberg/rust-drops-marker/raw/refs/heads/main/userscripts/index.prod.user.js
// @license https://opensource.org/licenses/MIT
// @match https://twitch.facepunch.com/
// @require https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 484:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICON_EXTERNAL = exports.ICON_CHECKMARK = exports.STORAGE_KEY = exports.DROP_LOCK_ID = exports.DROP_ID = exports.STREAMER_DROPS_CONTAINER_ID = exports.GENERIC_DROPS_CONTAINER_ID = void 0;
exports.GENERIC_DROPS_CONTAINER_ID = "#drops";
exports.STREAMER_DROPS_CONTAINER_ID = ".streamer-drops";
exports.DROP_ID = ".drop-box";
exports.DROP_LOCK_ID = ".drop-lock";
exports.STORAGE_KEY = "ER_DROPS";
exports.ICON_CHECKMARK = `
    <svg id="er_checkmark" style="z-index: 99; color: lime; transform: scale(0); transition: transform .2s ease;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clip-rule="evenodd"/>
    </svg>`;
exports.ICON_EXTERNAL = `
    <span style="padding-right: .6rem; width: 32px; height: 32px; display: inline-block;">
        <?xml version="1.0" ?><svg fill="none" style="width:100%; height:100%;" height="24px" width="24px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="#efebe0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
    </span>
`;


/***/ }),

/***/ 813:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetAll = resetAll;
exports.openRemainingStreams = openRemainingStreams;
const constants_1 = __webpack_require__(484);
const menu_1 = __webpack_require__(950);
const util_1 = __webpack_require__(125);
let allDrops = [...(0, util_1.getGenericDrops)(), ...(0, util_1.getStreamerDrops)()];
const totalDropCount = allDrops.length;
function main() {
    (0, menu_1.injectMenu)();
    injectCheckmarks();
    const saveData = (0, util_1.loadProgress)();
    if (saveData !== null) {
        initFromSaveData(saveData);
    }
    attachListeners();
    updateDropUI();
}
main();
function initFromSaveData(saveData) {
    const localStorageMap = new Map();
    saveData.forEach((drop) => {
        localStorageMap.set(drop.name, drop.completed);
    });
    allDrops = allDrops.map((drop) => {
        const updatedCompleted = localStorageMap.get(drop.name);
        return Object.assign(Object.assign({}, drop), { completed: updatedCompleted !== undefined ? updatedCompleted : drop.completed });
    });
    console.log("🚀 ~ initFromSaveData ~ allDrops:", allDrops);
    allDrops.forEach((drop) => markDrop(drop));
}
function attachListeners() {
    for (let i = 0; i < allDrops.length; i++) {
        const link = $(allDrops[i].domElement);
        $(link).on("click", function (e) {
            if (!e.shiftKey) {
                return;
            }
            e.preventDefault();
            const dropName = $(this).find(".drop-type").text();
            const drop = allDrops.find((d) => d.name === dropName);
            if (drop === undefined)
                return;
            console.log(drop);
            drop.completed = !drop.completed;
            console.log(drop);
            markDrop(drop);
            (0, util_1.saveProgress)(allDrops);
        });
    }
}
function markDrop(drop) {
    const checkmark = $(drop.domElement).find("#er_checkmark");
    const targetScale = drop.completed ? 1 : 0;
    $(checkmark).css({ transform: `scale(${targetScale})` });
    updateDropUI();
}
function updateDropUI() {
    let streamerCount = 0;
    let genericCount = 0;
    let completedStreamerCount = 0;
    let completedGenericCount = 0;
    allDrops.forEach((drop) => {
        if ("streamers" in drop) {
            streamerCount++;
            if (drop.completed) {
                completedStreamerCount++;
            }
        }
        else {
            genericCount++;
            if (drop.completed) {
                completedGenericCount++;
            }
        }
    });
    $("#er_menu #er_dropcountgeneric").text(`${completedGenericCount} / ${genericCount}`);
    $("#er_menu #er_dropcountstreamer").text(`${completedStreamerCount} / ${streamerCount}`);
    $("#er_menu #er_dropcounttotal").text(`${completedStreamerCount + completedGenericCount} / ${totalDropCount}`);
}
function resetAll() {
    (0, util_1.clearCache)();
    window.location.reload();
}
function openRemainingStreams(onlineOnly) {
    let streamers = [];
    if (onlineOnly) {
        streamers = allDrops
            .filter((drop) => "streamers" in drop && !drop.completed)
            .flatMap((drop) => drop.streamers)
            .filter((streamer) => streamer.online);
    }
    else {
        streamers = allDrops
            .filter((drop) => "streamers" in drop && !drop.completed)
            .flatMap((drop) => drop.streamers);
    }
    if (streamers.length === 0)
        return;
    streamers.forEach((s) => {
        window.open(s.url, "_blank");
    });
}
function injectCheckmarks() {
    $(".drop-box-body").each(function () {
        $(this).append(constants_1.ICON_CHECKMARK);
    });
}


/***/ }),

/***/ 950:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.injectMenu = injectMenu;
const __1 = __webpack_require__(813);
const constants_1 = __webpack_require__(484);
const util_1 = __webpack_require__(125);
const menuStyle_1 = __webpack_require__(441);
const ID_MENU = "er_menu";
const ID_TXT_DROPS_GENERIC = "er_dropcountgeneric";
const ID_TXT_DROPS_STREAMER = "er_dropcountstreamer";
const ID_TXT_DROPS_TOTAL = "er_dropcounttotal";
const ID_BTN_RESET = "er_reset";
const ID_BTN_CACHE = "er_clearcache";
const ID_BTN_OPEN = "er_openstreams";
const ID_BTN_OPENALT = "er_openstreamsalt";
const MENU = `
          <div id="${ID_MENU}" class="section">
              <div class="container" style="${(0, menuStyle_1.getStyleString)(menuStyle_1.CONTAINER_STYLE)}">
                  <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; flex-grow: 1;">
                      <div style="display: flex; flex-direction: column; gap: .4rem;">
                          <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                              <p style="flex-grow: 1; text-align: end;">Generic:</p>
                              <span id="${ID_TXT_DROPS_GENERIC}" style="text-align: center;">x / x</span>
                          </div>
  
                          <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                              <p style="flex-grow: 1;  text-align: end;">Streamer:</p>
                              <span id="${ID_TXT_DROPS_STREAMER}" style="text-align: center;">x / x</span>
                          </div>
  
                          <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                              <p style="flex-grow: 1;  text-align: end;">All:</p>
                              <span id="${ID_TXT_DROPS_TOTAL}" style="text-align: center;">x / x</span>
                          </div>
                      </div>
                  </div>
  
                  <div style="display: flex; flex-direction: column; gap: .4rem; flex-grow: 1;">
                      <p>[Shift + Left click] To mark drop as completed</p>
  
                      <div style="display: flex; flex-direction: column; gap: .4rem;">
                          <div style="display: flex; gap: .4rem; align-items: center; justify-content: stretch; width: 100%">
                              <button id="${ID_BTN_RESET}" class="button is-primary" style="align-self: auto; flex-grow: 1;">Reset</button>
                              <button id="${ID_BTN_CACHE}" class="button is-outline" style="align-self: auto; flex-grow: 1;">Clear cache</button>
                          </div>
  
                          <div style="display: flex; gap: .4rem; align-items: center; justify-content: stretch; width: 100%">
                              <button id="${ID_BTN_OPEN}" class="button twitch" style="align-self: auto; flex-grow: 1;">
                                  ${constants_1.ICON_EXTERNAL}
                                  Open remaining (online)
                              </button>
  
                               <button id="${ID_BTN_OPENALT}" class="button twitch" style="align-self: auto; flex-grow: 1;">
                                  ${constants_1.ICON_EXTERNAL}
                                  Open remaining (all)
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        `;
function injectMenu() {
    const $hero = $(".hero");
    $hero.after(MENU);
    $("#" + ID_BTN_RESET).on("click", __1.resetAll);
    $("#" + ID_BTN_CACHE).on("click", util_1.clearCache);
    $("#" + ID_BTN_OPEN).on("click", () => (0, __1.openRemainingStreams)(true));
    $("#" + ID_BTN_OPENALT).on("click", () => (0, __1.openRemainingStreams)(false));
}


/***/ }),

/***/ 441:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONTAINER_STYLE = void 0;
exports.getStyleString = getStyleString;
exports.CONTAINER_STYLE = {
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    minHeight: "200px",
    justifyContent: "stretch",
};
function getStyleString(style) {
    return Object.entries(style)
        .map(([k, v]) => {
        const newString = k
            .split(/(?=[A-Z])/)
            .join("-")
            .toLowerCase();
        return `${newString}:${v}`;
    })
        .join(";");
}


/***/ }),

/***/ 125:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStreamerDrops = getStreamerDrops;
exports.getGenericDrops = getGenericDrops;
exports.saveProgress = saveProgress;
exports.clearCache = clearCache;
exports.loadProgress = loadProgress;
const constants_1 = __webpack_require__(484);
function getStreamerDrops() {
    const drops = [];
    const streamerDrops = $(`${constants_1.STREAMER_DROPS_CONTAINER_ID} ${constants_1.DROP_ID}`);
    $(streamerDrops).each(function () {
        const drop = {};
        drop.streamers = [];
        drop.name = $(this).find(".drop-type").text();
        drop.watchTime = $(this).find(".drop-time > span").text();
        drop.domElement = this;
        drop.completed = false;
        $(this)
            .find(".streamer-info")
            .each((_, val) => {
            var _a;
            const streamer = {
                online: $(val).find(".online-status").length > 0,
                url: (_a = $(val).attr("href")) !== null && _a !== void 0 ? _a : "",
                name: $(val).find(".streamer-name").text(),
            };
            drop.streamers.push(streamer);
        });
        drops.push(drop);
    });
    console.log("🚀 ~ getStreamerDrops ~ drops:", drops);
    return drops;
}
function getGenericDrops() {
    const drops = [];
    const genericDrops = $(`${constants_1.GENERIC_DROPS_CONTAINER_ID} ${constants_1.DROP_ID}`);
    $(genericDrops).each(function () {
        const drop = {};
        drop.name = $(this).find(".drop-type").text();
        drop.watchTime = $(this).find(".drop-time > span").text();
        drop.domElement = this;
        drop.completed = false;
        drops.push(drop);
    });
    return drops;
}
function saveProgress(data) {
    const saveFriendly = data.map((drop) => (Object.assign(Object.assign({}, drop), { domElement: null })));
    console.log("🚀 ~ saveFriendly ~ saveFriendly:", saveFriendly);
    localStorage.setItem(constants_1.STORAGE_KEY, JSON.stringify(saveFriendly));
}
function clearCache() {
    localStorage.removeItem(constants_1.STORAGE_KEY);
}
function loadProgress() {
    const rawData = localStorage.getItem(constants_1.STORAGE_KEY);
    return rawData === null
        ? null
        : JSON.parse(localStorage.getItem(constants_1.STORAGE_KEY));
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(813);
/******/ 	
/******/ })()
;