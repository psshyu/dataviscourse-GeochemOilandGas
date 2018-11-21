// Scatter plot for OI vs HI
// upper right in reference image

class VanKrevelenPlot{

    constructor(defaultData, defaultFormation, colorScale){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.colorScale = colorScale;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.30;

        this.svg = d3.select("#vanKrevelenPlot")
            .append("svg")
            .attr("id", "vanKrevelenPlotSVG")
            .attr("class", "plot")
            .style("background-color", "#ffffff");

        //filter out data that lacks HI && OI
        let samplesWithInformation = defaultData.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});
        console.log(samplesWithInformation);
        //get minimum and maximum values of HI
        let minmaxHI = this.minmax(samplesWithInformation,'Hydrogen_Index');
        let minHI = minmaxHI[0];
        let maxHI = minmaxHI[1];
        
        //get minimum and maximum values of OI
        let minmaxOI = this.minmax(samplesWithInformation,'Oxygen_Index');
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
            .attr("id", "vanKrevPlotX")
            .attr("transform", "translate(0," + 270 + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "vanKrevPlotY")
            .attr("transform", "translate("+ this.margin.right + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Scatterplot circles 
        this.svg.selectAll("circle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", (d) => { return this.x(d.Oxygen_Index); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .attr("fill", "#373737");
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
    
    update(samples, colorScale){
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});
        //get minimum and maximum values of HI
        let minmaxHI = this.minmax(samplesWithInformation,'Hydrogen_Index');
        let minHI = minmaxHI[0];
        let maxHI = minmaxHI[1];
        
        //get minimum and maximum values of OI
        let minmaxOI = this.minmax(samplesWithInformation,'Oxygen_Index');
        let minOI = minmaxOI[0];
        let maxOI = minmaxOI[1];

        //transition the X-axis
        this.x.domain([maxOI, minOI]);
        this.svg.select("#vanKrevPlotX")
            .transition()
            .call(d3.axisBottom(this.x));

        //transition the Y-axis
        this.y.domain([minHI,maxHI])
        this.svg.select("#vanKrevPlotY")
            .transition()
            .call(d3.axisLeft(this.y));

        let c = this.svg.selectAll("circle").data(samplesWithInformation);
        c.exit().remove();
        let newc = c.enter().append('circle');
        c = newc.merge(c);

        this.svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("fill", "#373737") 
            .attr("r", 5) 
            .attr("cx", (d) => { return this.x(d.Oxygen_Index); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .on("end", function() {
                d3.select(this)
                    .attr("fill", "#373737")
                    .attr("r", 5);
            });

    }
}