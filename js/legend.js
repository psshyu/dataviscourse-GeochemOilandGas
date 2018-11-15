class Legend{

    constructor(defaultData, defaultFormation, colorScale){

        this.colorScale = colorScale;
        this.svg = d3.select("#legend")
                     .append("svg")
                     .attr("id", "legendSVG")
                     .attr("class", "plot")
                     .style("background-color", "#ffffff");

    }
    update(clickedBasinData){

     //draw the legend showing the formations present in the clicked basin.


    }

}