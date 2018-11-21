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
        console.log();
        //filter out data that lacks HI && OI
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});
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
        let x = d3.scaleLinear()
                .domain([minOI, maxOI])
                .range([this.width - this.margin.right, this.margin.left]);
        let y = d3.scaleLinear()
                .domain([minHI,maxHI])
                .range([this.height - this.margin.bottom,this.margin.top]);

        // X-axis
        this.svg.append("g")
            .attr("transform", "translate(0," + 270 + ")")
            .call(d3.axisBottom(x));
      
        // Y Axis
        this.svg.append("g")
            .attr("transform", "translate("+ this.margin.right + "," + 0 + ")")
            .call(d3.axisLeft(y));

        // Scatterplot circles 
        this.svg.selectAll("vanKrevCircle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", (d) => { return x(d.Oxygen_Index); })
            .attr("cy", (d) => { return y(d.Hydrogen_Index); })
            .attr("fill", "#373737");


        

    }
}