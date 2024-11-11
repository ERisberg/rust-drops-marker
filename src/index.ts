/* globals jQuery, $, waitForKeyElements */

import { ICON_CHECKMARK } from "./constants";
import { injectMenu } from "./menu/menu";
import { Drop, StreamerDrop } from "./types";
import {
  clearCache,
  generateHashId,
  getGenericDrops,
  getStreamerDrops,
  loadProgress,
  saveProgress,
} from "./util";

let allDrops = [...getGenericDrops(), ...getStreamerDrops()];
const totalDropCount = allDrops.length;

// TODO: create uuid for each drop

function main() {
  injectMenu();
  injectCheckmarks();

  const saveData = loadProgress();
  if (saveData !== null) {
    initFromSaveData(saveData);
  }

  attachListeners();
  updateDropUI();
}

main();

function initFromSaveData(saveData: Drop[]) {
  // Create a mapping of `name` to `completed` from localStorageDrops
  const localStorageMap = new Map<string, boolean>();
  saveData.forEach((drop) => {
    localStorageMap.set(drop.uid, drop.completed);
  });

  // Update the `completed` field in onLoadDrops based on localStorage data
  allDrops = allDrops.map((drop) => {
    // If a matching name is found in localStorage, update `completed`
    const updatedCompleted = localStorageMap.get(drop.uid);

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
      const isStreamerDrop = $(this).find(".streamer-name").length > 0;
      let dropUID = "";

      if (isStreamerDrop) {
        const streamerNames: string[] = [];

        $(this)
          .find(".streamer-info")
          .each((_, val) => {
            const name = $(val).find(".streamer-name").text();
            if (name !== "") {
              streamerNames.push(name.toLowerCase());
            }
          });

        dropUID = generateHashId(dropName.toLowerCase(), ...streamerNames);
      } else {
        const watchTime = $(this).find(".drop-time > span").text();
        dropUID = generateHashId(
          dropName.toLowerCase(),
          watchTime.toLowerCase()
        );
      }

      const drop = allDrops.find((d) => d.uid === dropUID);

      if (drop === undefined) return;

      console.log(drop);

      drop.completed = !drop.completed;

      console.log(drop);

      markDrop(drop);

      saveProgress(allDrops);
    });
  }
}

function markDrop(drop: Drop) {
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

export function resetAll() {
  // allDrops.forEach((value) => {
  //   resetDrop(value);
  // });

  clearCache();
  window.location.reload();
}

export function openRemainingStreams(onlineOnly: boolean) {
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

function injectCheckmarks() {
  $(".drop-box-body").each(function () {
    $(this).append(ICON_CHECKMARK);
  });
}
