//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor(defaultData, defaultFormation, colorScale) {

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.45;

        //append svg
        this.svg = d3.select("#tocBarchart")
            .append("svg")
            .attr("id", "tocBarchartSVG")
            .attr("class", "plot")
            .style("background-color", "#ffffff");

        this.svg.append("text")
            .attr("x", this.width/4)
            .attr("y", this.margin.top)
            .text("Total Organic Carbon Content (TOC)");

        this.update(defaultData);
    }


    update(data) {

        let tocValues = data.filter(d => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

        if (tocValues.length > 0) {
            this.svg.select('#noInfo').remove();

            //xScale
            let xScale = d3.scaleLinear()
                .domain([10, 0])
                .range([this.width - this.margin.right, this.margin.left*2]);

            //creating bin generator
            let binsGenerator = d3.histogram()
                    .domain([0, 100])
                    .thresholds(xScale.ticks(10));

            //building bins
            let bins = binsGenerator(tocValues);
            console.log(tocValues);
            bins.pop(); //last bin range <10,10>

            //yScale
            let maxCount = d3.max(bins.map(d => d.length));

            let yScaleAxis = d3.scaleLinear()
                                .domain([0, maxCount])
                                .range([this.height - this.margin.bottom*2, this.margin.top *2]);

            let yScale = d3.scaleLinear()
                            .domain([0, maxCount])
                            .range([0,this.height - this.margin.bottom*2]);

            //bars
            console.log(bins);
            //let's append a group to insert the bars
            this.group = d3.select('#tocBarchartSVG').append('g').attr('transform','translate(0,'+ (this.height - this.margin.top*2)+') scale(1,-1)');
            let bars = this.group.selectAll('.bar').data(bins);
            bars.exit().remove();
            let newBars = bars.enter().append('rect');
            bars = newBars.merge(bars);

            bars.transition()
                .duration(1000)
                .attr('class','bar')
                .attr('x', d => {
                    //console.log(d);
                    return xScale(+d.x0)+2;})
                .attr('y', 0)
                .attr('width', 12)
                .attr('height', (d) => {
                    return yScale(d.length)
                })
                .attr('opacity',1)
                .style('fill','steelblue')
                .style('stroke','black');


            //remove initial axis
            d3.select('#TOCPlotYinit').remove();
            d3.select('#toc-xAxis').remove();
            d3.select('#toc-yAxis').remove();

            // X-axis
            let xAxis = d3.axisBottom(xScale).ticks(20);
            this.svg.append("g")
                .attr("id", "toc-xAxis")
                .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
                .call(xAxis);

            //Y-Axis
            let num_ticks = 0;
            maxCount < 10 ? num_ticks = maxCount : num_ticks = 10;

            let yAxis = d3.axisLeft(yScaleAxis).ticks(num_ticks);
            this.svg.append("g")
                .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
                .attr("id", 'toc-yAxis')
                .call(yAxis);
        }else{

            this.svg.selectAll('.bar').remove();
            this.svg.append('text')
                .attr('x',this.width/2)
                .attr('y',this.height/2)
                .text('No information available')
                .attr('id','noInfo')
        }

    }
}