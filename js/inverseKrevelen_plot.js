//Scatter plot for Tmax vs. HI
//Lower right in reference image

class InverseKrevelen{

    constructor(defaultData, defaultFormation, colorScale){
        //console.log("inverse krev plot instantiating...", defaultFormation);
        this.svg = d3.select("#inverseKrevPlot")
                     .append("svg")
                     .attr("id", "inverseKrevePlotSVG")
                     .attr("class", "plot")
                     .style("background-color", "#ffffff");
    }
    update(samples, colorScale){
        /*
                *TODO:
                * */

    }
}