/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */


let projection = d3.geoAlbers();

d3.select("#toggleButton").on("click", toggle);

function toggle(){
    d3.select("#screen1").style("display", "block");
    d3.select("#screen2").style("display", "none");
}

//pass well geospatial data (locations/coordinates) to map
    d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData => {
        //remove the plot
        d3.select("#tocBarchartSVG").remove();
        d3.select("#vanKrevelenPlotSVG").remove();
        d3.select("#potentialPlotSVG").remove();
        d3.select("#inverseKrevPlotSVG").remove();

        // remove formation list and legend
        d3.select("#legendSVG").remove();
        d3.select("#formationListUL").remove();
        
        //let formations_list = new formationList(colorScale);
        // let legend = new Legend(colorScale);
        let map = new Map(projection, geospatialData);
        let basin = new Basin(projection);
        map.update();
    });
//});
