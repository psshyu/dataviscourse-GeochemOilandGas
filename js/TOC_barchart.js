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

        // this.svg = d3.select('#tocBarchartSVG').apend('g').attr('transform','rotate(-90)');
        //plot title
        this.svg.append("text")
            .attr("x", this.width/4)
            .attr("y", this.margin.top)
            .text("Total Organic Carbon Content (TOC)");

        this.samplesWithInformation = defaultData.filter(d => d.TOC_Percent_Measured !== '');
        this.samplesWithInformation = this.samplesWithInformation.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

        this.update(defaultData);
    }


    update(data) {

        //console.log(data);

        let tocValues = data.filter(d => d.TOC_Percent_Measured !== '');
        tocValues = tocValues.map(function(d){ return parseFloat(d.TOC_Percent_Measured)});

        // console.log(tocValues);

        if (tocValues.length > 0) {

            this.svg.select('#noInfo').remove();

            //xScale
            let xScale = d3.scaleLinear()
                .domain([0, 10])
                .range([this.margin.left*2, this.width - this.margin.right]);

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
            let yScaleAxis = d3.scaleLinear()
                .domain([0, maxCount])
                .range([ this.height - this.margin.bottom*2,  this.margin.top *2]);


            let yScale = d3.scaleLinear()
                .domain([0, maxCount])
                .range([ this.margin.top *2, this.height - this.margin.bottom*2]);

            //y gridlines
            //remove first
            d3.select('#toc_grid').remove();

            this.svg.append("g")
                .attr("class", "grid")
                .attr('id','toc_grid')
                .attr("transform", "translate("+ this.margin.right *2+ "," + 0 + ") scale(0.79,1)")
                .call(d3.axisLeft(yScale)
                    .tickSize(-this.width, 0, 0)
                    .tickFormat("")
                );

            //bars

            //let's append a group to insert the bars

            this.group = d3.select('#tocBarchartSVG').append('g').attr('transform','translate(0,350) scale(1,-0.8)');
            let bars = this.group.selectAll('.bar').data(bins);
            let newBars = bars.enter().append('rect');
            bars = newBars.merge(bars);

            bars
                .transition()
                .duration(1000)
                .attr('class','bar')
                .attr('x', d => xScale(+d.x0)+2)
                .attr('y', 0)
                .attr('width', 12)
                .attr('height', (d,i) => {
                    console.log(d.length);
                    return yScale(d.length)

                })
                .attr('opacity',1)
                .style('fill','steelblue')
                .style('stroke','black');
                // .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")");
                // .attr("transform", "rotate(0,-1)");
                // .on('mouseover',) //show tooltip
                // .on('mouseout',)
                // .on('click',); //highlight samples in other charts that have the clicked TOC



            //remove initial axis
            d3.select('#TOCPlotYinit').remove();
            d3.select('#toc-yAxis').remove();

            // X-axis
            let xAxis = d3.axisBottom(xScale).ticks(20);
            this.svg.append("g")
                .attr("id", "TOCPlotX")
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