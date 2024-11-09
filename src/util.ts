import {
  STREAMER_DROPS_CONTAINER_ID,
  DROP_ID,
  GENERIC_DROPS_CONTAINER_ID,
} from "./constants";
import { StreamerDrop, GenericDrop } from "./types";

export function getStreamerDrops() {
  // Init return value
  const drops: StreamerDrop[] = [];

  // Find all drop elements
  const streamerDrops = $(`${STREAMER_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(streamerDrops).each(function () {
    const drop = <StreamerDrop>{};
    drop.streamerNames = [];
    drop.streamerLinks = [];

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.domElement = this;
    drop.completed = false;

    $(this)
      .find(".streamer-info")
      .each((_, val) => {
        const streamLink = $(val).attr("href");
        if (streamLink) {
          drop.streamerLinks.push(streamLink);
        }
      });

    $(this)
      .find(".streamer-name")
      .each((_, val) => {
        drop.streamerNames.push($(val).text());
      });

    drops.push(drop);
  });

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
