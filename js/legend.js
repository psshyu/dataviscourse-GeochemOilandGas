class Legend{

    constructor(defaultData, defaultFormation, colorScale){

        this.colorScale = colorScale;
        this.svg = d3.select("#legend")
                     .append("svg")
                     .attr("id", "legendSVG")
                     .attr("class", "plot")
                     .style("background-color", "#ffffff");
        this.data = defaultData[0];

    }
    update(wellsInFormation){
        console.log("JFC");
        console.log(wellsInFormation);
    }

}