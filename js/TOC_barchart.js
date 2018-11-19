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
                .domain([0, 10])
                .range([this.margin.left, this.width - this.margin.right]);

            //creating bin generator
            let binsGenerator = d3.histogram()
                    .domain([0, 10])
                    .thresholds(xScale.ticks(20));
            //building bins
            let bins = binsGenerator(tocValues);
            bins.pop(); //last bin range <10,10>
            console.log(bins);

            //yScale
            let maxCount = d3.max(bins.map(d => d.length));
            let yScale = d3.scaleLinear()
                .domain([maxCount,0])
                .range([this.margin.top, this.height - this.margin.bottom]);

            let bars = this.svg.selectAll('.bar').data(bins);

            //remove old bars
            bars.exit()
                .attr("opacity", 1)
                .attr("opacity", 0)
                .remove();

            let newBars = bars.enter().append('rect');

            bars = newBars.merge(bars);

            bars
                .attr('class','bar')
                .attr('x', d => xScale(+d.x0))
                .attr('y', 0)
                .attr('width', 10)
                .attr('height', d => {return yScale(+d.length)})
                .attr('opacity',0.5)
                .style('fill','grey')
                .style('stroke','black')
                .attr("transform", "translate(300,270), rotate(180)");

            //remove old axes
            d3.select("#toc-xAxis").remove();
            d3.select("#toc-yAxis").remove();

            //scales for the axes. Axes will be fixed from 0 to 10 in steps of 0.5
            //x axis
            let xAxis = d3.axisBottom(xScale).ticks(20);
            this.svg.append("g")
                .attr("transform", "translate(0,270)")
                .attr("id", 'toc-xAxis')
                .call(xAxis);

            //y axis
            let num_ticks = 0;
            maxCount < 10 ? num_ticks = maxCount : num_ticks = 10;
            let yAxis = d3.axisLeft(yScale).ticks(num_ticks);
            this.svg.append("g")
                .attr("transform", "translate(30,0)")
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