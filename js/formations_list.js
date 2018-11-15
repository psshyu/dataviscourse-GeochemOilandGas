class formationList {

    constructor(samplesInBasin, colorScale) {
        this.formationNames = this._getFormations(samplesInBasin);
        this.tocChart = new TOC_barchart(samplesInBasin, defaultFormation[0]);;// = new TOC_barchart();
        this.vanKrevelenPlot = new VanKrevelenPlot();
        this.potentialPlot = new PotentialPlot();
        this.inverseKrevPlot = new InverseKrevelen();
        this.legend = new Legend();
        /* ******************************************* */
        this.colorScale = colorScale;
        this.list = d3.select("#formationList")
                        .append("ul")
                        .attr("id", "formationListUL");
        this.list.selectAll("li")
                .data(this.formationNames)
                .enter()
                .append("li").text((d) => {return d;})

        
    }
    /**
     * This function returns a sorted set of the formation names in the sample basin;
     * This was done to remove duplicates from appearing in the list
     */
    _getFormations(samples){
        let set = new Set()
        let i;
        for(i = 0; i < samples.length; i++){
            set.add(samples[i]['Formation_Name'])
        }
        return Array.from(set).sort();
    }

    update(clickedBasinData){
        //create a list that displays all the formations in the clicked basin data
        //that contain useful values

        //onclick function that
        d3.select('list')
        .on('click', d =>{

            //filter data based on the clicked formation name
            let clickedFormationData = clickedBasinData.filter(e => e.formation_name === d);

            //pass the respective data to the charts

            this.legend.update(clickedFormationData,this.colorScale);
            //this.tocChart.update(clickedFormationData,this.colorScale);
            this.vanKrevelenPlot.update(clickedFormationData,this.colorScale);
            this.potentialPlot.update(clickedFormationData,this.colorScale);
            this.inverseKrevPlot.update(clickedFormationData,this.colorScale)
        })




    }
}