import {
  STREAMER_DROPS_CONTAINER_ID,
  DROP_ID,
  GENERIC_DROPS_CONTAINER_ID,
  STORAGE_KEY,
} from "./constants";
import { StreamerDrop, Drop, Streamer } from "./types";

export function getStreamerDrops() {
  // Init return value
  const drops: StreamerDrop[] = [];

  // Find all drop elements
  const streamerDrops = $(`${STREAMER_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(streamerDrops).each(function () {
    const drop = <StreamerDrop>{};
    drop.streamers = [];

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.domElement = this;
    drop.completed = false;

    $(this)
      .find(".streamer-info")
      .each((_, val) => {
        const streamer = <Streamer>{
          online: $(val).find(".online-status").length > 0,
          url: $(val).attr("href") ?? "",
          name: $(val).find(".streamer-name").text(),
        };

        drop.streamers.push(streamer);
      });

    drop.uid = generateHashId(
      drop.name.toLowerCase(),
      ...drop.streamers.map((streamer) => streamer.name.toLowerCase())
    );

    drops.push(drop);
  });

  console.log("🚀 ~ getStreamerDrops ~ drops:", drops);

  return drops;
}

export function generateHashId(...strings: string[]): string {
  const combinedString = strings.join("|"); // Combine strings with a separator
  let hash = 5381;

  for (let i = 0; i < combinedString.length; i++) {
    hash = (hash * 33) ^ combinedString.charCodeAt(i);
  }

  // Convert to a positive 32-bit integer and then to a string
  return (hash >>> 0).toString(16);
}

export function getGenericDrops() {
  // Init return value
  const drops: Drop[] = [];

  // Find all drop elements
  const genericDrops = $(`${GENERIC_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(genericDrops).each(function () {
    const drop = <Drop>{};

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.domElement = this;
    drop.completed = false;
    drop.uid = generateHashId(
      drop.name.toLowerCase(),
      drop.watchTime.toLowerCase()
    );

    drops.push(drop);
  });

  return drops;
}

export function saveProgress(data: Drop[]) {
  const saveFriendly = data.map((drop) => ({
    ...drop,
    domElement: null,
  }));

  console.log("🚀 ~ saveFriendly ~ saveFriendly:", saveFriendly);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveFriendly));
}

export function clearCache() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadProgress(): Drop[] | null {
  const rawData = localStorage.getItem(STORAGE_KEY);
  return rawData === null
    ? null
    : JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
}
