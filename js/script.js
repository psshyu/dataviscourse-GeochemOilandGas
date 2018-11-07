/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */


let projection = d3.geoAlbersUsa();

//pass well geospatial data (locations/coordinates) to map
d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData => {

    let tocChart = new TOC_barchart();
    // console.log(tocChart);
    let vanKrevelenPlot = new VanKrevelenPlot();
    let potentialPlot = new PotentialPlot();
    let inverseKrevPlot = new InverseKrevelen();
    let map = new Map(projection, geospatialData, tocChart, vanKrevelenPlot, potentialPlot, inverseKrevPlot);
    let basin = new Basin(projection);
    map.update();
    //let basin = new Basin(projection);

});
