/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */


let projection = d3.geoAlbers();

//color scale to be used across charts/legend
let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];
colorScale = d3.scaleQuantile();

//pass well geospatial data (locations/coordinates) to map
    d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData => {

        let formations_list = new Formations_list(colorScale);
        // let legend = new Legend(colorScale);
        let map = new Map(projection, geospatialData);
        let basin = new Basin(projection, formations_list);
        map.update();
    });
//});
