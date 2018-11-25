// Scatter plot for OI vs HI
// upper right in reference image

class InverseKrevelen{

    constructor(defaultData, defaultFormation, wellDetails){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.wellDetails = wellDetails;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.30;

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

        //get minimum and maximum values of HI
        let minmaxHI = this.minmax(samplesWithInformation,'Hydrogen_Index');
        let minHI = minmaxHI[0];
        let maxHI = minmaxHI[1];
        
        //get minimum and maximum values of OI
        let minmaxOI = this.minmax(samplesWithInformation,'Tmax_C_Pyrolysis');
        let minOI = minmaxOI[0];
        let maxOI = minmaxOI[1];

        // X and Y scales 
        this.x = d3.scaleLinear()
                .domain([maxOI, minOI])
                .range([this.width - this.margin.right, this.margin.left]);
        this.y = d3.scaleLinear()
                .domain([minHI,maxHI])
                .range([this.height - this.margin.bottom,this.margin.top]);

        // X-axis
        this.svg.append("g")
            .attr("id", "invKrevPlotX")
            .attr("transform", "translate(0," + 270 + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "invKrevPlotY")
            .attr("transform", "translate("+ this.margin.right + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Scatterplot circles 
        this.svg.selectAll("circle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .attr("fill", (d) => { //return "#fddaec";
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        //console.log(well.unselectedColor)
                        color = well.unselectedColor;
                    }})
                return color;})
            .attr("stroke", "gray");
    }
    /**
     * 
     * gets the min and max values of an object, when given a list of the objects.
     */
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
    
    update(samples, wellDetails){
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Tmax_C_Pyrolysis !== '') return d});
        //get minimum and maximum values of HI
        let minmaxHI = this.minmax(samplesWithInformation,'Hydrogen_Index');
        let minHI = minmaxHI[0];
        let maxHI = minmaxHI[1];
        
        //get minimum and maximum values of OI
        let minmaxOI = this.minmax(samplesWithInformation,'Tmax_C_Pyrolysis');
        let minOI = minmaxOI[0];
        let maxOI = minmaxOI[1];

        //transition the X-axis
        this.x.domain([maxOI, minOI]);
        this.svg.select("#invKrevPlotX")
            .transition()
            .call(d3.axisBottom(this.x));

        //transition the Y-axis
        this.y.domain([minHI,maxHI])
        this.svg.select("#invKrevPlotY")
            .transition()
            .call(d3.axisLeft(this.y));

        let c = this.svg.selectAll("circle").data(samplesWithInformation);
        c.exit().remove();
        let newc = c.enter().append('circle');
        c = newc.merge(c);

        this.svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("fill", (d,i) => {
                let color;
                wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        //console.log(well.unselectedColor)
                        color = well.unselectedColor;
                    }})
                return color;
            }) 
            .attr("r", 5)
            .attr("stroke", "gray") 
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .on("end", function() {
                d3.select(this)
                .attr("fill", (d,i) => {
                    let color;
                    wellDetails.forEach( well => {
                        if(d.SRCLocationID === well.wellID){
                            //console.log(well.unselectedColor)
                            color = well.unselectedColor;
                        }})
                    return color;
                }) 
                .attr("r", 5)
                .attr("stroke", "gray");
            });

    }
}