/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */


let projection = d3.geoAlbers();
let height = window.innerHeight;

d3.select("#infoPanel")
    .style("height", height-56+"px")
    .style("width", "300px")
    .style("right", "0px")
    .style("top", "0px")
    .style("padding", "10px 10px 10px 10px")
    .style("position", "absolute")
    .style("z-index", 15)
    .style("background-color", d3.rgb(0,0,0,0.8))
    .style("border", "2px solid black")
    .style("display", "block")
    //.attr("id", "infoPanel")

d3.select("#backToMapButton").on("click", backToMap);
d3.select("#toggleInfoButton").on("click", toggleInfo);
console.log(d3.select("#infoPanel").style("display"));
function backToMap(){
    d3.select("#screen1").style("display", "block");
    d3.select("#screen2").style("display", "none");
}

function toggleInfo(){
    //d3.select("#infoPanel").style("display", "block");
    if(d3.select("#infoPanel").style("display") === 'block'){
        d3.select("#infoPanel").style("display", "none");
    }
    else{
        d3.select("#infoPanel").style("display", "block");
    }
    
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
    geospatialData = geospatialData.filter(d => projection([d.Longitude,d.Latitude])!==null || d.USGS_Province!==0);
        //filter wells falling outside of basin classification
    //geospatialData = geospatialData.filter(d => );
    let map = new Map(projection, geospatialData);
    let basin = new Basin(projection, geospatialData);
    
});
