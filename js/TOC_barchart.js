//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor(defaultData, defaultFormation, colorScale) {
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.colorScale = colorScale;
        
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
        
        this.barGroup = d3.select('#tocBarchartSVG')
                            .append('g')
                            .attr('transform','translate(0,'+ (this.height - this.margin.top*2)+') scale(1,-1)');

        // X Scale
        this.x = d3.scaleLinear()
        .domain([100, 0])
        .range([this.width - this.margin.right, this.margin.left*2]);
        
        let tocValues = this.getTOCValues(this.defaultData);
        let bins = this.binGenerate(tocValues);

        // get the highest frequency in the bins
        let maxCount = d3.max(bins.map(d => d.length));

        // create Y-scales from them. They should really be the same. idk why there are two...
        this.yScaleAxis = d3.scaleLinear()
                            .domain([0, maxCount])
                            .range([this.height - this.margin.bottom*2, this.margin.top *2]);

        this.yScale = d3.scaleLinear()
                        .domain([0, maxCount])
                        .range([0,this.height - this.margin.bottom*4]);

        // Create the bars for histogram
        let bars = this.barGroup.selectAll('.bar').data(bins);
        bars.exit().remove();
        let newBars = bars.enter().append('rect');
        bars = newBars.merge(bars);

        bars.attr('class','bar')
            .attr('x', (d) => { return this.x(d.x0);})
            .attr('y', 0)
            .attr('width', (d) => { 
                let width = this.x(d.x1) - this.x(d.x0);
                return 0.85*width;})
            .attr('height', (d) => { return this.yScale(d.length) })
            .attr('opacity',1)
            .style('fill','steelblue')
            .style('stroke','black');

        // Axis labels
        // x
        this.svg.append("text")
            .attr("x", this.width/2.25)
            .attr("y", parseInt(this.height - this.margin.bottom))
            .text("TOC%");
        // y
        this.svg.append('text')
            .attr('x', -(this.height / 2))
            .attr('y', this.width / 20)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Frequency');

        // X-axis
        this.svg.append("g")
            .attr("id", "toc-xAxis")
            .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
            .call(d3.axisBottom(this.x).ticks(20));
        
        //Y-Axis
        this.svg.append("g")
        .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
        .attr("id", 'toc-yAxis')
        .call(d3.axisLeft(this.yScaleAxis));

    }

    getTOCValues(data){
        let tocValues = data.filter((d) => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map((d) => { return parseFloat(d.TOC_Percent_Measured)});
        return tocValues;
    }

    binGenerate(data){
        let bins = d3.histogram()
                        .domain([0, 100])
                        .thresholds(20)
                        (data);
        bins.pop()
        return bins;
    }

    update(data) {
        // parse the TOC Values and bin them
        let tocValues = this.getTOCValues(data);
        let bins = this.binGenerate(tocValues);

        //yScale
        let maxCount = d3.max(bins.map(d => d.length));

        this.yScaleAxis = d3.scaleLinear()
                            .domain([0, maxCount])
                            .range([this.height - this.margin.bottom*2, this.margin.top *2]);

        this.yScale = d3.scaleLinear()
                        .domain([0, maxCount])
                        .range([0,this.height - this.margin.bottom*4]);

        //let's append a group to insert the bars
        let bars = this.barGroup.selectAll('.bar').data(bins);
        bars.exit().remove();
        let newBars = bars.enter().append('rect');
        bars = newBars.merge(bars);

        bars.transition()
            .duration(900)
            .attr('class','bar')
            .attr('x', d => { return this.x(d.x0); })
            .attr('y', 0)
            .attr('width', (d) => { 
                let width = this.x(d.x1) - this.x(d.x0);
                return 0.85*width;})
            .attr('height', (d) => { return this.yScale(d.length) })
            .attr('opacity',1)
            .style('fill','steelblue')
            .style('stroke','black');

        //remove initial axis
        d3.select('#TOCPlotYinit').remove();
        d3.select('#toc-yAxis').remove();

        //Y-Axis
        this.svg.append("g")
            .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
            .attr("id", 'toc-yAxis')
            .call(d3.axisLeft(this.yScaleAxis));


    }
}