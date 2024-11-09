/* globals jQuery, $, waitForKeyElements */

import { GenericDrop, StreamerDrop } from "./types";
import { getGenericDrops, getStreamerDrops } from "./util";

let allDrops = [...getGenericDrops(), ...getStreamerDrops()];
const totalDropCount = allDrops.length;

const STORAGE_KEY = "ER_DROPS";

function main() {
  injectMenu();

  insertCheckmarks();

  attachListeners();

  initFromSaveData();

  updateDropUI();
}

main();

function initFromSaveData() {
  const saveData = loadProgress();
  if (saveData === null) {
    console.log("🚀 ~ initFromSaveData ~ saveData:", saveData);
    return;
  }

  // Create a mapping of `name` to `completed` from localStorageDrops
  const localStorageMap = new Map<string, boolean>();
  saveData.forEach((drop) => {
    localStorageMap.set(drop.name, drop.completed);
  });

  // Update the `completed` field in onLoadDrops based on localStorage data
  allDrops = allDrops.map((drop) => {
    // If a matching name is found in localStorage, update `completed`
    const updatedCompleted = localStorageMap.get(drop.name);

    return {
      ...drop, // Keep all other fields the same
      completed:
        updatedCompleted !== undefined ? updatedCompleted : drop.completed, // Override `completed` if found in localStorage
    };
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
      if (drop === undefined) return;

      console.log(drop);

      drop.completed = !drop.completed;

      console.log(drop);

      markDrop(drop);

      saveProgress();
    });
  }
}

function markDrop(drop: GenericDrop) {
  const checkmark = $(drop.domElement).find("#er_checkmark");
  const targetScale = drop.completed ? 1 : 0;
  $(checkmark).css({ transform: `scale(${targetScale})` });
  updateDropUI();
}

function resetDrop(drop: GenericDrop) {
  drop.completed = false;

  const link = $(drop.domElement);
  const checkmark = $(link).find("#er_checkmark");
  $(checkmark).css({ transform: `scale(0)` });

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
    } else {
      genericCount++;
      if (drop.completed) {
        completedGenericCount++;
      }
    }
  });

  $("#er_menu #er_dropcountgeneric").text(
    `${completedGenericCount} / ${genericCount}`
  );

  $("#er_menu #er_dropcountstreamer").text(
    `${completedStreamerCount} / ${streamerCount}`
  );

  $("#er_menu #er_dropcounttotal").text(
    `${completedStreamerCount + completedGenericCount} / ${totalDropCount}`
  );
}

function injectMenu() {
  const $hero = $(".hero");

  const html = `
        <div id="er_menu" class="section">
            <div class="container" style="padding: 1rem 0; display: flex; gap: 1rem; align-items: center; min-height: 200px; justify-content: stretch;">
                <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; flex-grow: 1;">
                    <div style="display: flex; flex-direction: column; gap: .4rem;">
                        <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                            <p style="flex-grow: 1; text-align: end;">Generic:</p>
                            <span id="er_dropcountgeneric" style="text-align: center;">x / x</span>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                            <p style="flex-grow: 1;  text-align: end;">Streamer:</p>
                            <span id="er_dropcountstreamer" style="text-align: center;">x / x</span>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: stretch; gap: 1rem;">
                            <p style="flex-grow: 1;  text-align: end;">All:</p>
                            <span id="er_dropcounttotal" style="text-align: center;">x / x</span>
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: .4rem; flex-grow: 1;">
                    <p>[Shift + Left click] To mark drop as completed</p>

                    <div style="display: flex; flex-direction: column; gap: .4rem;">
                        <div style="display: flex; gap: .4rem; align-items: center; justify-content: stretch; width: 100%">
                            <button id="er_reset" class="button is-primary" style="align-self: auto; flex-grow: 1;">Reset</button>
                            <button id="er_clearcache" class="button is-outline" style="align-self: auto; flex-grow: 1;">Clear cache</button>
                        </div>

                        <div style="display: flex; gap: .4rem; align-items: center; justify-content: stretch; width: 100%">
                            <button id="er_openstreams" class="button twitch" style="align-self: auto; flex-grow: 1;">
                                <span style="padding-right: .6rem; width: 32px; height: 32px; display: inline-block;">
                                    <?xml version="1.0" ?><svg fill="none" style="width:100%; height:100%;" height="24px" width="24px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="#efebe0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                                </span>
                                Open remaining (online)
                            </button>

                             <button id="er_openstreamsalt" class="button twitch" style="align-self: auto; flex-grow: 1;">
                                <span style="padding-right: .6rem; width: 32px; height: 32px; display: inline-block;">
                                    <?xml version="1.0" ?><svg fill="none" style="width:100%; height:100%;" height="24px" width="24px" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="#efebe0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                                </span>
                                Open remaining (all)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `;

  $hero.after(html);

  $("#er_reset").on("click", resetAll);
  $("#er_clearcache").on("click", clearCache);
  $("#er_openstreams").on("click", () => openRemainingStreams(true));
  $("#er_openstreamsalt").on("click", () => openRemainingStreams(false));
}

function resetAll() {
  allDrops.forEach((value) => {
    resetDrop(value);
  });

  clearCache();
}

function clearCache() {
  localStorage.removeItem(STORAGE_KEY);
}

function openRemainingStreams(onlineOnly: boolean) {
  let streamers = [];

  if (onlineOnly) {
    streamers = allDrops
      .filter(
        (drop): drop is StreamerDrop => "streamers" in drop && !drop.completed
      ) // Only StreamerDrops and not completed
      .flatMap((drop) => drop.streamers) // Flatten streamers arrays
      .filter((streamer) => streamer.online); // Filter only online streamers
  } else {
    streamers = allDrops
      .filter(
        (drop): drop is StreamerDrop => "streamers" in drop && !drop.completed
      ) // Only StreamerDrops that are not completed
      .flatMap((drop) => drop.streamers); // Flatten streamers arrays
  }

  if (streamers.length === 0) return;

  streamers.forEach((s) => {
    window.open(s.url, "_blank");
  });
}

function saveProgress() {
  const saveFriendly = allDrops.map((drop) => ({
    ...drop,
    domElement: null,
  }));

  console.log("🚀 ~ saveFriendly ~ saveFriendly:", saveFriendly);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveFriendly));
}

function loadProgress(): GenericDrop[] | null {
  const rawData = localStorage.getItem(STORAGE_KEY);
  return rawData === null
    ? null
    : JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
}

function checkMark() {
  return `
    <svg id="er_checkmark" style="z-index: 99; color: lime; transform: scale(0); transition: transform .2s ease;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clip-rule="evenodd"/>
    </svg>
  `;
}

function insertCheckmarks() {
  $(".drop-box-body").each(function () {
    $(this).append(checkMark());
  });
}
