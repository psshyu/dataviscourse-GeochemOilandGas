// Scatter plot for OI vs HI
// upper right in reference image

class VanKrevelenPlot{

    constructor(tocChart){

        //Whenever a circle in this scatter plot is clicked, send the
        //  information of the formation to the tocChart
        this.tocChart = tocChart;

    }
    update(samples, colorScale){


        let margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        /*
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */

// setup x
        let xValue = function(d) { return d.Calories;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
        let yValue = function(d) { return d["Protein (g)"];}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
        let cValue = function(d) { return d.Manufacturer;},
            color = d3.scale.category10();

// add the graph canvas to the body of the webpage
        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

// load data
        d3.csv("cereal.csv", function(error, data) {

            // change string (from CSV) into number format
            data.forEach(function(d) {
                d.Calories = +d.Calories;
                d["Protein (g)"] = +d["Protein (g)"];
//    console.log(d);
            });

            // don't want dots overlapping axis, so add in buffer to data domain
            xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
            yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

            // x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Calories");

            // y-axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Protein (g)");

            // draw dots
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function(d) { return color(cValue(d));})
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                        + ", " + yValue(d) + ")")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on('click',clickhandler);

            function clickhandler (d,i) {

                this.tocChart.update(formation_data, colorScale);
            }


            // draw legend
            let legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            // draw legend text
            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d;})
        });



    }


}