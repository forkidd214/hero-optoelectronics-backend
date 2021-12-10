"use strict";

/**
 *  navbar controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::navbar.navbar", ({ strapi }) => ({
  // Method 2: Wrapping a core action (leaves core logic in place)
  async find(ctx) {
    // some custom logic here
    ctx.query = {
      ...ctx.query,
      populate: [
        "logo",
        "navItems",
        "navItems.itemHead",
        "dynamicNavItems",
        "dynamicNavItems.navHead",
        "dynamicNavItems.subNavs",
        "dynamicNavItems.subNavs.link",
      ],
    };

    // Calling the default core action
    const res = await super.find(ctx);

    return res;
  },
}));

// //populate controller 1
// const schema = require("../content-types/navbar/schema.json");
// const {createPopulatedController} = require("../../../helpers/populate");
// module.exports = createPopulatedController("api::navbar.navbar", schema);

// //populate controller 2
// const { getFullPopulateObject } = require("../../../helpers/populate");
// const modelUid = "api::navbar.navbar";

// module.exports = createCoreController(modelUid, ({ strapi }) => ({
//   async find(ctx) {
//     const { query } = ctx;

//     const { results, meta } = await strapi.service(modelUid).find({
//       ...getFullPopulateObject(modelUid),
//       ...query,
//     });

//     const sanitizedEntities = await this.sanitizeOutput(results, ctx);

//     return {
//       data: sanitizedEntities,
//       meta,
//     };
//   },
// }));
