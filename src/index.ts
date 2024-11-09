/* globals jQuery, $, waitForKeyElements */

import {
  STREAMER_DROPS_CONTAINER_ID,
  DROP_ID,
  GENERIC_DROPS_CONTAINER_ID,
} from "./constants";

type GenericDrop = {
  name: string;
  watchTime: string;
  videoEl: HTMLVideoElement;
};

interface StreamerDrop extends GenericDrop {
  streamerNames: string[];
}

function main() {
  injectMenu();

  const genericDrops = getGenericDrops();

  console.log(genericDrops);

  for (let i = 0; i < genericDrops.length; i++) {
    const link = $(genericDrops[i].videoEl).closest("a");
    $(link).on("click", { value: genericDrops[i] }, (e) => {
      if (!e.shiftKey) {
        return;
      }

      e.preventDefault();

      console.log(e.data.value);
    });
  }

  //   $(genericDrops).each(function (_, value) {
  //     const link = $(value.videoEl).closest("a");
  //     $(link).on("click", { value: value }, (e) => {
  //       if (!e.shiftKey) {
  //         return;
  //       }

  //       e.preventDefault();

  //       console.log(e.data.value);
  //     });
  //   });

  // const streamerDrops = getStreamerDrops();
  // $(streamerDrops).each((_, value) => {
  //   const link = $(value.videoEl).closest("a");
  //   $(link).on("click", { value: value }, (e) => {
  //     e.preventDefault();

  //     console.log(e.data.value);
  //   });
  // });
}

main();

function injectMenu() {
  const $hero = $(".hero");

  const html = `
          <div class="section">
              <div class="container">
                  <button id="er_reset">Reset</button>
  
                  <p>[Shift + Left click] to mark drop as completed</p>
              </div>
          </div>
      `;

  $hero.after(html);
}

function getStreamerDrops() {
  // Init return value
  const drops: StreamerDrop[] = [];

  // Find all drop elements
  const streamerDrops = $(`${STREAMER_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(streamerDrops).each(function () {
    const drop = <StreamerDrop>{};
    drop.streamerNames = [];

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.videoEl = $(this).find("video")[0];

    $(this)
      .find(".streamer-name")
      .each((_, val) => {
        drop.streamerNames.push($(val).text());
      });

    drops.push(drop);
  });

  return drops;
}

function getGenericDrops() {
  // Init return value
  const drops: GenericDrop[] = [];

  // Find all drop elements
  const genericDrops = $(`${GENERIC_DROPS_CONTAINER_ID} ${DROP_ID}`);

  // Fill array
  $(genericDrops).each(function () {
    const drop = <GenericDrop>{};

    drop.name = $(this).find(".drop-type").text();
    drop.watchTime = $(this).find(".drop-time > span").text();
    drop.videoEl = $(this).find("video")[0];

    drops.push(drop);
  });

  return drops;
}
