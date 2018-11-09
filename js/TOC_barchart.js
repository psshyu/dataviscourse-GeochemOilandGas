//barchart for TOC data 
//upper left image in reference

class TOC_barchart{

    constructor(){


    }

    update(samples, colorScale){

        /*
         * TODO:
         */

        var margin = {top: 20, right: 160, bottom: 35, left: 30};

        var width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#tocBarchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        /* Data in strings like it would be if imported from a csv */
        // formations in horizontal
        //bins in vertical

        var data = [
            { bin: "2006", f1: "10", f2: "15", oranges: "9", pears: "6" , form20:'12'},
            { bin: "2007", f1: "12", f2: "18", oranges: "9", pears: "4" ,form20:'12'},
            { bin: "2008", f1: "05", f2: "20", oranges: "8", pears: "2" ,form20:'12'},
            { bin: "2009", f1: "01", f2: "15", oranges: "5", pears: "4" ,form20:'12'},
            { bin: "2010", f1: "02", f2: "10", oranges: "4", pears: "2" ,form20:'12'},
            { bin: "2011", f1: "03", f2: "12", oranges: "6", pears: "3" ,form20:'12'},
            { bin: "2012", f1: "04", f2: "15", oranges: "8", pears: "1" ,form20:'12'},
            { bin: "2013", f1: "06", f2: "11", oranges: "9", pears: "4" ,form20:'12'},
            { bin: "2014", f1: "10", f2: "13", oranges: "9", pears: "5" ,form20:'12'},
            { bin: "2015", f1: "16", f2: "19", oranges: "6", pears: "9" ,form20:'12'},
            { bin: "2016", f1: "19", f2: "17", oranges: "5", pears: "7" ,form20:'12'},
            { bin: "2017", f1: "14", f2: "16", oranges: "4", pears: "7" ,form20:'12'},
            { bin: "2018", f1: "14", f2: "16", oranges: "4", pears: "7" ,form20:'12'},
            { bin: "2019", f1: "14", f2: "16", oranges: "4", pears: "7" ,form20:'12'},
            { bin: "2020", f1: "14", f2: "16", oranges: "4", pears: "7" ,form20:'12'},
            { bin: "2021", f1: "14", f2: "16", oranges: "4", pears: "7" ,form20:'12'}
        ];

        // var parse = d3.time.format("%Y").parse;


// Transpose the data into layers
        var dataset = d3.layout.stack()(["f1", "f2", "oranges", "pears",'form20'].map(function(fruit) {
            return data.map(function(d) {
                return {x: d.bin, y: +d[fruit]};
            });
        }));

        console.log(dataset);


// Set x, y and colors
        var x = d3.scale.ordinal()
            .domain(dataset[0].map(function(d) { return d.x; }))
            .rangeRoundBands([10, width-10], 0.02);

        var y = d3.scale.linear()
            .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
            .range([height, 0]);

        var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574","#d25c4d"];


// // Define and draw axes
//         var yAxis = d3.svg.axis()
//             .scale(y)
//             .orient("left")
//             .ticks(5)
//             .tickSize(-width, 0, 0)
//             .tickFormat( function(d) { return d } );
//
//         var xAxis = d3.svg.axis()
//             .scale(x)
//             .orient("bottom")
//             .tickFormat(d3.time.format("%Y"));
//
//         svg.append("g")
//             .attr("class", "y axis")
//             .call(yAxis);
//
//         svg.append("g")
//             .attr("class", "x axis")
//             .attr("transform", "translate(0," + height + ")")
//             .call(xAxis);


// Create groups for each series, rects for each segment
        var groups = svg.selectAll("g.cost")
            .data(dataset)
            .enter().append("g")
            .attr("class", "cost")
            .style("fill", function(d, i) { return colors[i]; });

        var rect = groups.selectAll("rect")
            .data(function(d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y0 + d.y); })
            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
            .attr("width", x.rangeBand())
            .attr('stroke','black');
            // .on("mouseover", function() { tooltip.style("display", null); })
            // .on("mouseout", function() { tooltip.style("display", "none"); })
            // .on("mousemove", function(d) {
            //     var xPosition = d3.mouse(this)[0] - 15;
            //     var yPosition = d3.mouse(this)[1] - 25;
            //     tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            //     tooltip.select("text").text(d.y);
            // });


// Draw legend
        var legend = svg.selectAll(".legend")
            .data(colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {return colors.slice().reverse()[i];});

        legend.append("text")
            .attr("x", width + 5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) {
                switch (i) {
                    case 0: return "Formation1";
                    case 1: return "Formation2";
                    case 2: return "Formation3";
                    case 3: return "Formation4";
                    case 4: return "Formation5";
                }
            });


// Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");




    }



}
