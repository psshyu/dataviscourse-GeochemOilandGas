/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */


let projection = d3.geoAlbersUsa();

let tocChart = new TOC_barchart();
let vanKrevelenPlot = new VanKrevelenPlot();
let potentialPlot = new PotentialPlot();
let inverseKrevPlot = new InverseKrevelen();

d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData => {
    //pass well geospatial data (locations/coordinates) to map

    let map = new Map(projection, geospatialData, tocChart, vanKrevelenPlot, potentialPlot, inverseKrevPlot);
    map.update();
    let basin = new Basin(projection);

});
