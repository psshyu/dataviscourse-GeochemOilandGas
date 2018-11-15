// Scatter plot for TOC vs S1+S2 parameters
// Lower left in reference image

class PotentialPlot{

    constructor(defaultData, defaultFormation, colorScale){
        this.svg = d3.select("#potentialPlot")
                     .append("svg")
                     .attr("id", "potentialPlotSVG")
                     .attr("class", "plot")
                     .style("background-color", "#ffffff");
    }
    update(samples, colorScale){
        /*
                *TODO:
                * */

    }
}