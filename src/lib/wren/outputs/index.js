const _areas = require("./figures/areas");
const _estimates = require("./figures/estimates");
const _volumes = require("./figures/volumes");
const _dimensions = require("./figures/dimensions");

const _points = require("./points");
const _pieces = require("./pieces");

const m = x => [(x / 1000).toFixed(2), "m"];
const m2 = x => [(x / 1000000).toFixed(2), "m²"];
const m3 = x => [(x / 1000000000).toFixed(2), "m³"];
const basic = x => [x];
const days = x => [x, " days"];
// const gbp = x => ["£", x.toFixed(2).toLocaleString()];
const gbp = x => [
  x.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
];

const figures = (inputs, points) => {
  const dimensions = _dimensions(inputs, points);
  const areas = _areas(inputs, dimensions, points);
  const volumes = _volumes(inputs, dimensions, points, areas);
  const estimates = _estimates(inputs, areas, volumes);

  const metrics = {
    width: m(dimensions.external.width),
    height: m(dimensions.external.height),
    length: m(dimensions.external.length),

    footprint: m2(areas.external.footprint),
    // floorArea: m2(areas.internal.floor),
    // wallArea: basic("X"),
    // roofArea: basic("X"),
    // internalVolume: m3(volumes.internal.total),
    insulationVolume: m3(volumes.internal.insulation),
    // externalVolume: m3(volumes.external.total),
    bays: basic(inputs.dimensions.bays),
    "Sheets Required": basic(estimates.sheets),
    "CNC Time": days(estimates.daysRequiredToCNC)
  };

  const baseCostPerSqmm = 4 / 1000;
  const chassisTotal = estimates.sheets * 22.3 + estimates.sheets * 25.0;

  // console.log(inputs.dimensions.total)

  const costs = {
    chassisTotal: gbp(chassisTotal),
    // insulationTotal: gbp(insulationTotal),
    total: gbp(inputs.dimensions.total + chassisTotal)
    // inputs.total +
  };

  return {
    areas,
    dimensions,
    volumes,
    estimates,
    metrics,
    costs,
    total: inputs.dimensions.total
  };
};

exports.figures = figures;
exports.points = _points;
exports.pieces = _pieces;
