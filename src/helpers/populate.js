const { createCoreController } = require("@strapi/strapi").factories;

function populateAttribute({ components }) {
  if (components) {
    const populate = components.reduce((currentValue, current) => {
      return { ...currentValue, [current.split(".").pop()]: { populate: "*" } };
    }, {});
    return { populate };
  }
  return { populate: "*" };
}

const getPopulateFromSchema = function (schema) {
  return Object.keys(schema.attributes).reduce((currentValue, current) => {
    const attribute = schema.attributes[current];
    if (!["dynamiczone", "component"].includes(attribute.type)) {
      return currentValue;
    }
    return {
      ...currentValue,
      [current]: populateAttribute(attribute),
    };
  }, {});
};

function createPopulatedController(uid, schema) {
  return createCoreController(uid, () => {
    console.log(schema.collectionName, getPopulateFromSchema(schema));
    return {
      async find(ctx) {
        ctx.query = {
          ...ctx.query,
          populate: getPopulateFromSchema(schema),
        };
        return await super.find(ctx);
      },
      async findOne(ctx) {
        ctx.query = {
          ...ctx.query,
          populate: getPopulateFromSchema(schema),
        };
        return await super.findOne(ctx);
      },
    };
  });
}

//option 2
const getFullPopulateObject = (modelUid, maxDepth = 20) => {
  if (maxDepth <= 1) {
    return true;
  }
  if (modelUid === "admin::user") {
    return undefined;
  }

  const populate = {};
  const model = strapi.getModel(modelUid);
  for (const [key, value] of Object.entries(
    getModelPopulationAttributes(model)
  )) {
    if (value) {
      if (value.type === "component") {
        populate[key] = getFullPopulateObject(value.component, maxDepth - 1);
      } else if (value.type === "dynamiczone") {
        const dynamicPopulate = value.components.reduce((prev, cur) => {
          const curPopulate = getFullPopulateObject(cur, maxDepth - 1);
          return curPopulate === true ? prev : merge(prev, curPopulate);
        }, {});
        populate[key] = isEmpty(dynamicPopulate) ? true : dynamicPopulate;
      } else if (value.type === "relation") {
        const relationPopulate = getFullPopulateObject(
          value.target,
          maxDepth - 1
        );
        if (relationPopulate) {
          populate[key] = relationPopulate;
        }
      } else if (value.type === "media") {
        populate[key] = true;
      }
    }
  }
  return isEmpty(populate) ? true : { populate };
};

module.exports = { createPopulatedController, getFullPopulateObject };
