import { resetAll, openRemainingStreams } from "..";
import { ICON_EXTERNAL } from "../constants";
import { clearCache } from "../util";
import { CONTAINER_STYLE, getStyleString } from "./menuStyle";

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
              <div class="container" style="${getStyleString(CONTAINER_STYLE)}">
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
                                  ${ICON_EXTERNAL}
                                  Open remaining (online)
                              </button>
  
                               <button id="${ID_BTN_OPENALT}" class="button twitch" style="align-self: auto; flex-grow: 1;">
                                  ${ICON_EXTERNAL}
                                  Open remaining (all)
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        `;

export function injectMenu() {
  const $hero = $(".hero");
  $hero.after(MENU);

  $("#" + ID_BTN_RESET).on("click", resetAll);
  $("#" + ID_BTN_CACHE).on("click", clearCache);
  $("#" + ID_BTN_OPEN).on("click", () => openRemainingStreams(true));
  $("#" + ID_BTN_OPENALT).on("click", () => openRemainingStreams(false));
}
