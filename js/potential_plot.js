// Scatter plot for TOC vs S1+S2 parameters
// Lower left in reference image

class PotentialPlot{

    constructor(defaultData, defaultFormation, wellDetails){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.wellDetails = wellDetails;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.30;

        this.svg = d3.select("#potentialPlot")
                     .append("svg")
                     .attr("id", "potentialPlotSVG")
                     .attr("class", "plot")
                     .style("background-color", "#ffffff");
                     
        // Plot title
        this.svg.append("text")
            .attr("x", this.width/3)
            .attr("y", this.margin.top)
            .text("Potential Generation");

        //filter out data that lacks sum of S1 + S2 && TOC
        let samplesWithInformation = defaultData.filter(d => {if (d.S1__mgHC_gmrock_ !== '' && d.S2__mgHC_gmrock_ !== '' && d.TOC_Percent_Measured !== '') return d});    
        samplesWithInformation = this.calcAndAppendS1S2Sum(samplesWithInformation);

        //get minimum and maximum values of sum of S1 + S2
        let minmaxS1S2 = this.minmax(samplesWithInformation,'S1S2__mgHC_gmrock');
        let minS1S2 = minmaxS1S2[0];
        let maxS1S2 = minmaxS1S2[1];
        
        //get minimum and maximum values of TOC
        let minmaxTOC = this.minmax(samplesWithInformation,'TOC_Percent_Measured');
        let minTOC = minmaxTOC[0];
        let maxTOC = minmaxTOC[1];

        // X and Y scales 
        this.x = d3.scaleLinear()
                .domain([maxTOC, minTOC])
                .range([this.width - this.margin.right, this.margin.left]);
        this.y = d3.scaleLinear()
                .domain([minS1S2,maxS1S2])
                .range([this.height - this.margin.bottom,this.margin.top]);

        // X-axis
        this.svg.append("g")
            .attr("id", "potentialPlotX")
            .attr("transform", "translate(0," + 270 + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "potentialPlotY")
            .attr("transform", "translate("+ this.margin.right + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Scatterplot circles 
        this.svg.selectAll("circle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("id", (d)=>{return d.SRCLocationID})
            .attr("cx", (d) => { return this.x(d.TOC_Percent_Measured); })
            .attr("cy", (d) => { return this.y(d.S1S2__mgHC_gmrock); })
            .attr("fill", (d) => {
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        color = well.unselectedColor;
                    }})
                return color;})
            .attr("stroke", "gray")
            .attr("r", 5)
            .style("opacity", 1);
    }

    minmax(samples, tag){
        
        if(samples.length > 0){
            let min = parseFloat(samples[0][tag]);
            let max = parseFloat(samples[0][tag]);
            for(let i = 0; i < samples.length; i++){
                let currentValue = parseFloat(samples[i][tag]);
                if(currentValue < min){
                    min = currentValue;
                }
                if(currentValue > max){
                    max = currentValue;
                }
            }
            return [min, max];
        }
        else{
            return[0,10];
        }
    }
    calcAndAppendS1S2Sum(sampleList){
        for(let i = 0; i < sampleList.length; i++){
            let sumS1S2 = parseFloat(sampleList[i]['S1__mgHC_gmrock_']) + parseFloat(sampleList[i]['S2__mgHC_gmrock_']);
            sampleList[i]["S1S2__mgHC_gmrock"] = sumS1S2;
        }
        return sampleList;
    }
    update(samples,wellDetails){

        //filter out data that lacks sum of S1 + S2 && TOC
        let samplesWithInformation = samples.filter(d => {if (d.S1__mgHC_gmrock_ !== '' && d.S2__mgHC_gmrock_ !== '' && d.TOC_Percent_Measured !== '') return d});
        samplesWithInformation = this.calcAndAppendS1S2Sum(samplesWithInformation);

        //get minimum and maximum values of sum of S1 + S2
        let minmaxS1S2 = this.minmax(samplesWithInformation,'S1S2__mgHC_gmrock');
        let minS1S2 = minmaxS1S2[0];
        let maxS1S2 = minmaxS1S2[1];
        
        //get minimum and maximum values of TOC
        let minmaxTOC = this.minmax(samplesWithInformation,'TOC_Percent_Measured');
        let minTOC = minmaxTOC[0];
        let maxTOC = minmaxTOC[1];

        //transition the X-axis
        this.x.domain([maxTOC, minTOC]);
        this.svg.select("#potentialPlotX")
            .transition()
            .call(d3.axisBottom(this.x));

        //transition the Y-axis
        this.y.domain([minS1S2,maxS1S2])
        this.svg.select("#potentialPlotY")
            .transition()
            .call(d3.axisLeft(this.y));

        let c = this.svg.selectAll("circle").data(samplesWithInformation);
        c.exit().remove();
        let newc = c.enter().append('circle');
        c = newc.merge(c);

        this.svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("id", (d)=>{return d.SRCLocationID})
            .attr("fill", (d) => {
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        color = well.unselectedColor;
                    }})
                return color;})
            .attr("cx", (d) => { return this.x(d.TOC_Percent_Measured); })
            .attr("cy", (d) => { return this.y(d.S1S2__mgHC_gmrock); })
            .on("end", function() {
                d3.select(this)
                .attr("id", (d)=>{return d.SRCLocationID})
                .attr("fill", (d,i) => {
                    let color;
                    wellDetails.forEach( well => {
                        if(d.SRCLocationID === well.wellID){
                            color = well.unselectedColor;
                        }})
                    return color;
                });
            });
        this.svg.selectAll("circle").attr("stroke", "gray").attr("r",5).style("opacity", 1);
    }
    updateWells(selectedWells){
        this.svg.selectAll("circle").style("opacity", 0.25).attr("stroke", "white");
        selectedWells.forEach(id => {
            this.svg.selectAll("#"+id).raise(); //brings the selected elements to the top
            this.svg.selectAll("#"+id).style("opacity", 1).attr("stroke", "black");
        });
    }
}