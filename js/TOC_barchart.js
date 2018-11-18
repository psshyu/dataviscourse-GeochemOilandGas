//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor(defaultData, defaultFormation, colorScale) {

        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.colorScale = colorScale;

        // this.svg = d3.select("#tocBarchart")
        //              .append("svg")
        //              .attr("id", "tocBarchartSVG")
        //              .attr("class", "plot")
        //              .style("background-color", "#ffffff");




        // this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        // this.width = 500;
        // this.height = 500;
        //
        // let xScale = d3.scaleLinear()
        //     .domain([0, 4])
        //     .range([this.margin.left, this.width-this.margin.right]);
        //
        // let yScale = d3.scaleLinear()
        //     .domain([1, 0])
        //     .range([this.margin.bottom, this.height-this.margin.top]);
        //
        //
        // this.svg = d3.select("#tocBarchart")
        //     .append("svg")
        //     .attr("width", this.width)
        //     .attr("height", this.height)
        //     .append("g")
        //     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        //
        // let xAxis = d3.axisBottom(xScale);
        //
        // this.svg.append("g")
        //     .call(xAxis);
        // let yAxis = d3.axisLeft(yScale);
        // this.svg.append("g")
        //     .call(yAxis);

    }


    update(data) {

        console.log(data)


    }
}