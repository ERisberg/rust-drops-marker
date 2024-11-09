import {
  STREAMER_DROPS_CONTAINER_ID,
  DROP_ID,
  GENERIC_DROPS_CONTAINER_ID,
} from "./constants";
import { StreamerDrop, GenericDrop, Streamer } from "./types";

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
    drops.push(drop);
  });

  console.log("🚀 ~ getStreamerDrops ~ drops:", drops);

  return drops;
}

export function getGenericDrops() {
  // Init return value
  const drops: GenericDrop[] = [];

  // Find all drop elements
  const genericDrops = $(`${GENERIC_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(genericDrops).each(function () {
    const drop = <GenericDrop>{};

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.domElement = this;
    drop.completed = false;

    drops.push(drop);
  });

  return drops;
}
