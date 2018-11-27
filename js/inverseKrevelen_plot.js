// Scatter plot for OI vs HI
// upper right in reference image

class InverseKrevelen{
    mouseOverHandler(d, i){
        let id = d.SRCLocationID+"iVKTip";
        d3.select("#inverseKrevPlot")
            .append("div")
            .style("left", d3.event.pageX + 15+"px")
            .style("top", d3.event.pageY+ 15+"px")
            .style("padding", "5px 5px 5px 5px")
            .style("position", "absolute")
            .style("z-index", 10)
            .style("background-color", d3.rgb(255,255,255,0.8))
            .style("border", "1px solid black")
            .attr("id", id)
            .html(() => { 
                return "<h6>" + d.SRCLocationID + "</h6>"
                    + "<text style='text-align: left;'>Hydrogen Index: "+ d.Hydrogen_Index+"</text>"
                    + "<br>"
                    + "<text style='text-align: left;'>Tmax: "+ d.Tmax_C_Pyrolysis+"</text>"; });
    }

    mouseOutHandler(d, i) {
        let id = d.SRCLocationID+"iVKTip";
        d3.select("#"+id).remove();
    }
    constructor(defaultData, defaultFormation, wellDetails){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.wellDetails = wellDetails;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.45;

        this.svg = d3.select("#inverseKrevPlot")
            .append("svg")
            .attr("id", "inverseKrevPlotSVG")
            .attr("class", "plot")
            .style("background-color", "#ffffff");

        // Plot title
        this.svg.append("text")
            .attr("x", this.width/3)
            .attr("y", this.margin.top)
            .text("Inverse Van Krevelen");

        //filter out data that lacks HI && OI
        let samplesWithInformation = defaultData.filter(d => {if (d.Hydrogen_Index !== '' && d.Tmax_C_Pyrolysis !== '') return d});


        // X and Y scales 
        this.x = d3.scaleLinear()
                .domain([500, 380])
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
            .attr("id", "invKrevPlotX")
            .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "invKrevPlotY")
            .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Axis labels
        // x
        this.svg.append("text")
            .attr("x", this.width/2.25)
            .attr("y", parseInt(this.height - this.margin.bottom))
            .text("Tmax");
        // y
        this.svg.append('text')
            .attr('x', -(this.height / 2))
            .attr('y', this.width / 20)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('HI')

        // Scatterplot circles 
        this.svg.selectAll("circle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("id", (d)=>{ return d.SRCLocationID; })
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .attr("fill", (d) => { //return "#fddaec";
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){ color = well.color; }})
                return color;})
            .attr("stroke", "gray")
            .attr("r", 5)
            .style("opacity", 1)
            .on("mouseover", this.mouseOverHandler)
            .on("mouseout", this.mouseOutHandler);
    }

    update(samples, wellDetails){
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Tmax_C_Pyrolysis !== '') return d});

        let c = this.svg.selectAll("circle").data(samplesWithInformation);
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
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
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