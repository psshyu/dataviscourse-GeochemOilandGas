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

        // this.svgGroup = this.svg.append('g').attr('id','mainTocChartGroup');

        // this.svg = d3.select("#tocBarchart")
        //     .append("svg")
        //     .attr("width", this.width)
        //     .attr("height", this.height)
        //     .append("g")
        //     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");



    }


    update(data) {

        console.log(data);

        let tocValues = data.filter(d => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});
        console.log(tocValues);

        let minToc = d3.min(tocValues);
        let maxToc = d3.max(tocValues);
        console.log(minToc,maxToc);


        let xScale = d3.scaleLinear()
            .domain([minToc, maxToc])
            .range([this.margin.left, this.width-this.margin.right]);

        //building histogram holder. Considering adaptive toc domain if max toc < 10, else cut the data display off at 10
        let histogram_= null;
        if (maxToc > 10) {

                histogram_ = d3.histogram()
                .domain([0, 10])
                .thresholds(xScale.ticks(10));
        }else{
                histogram_ = d3.histogram()
                .domain([0, maxToc])
                .thresholds(xScale.ticks(10));
        }

        //building histogram
        let histogram = histogram_(tocValues);
        console.log(histogram);

        //yScale
        let maxCount = d3.max(histogram.map(d => d.length));
        let yScale = d3.scaleLinear()
            .domain([maxCount, 0])
            .range([this.margin.bottom, this.height-this.margin.top]);


        let bars = this.svg.selectAll('.bar').data(histogram);
        bars.exit().remove();
        let newBars = bars.enter().append('rect');
        bars = newBars.merge(bars);

        bars
            .attr('x', d => xScale(+d.x0))
            .attr('y', 0)
            .attr('width', d => xScale(+d.x1 - +d.x0))
            .attr('height', d => yScale(+d.length));


        let xAxis = d3.axisBottom(xScale);

        this.svg.append("g")
            .call(xAxis);
        let yAxis = d3.axisLeft(yScale);

        this.svg.append("g")
            .call(yAxis);



        //
        // let xScale = d3.scaleLinear()
        //     .domain(d3.extent(data)).nice()
        //     .range([this.margin.left, this.width - this.margin.right]);
        //
        // let bins = d3.histogram()
        //     .domain(xScale.domain())
        //     .thresholds(xScale.ticks(40))
        //     (data);
        //
        // console.log(bins);



    }
}