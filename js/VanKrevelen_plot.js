// Scatter plot for OI vs HI
// upper right in reference image

class VanKrevelenPlot{

    mouseOverHandler(d, i){
        let id = d.SRCLocationID+"VKTip";

        d3.select("#vanKrevelenPlot")
            .append("div")
            .attr("class", "plotHover")
            .style("left", d3.event.pageX + 15+"px")
            .style("top", d3.event.pageY+ 15+"px")
            .style("background-color", d3.rgb(255,255,255,0.8))
            .attr("id", id)
            .html(() => { 
                return "<h6>" + d.SRCLocationID + "</h6>"
                    + "<text style='text-align: left;'>Hydrogen Index: "+ d.Hydrogen_Index+"</text>"
                    + "<br>"
                    + "<text style='text-align: left;'>Oxygen Index: "+ d.Oxygen_Index+"</text>"; });
    }

    mouseOutHandler(d, i) {
        let id = d.SRCLocationID+"VKTip";
        d3.select("#"+id).remove();
    }

    constructor(defaultData, defaultFormation, wellDetails){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.wellDetails = wellDetails;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.45;

        this.svg = d3.select("#vanKrevelenPlot")
            .append("svg")
            .attr("id", "vanKrevelenPlotSVG")
            .attr("class", "plot");

        // Plot title
        this.svg.append("text")
            .attr("x", this.width/3)
            .attr("y", this.margin.top)
            .text("Kerogen Type");

        //filter out data that lacks HI && OI
        this.samplesWithInformation = defaultData.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});

        // X and Y scales 
        this.x = d3.scaleLinear()
                .domain([200, 0])
                .range([this.width - this.margin.right, this.margin.left*2]);
        this.y = d3.scaleLinear()
                .domain([0,900])
                .range([this.height - this.margin.bottom*2, this.margin.top *2]);

        //y gridlines
        this.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate("+ this.margin.right *2+ "," + 0 + ") scale(0.79,1)")
            .call(d3.axisLeft(this.y)
                .tickSize(-this.width, 0, 0)
                .tickFormat("")
            );

        // X-axis
        this.svg.append("g")
            .attr("id", "vanKrevPlotX")
            .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "vanKrevPlotY")
            .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Axis labels
        // x
        this.svg.append("text")
            .attr("x", this.width/2.25)
            .attr("y", parseInt(this.height - this.margin.bottom))
            .text("OI");
        // y
        this.svg.append('text')
            .attr('x', -(this.height / 2))
            .attr('y', this.width / 20)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('HI')

        // Scatterplot circles 
        this.svg.selectAll("circle")
            .data(this.samplesWithInformation)
            .enter().append("circle")
            .attr("id", (d)=>{ return d.SRCLocationID })
            .attr("cx", (d) => { return this.x(d.Oxygen_Index); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .attr("fill", (d) => {
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        color = well.color;
                    }})
                return color;})
            .attr("stroke", "gray")
            .attr("r", 5)
            .style("opacity", 1)
            .on("mouseover", this.mouseOverHandler)
            .on("mouseout", this.mouseOutHandler);
    }
    
    update(samples, wellDetails){
        this.samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});

        let c = this.svg.selectAll("circle").data(this.samplesWithInformation);
        c.exit().remove();
        let newc = c.enter().append('circle');
        c = newc.merge(c);

        this.svg.selectAll("circle")
            .transition()
            .duration(900)
            .attr("id", (d)=>{return d.SRCLocationID})
            .attr("fill", (d,i) => {
                let color;
                wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        color = well.color;
                    }})
                return color;
            })
            .attr("cx", (d) => { return this.x(d.Oxygen_Index); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .on("end", function() {
                d3.select(this)
                    .attr("id", (d)=>{return d.SRCLocationID})
                    .attr("fill", (d,i) => {
                        let color;
                        wellDetails.forEach( well => {
                            if(d.SRCLocationID === well.wellID){
                                color = well.color;
                            }})
                        return color;
                    });
            });

        this.svg.selectAll("circle")
                .attr("stroke", "gray")
                .attr("r", 5)
                .style("opacity", 1)
                .on("mouseover", this.mouseOverHandler)
                .on("mouseout", this.mouseOutHandler);

        //appending delimiters

        function _scalePoints(curve){

            curve = curve.map((d) => {
                return [this.x(d[0]),this.y(d[1])];});
        }

        let lineGenerator = d3.line()
            .curve(d3.curveCardinal);
        //data
        let curve1 = [[12.138728323699468, 15.91724977182821],
                [29.47976878612718, 41.36294493459059],
                [49.4219653179191, 47.88865226650432],
            [59.826589595375765, 51.15606936416157],
        [92.7745664739885, 54.66078491025246],
        [136.99421965317924, 58.28414968055972],
            [201.1560693641619, 55.80164283541217]];

        let curve2 =[[6.069364161849705, 15.853361728019308],
            [9.537572254335316, 66.41618497109812],
            [13.872832369942216, 98.04076665652553],
            [23.410404624277476, 129.72010952236064],
            [35.54913294797689, 151.95314876787336],
            [54.62427745664746, 174.2592029205963],
            [84.10404624277459, 180.88530574992387],
            [108.38150289017346, 181.1408579251596],
            [122.25433526011562, 184.44478247642223],
            [137.8612716763006, 209.87222391238208],
            [150.0000000000001, 232.1052631578948]];

        let curve3 = [[4.335260115606957, 18.993002738058976],
            [7.803468208092511, 85.3452996653482],
                [10.404624277456662, 195.89899604502568],
                [16.473988439306368, 394.9102525098873],
                [26.011560693641627, 486.5895953757224],
                [39.0173410404625, 530.937024642531],
                [52.02312138728331, 562.6528749619713],
            [66.76300578034687, 578.5975053240035],
            [    11.271676300578065, 293.8028597505322]];

        let curve4 = [[2.6011560693641513, 22.132643748098417],
            [4.335260115606957, 151.6245816854273],
            [       3.468208092485554, 375.8259811378156],
            [       5.202312138728303, 533.7389717067233],
            [       6.936416184971108, 593.7572254335258],
            [       9.537572254335316, 653.7846060237298],
            [       18.208092485549116, 717.0337693945846],
            [       27.745664739884432, 777.1341648919986],
            [       39.88439306358384, 821.472467295406]];

        curve1 = _scalePoints(curve1);
        curve2 = _scalePoints(curve2);
        curve3 = _scalePoints(curve3);
        curve4 = _scalePoints(curve4);
        //generate line
        let path1 = lineGenerator(curve1);
        let path2 = lineGenerator(curve2);
        let path3 = lineGenerator(curve3);
        let path4 = lineGenerator(curve4);



        this.svg.append('path')
            .attr('d', path1)
            .style('fill','none')
            .style('stroke','black');



    }

    updateWells(selectedWells){
        this.svg.selectAll("circle")
                .style("opacity", 0.25)
                .attr("stroke", "white")
                .on("mouseover", null)
                .on("mouseout", null);

        selectedWells.forEach(id => {
            this.svg.selectAll("#"+id).raise(); //brings the selected elements to the top
            this.svg.selectAll("#"+id)
                    .style("opacity", 1)
                    .attr("stroke", "black")
                    .on("mouseover", this.mouseOverHandler)
                    .on("mouseout", this.mouseOutHandler);
        });
    }
}