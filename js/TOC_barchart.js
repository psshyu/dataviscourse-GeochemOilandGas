//barchart for TOC data 
//upper left image in reference

class TOC_barchart {

    constructor(defaultData, defaultFormation, colorScale) {

        // this.defaultData = defaultData;
        // this.defaultFormation = defaultFormation;
        // this.colorScale = colorScale;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.45;

        //append svg
        this.svg = d3.select("#tocBarchart")
            .append("svg")
            .attr("id", "tocBarchartSVG")
            .attr("class", "plot")
            .style("background-color", "#ffffff");

        //plot title
        this.svg.append("text")
            .attr("x", this.width/4)
            .attr("y", this.margin.top)
            .text("Total Organic Carbon Content (TOC)");

        this.samplesWithInformation = defaultData.filter(d => d.TOC_Percent_Measured !== '');
        this.samplesWithInformation = this.samplesWithInformation.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

       //X scale
        this.xScale = d3.scaleLinear()
            .domain([10, 0])
            .range([this.width - this.margin.right, this.margin.left*2]);

        //Yscale
        //creating bin generator
        let binsGenerator = d3.histogram()
            .domain([0, 10])
            .thresholds(this.xScale.ticks(20));

        let bins = binsGenerator(this.samplesWithInformation);
        bins.pop(); //last bin range <10,10>
        //console.log(bins);

        let maxCount = d3.max(bins.map(d => d.length));

        console.log(maxCount);
        this.yScale = d3.scaleLinear()
            .domain([maxCount,0])
            .range([this.margin.top *2, this.height - this.margin.bottom*2]);


        //y gridlines
        this.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate("+ this.margin.right *2+ "," + 0 + ") scale(0.79,1)")
            .call(d3.axisLeft(this.yScale)
                .tickSize(-this.width, 0, 0)
                .tickFormat("")
            );

        // X-axis
        this.svg.append("g")
            .attr("id", "TOCPlotX")
            .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
            .call(d3.axisBottom(this.xScale).ticks(20));

        //Y-axis
        this.svg.append("g")
            .attr("id", "TOCPlotYinit")
            .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
            .call(d3.axisLeft(this.yScale).ticks(1));

    }


    update(data) {

        //console.log(data);

        let tocValues = data.filter(d => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

        console.log(tocValues);

        if (tocValues.length > 0) {

            this.svg.select('#noInfo').remove();

            // let xScale = d3.scaleLinear()
            //     .domain([10, 0])
            //     .range([this.width - this.margin.right, this.margin.left]);
            //

            //creating bin generator
            let binsGenerator = d3.histogram()
                    .domain([0, 10])
                    .thresholds(this.xScale.ticks(20));

            //building bins
            let bins = binsGenerator(tocValues);
            bins.pop(); //last bin range <10,10>
            console.log(bins);

            //yScale
            let maxCount = d3.max(bins.map(d => d.length));
            let yScale = d3.scaleLinear()
                .domain([0,maxCount])
                .range([this.height - this.margin.bottom*2, this.margin.top *2]);


            let bars = this.svg.selectAll('.bar').data(bins);
            bars.exit().remove();
            let newBars = bars.enter().append('rect');
            bars = newBars.merge(bars);

            bars
                .transition()
                .duration(1000)
                .attr('class','bar')
                .attr('x', d => this.xScale(+d.x0)-10)
                .attr('y', 0)
                .attr('width', 10)
                .attr('height', d => {
                    // console.log(d.length);
                    return yScale(d.length)})
                .attr('opacity',1)
                .style('fill','steelblue')
                .style('stroke','black')
                .attr("transform", "translate("+this.width+",270), rotate(180)");
                // .on('mouseover',) //show tooltip
                // .on('mouseout',)
                // .on('click',); //highlight samples in other charts that have the clicked TOC


            //scales for the axes. Axes will be fixed from 0 to 10 in steps of 0.5

            // Y Axis
            //remove initial axis
            let oldAxis = d3.select('#TOCPlotYinit');
            console.log(oldAxis);
            oldAxis.remove();


            let num_ticks = 0;
            maxCount < 10 ? num_ticks = maxCount : num_ticks = 10;
            let yAxis = d3.axisLeft(yScale).ticks(num_ticks);
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