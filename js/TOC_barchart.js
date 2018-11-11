//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor() {


        this.margin = {top: 20, right: 160, bottom: 35, left: 30};

        this.width = 500 - margin.left - margin.right,
            this.height = 300 - margin.top - margin.bottom;

        this.svg = d3.select("#tocBarchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.svg.append('text').text('CLICK A DATA POINT TO DISPLAY THE TOC DISTRIBUTION ABOUT THE FORMATION');
    }

    /*
    @param data Receives the data from a specific formation (whenever a circle -in a scatterplot- gets clicked)

     */

    update(data, colorScale) {


        // Set up the scales
        let aScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.a)])
            .range([0, 140]);
        let bScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.b)])
            .range([0, 140]);
        let iScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([10, 120]);


        let barchartsSelection = d3.select("#aBarChart").selectAll("rect").data(data);

        // handle exit selection
        barchartsSelection
            .exit()
            .attr("opacity", 1)
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .remove();

        let newBars = barchartsSelection.enter().append("rect");

        // //Need to merge the new rectangle with the original selection
        barchartsSelection = newBars.merge(barchartsSelection);

        //Apply transitions to new selection containing all rectangles
        barchartsSelection
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return aScale(d.a);
            })
            .attr("x", 0)
            .attr("y", (d, i) => (i + 1) * 10)
            .attr("height", 10);
//if we wanted to add listeners on D3 we use .on like this: .on("mouseout",function (){this.setAttribute("style","fill: red");}) with D3
//When adding events by javascript we need to use events and select 'the group g of elemnts' (adding events to a selection of bars don't work)
//also when adding a new listener, we need to call the group again, and not concatenate the listeners.
//'this' in D3 .on functions refers to the element being clicked, hoveredover, etc. In JS, we use event.target.
        DOMbarchartsGroupS = document.getElementById("aBarChart");
        DOMbarchartsGroupS
            .addEventListener("mouseover", function (event) {
                event.target.setAttribute("style", "fill: red");
            });
        DOMbarchartsGroupS
            .addEventListener("mouseout", function (event) {
                event.target.setAttribute("style", "fill:" + String(event.target.getAttribute("style")));
            });


        // TODO: Select and update the 'b' bar chart bars

        let BbarchartsSelection = d3.select("#bBarChart").selectAll("rect").data(data);

        // handle exit selection
        BbarchartsSelection
            .exit()
            .attr("opacity", 1)
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .remove();

        //define enter-append selection
        let BnewBars = BbarchartsSelection.enter().append("rect");

        //merge the new rectangle selection with the original selection
        BbarchartsSelection = BnewBars.merge(BbarchartsSelection);

        //Apply transitions to new selection containing all original+appended rectangles
        BbarchartsSelection
            .transition()
            .duration(1000)
            .attr("width", function (d) {
                return aScale(d.b);
            })
            .attr("x", 0)
            .attr("y", (d, i) => (i + 1) * 10)
            .attr("height", 10);


    }
}