//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor(defaultData, defaultFormation, colorScale) {

        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.colorScale = colorScale;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = 300;
        this.height = 300;

        this.svg = d3.select("#tocBarchart")
            .append("svg")
            .attr("id", "tocBarchartSVG")
            .attr("class", "plot")
            .style("background-color", "#ffffff")
            .attr("width", this.width)
            .attr("height", this.height);
    }


    update(data) {

        console.log(data);

        let tocValues = data.filter(d => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

        console.log(tocValues);

        if (tocValues.length > 0) {

            this.svg.select('#noInfo').remove();

            let minToc = d3.min(tocValues);
            let maxToc = d3.max(tocValues);


            let xScale = d3.scaleLinear()
                .domain([minToc, maxToc])
                .range([this.margin.left, this.width - this.margin.right]);

            //building histogram holder. Considering adaptive toc domain if max toc < 10, else cut the data display off at 10
            let histogram_ = null;
            if (maxToc > 10) {

                histogram_ = d3.histogram()
                    .domain([0, 10])
                    .thresholds(xScale.ticks(9));
            } else {
                histogram_ = d3.histogram()
                    .domain([0, maxToc])
                    .thresholds(xScale.ticks(9));
            }

            //building histogram
            let histogram = histogram_(tocValues);
            console.log(histogram);

            //yScale
            let maxCount = d3.max(histogram.map(d => d.length));
            let yScale = d3.scaleLinear()
                .domain([0,maxCount])
                .range([this.margin.bottom, this.height - this.margin.top]);

            let bars = this.svg.selectAll('.bar').data(histogram);

            bars.exit()
                .attr("opacity", 1)
                // .transition()
                // .duration(1000)
                .attr("opacity", 0)
                .remove();

            let newBars = bars.enter().append('rect');

            bars = newBars.merge(bars);

            bars
                .attr('class','bar')
                .attr('x', d => xScale(+d.x0))
                .attr('y', 0)
                .attr('width', 10)
                .attr('height', d => {
                    // console.log(d.length);
                    return yScale(+d.length)})
                .attr('opacity',0.5)
                .style('fill','grey')
                .style('stroke','black')
                .attr("transform", "translate(300,250), rotate(180)");

            //
            let xAxis = d3.axisBottom(xScale);

            this.svg.append("g")
                .call(xAxis);
            let yAxis = d3.axisLeft(yScale);

            this.svg.append("g")
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