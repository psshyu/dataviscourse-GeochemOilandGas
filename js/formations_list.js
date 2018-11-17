class formationList {

    constructor(samplesInBasin, colorScale) {
        this.colorScale = colorScale;

        // list of formations in the clicked basin
        this.formationNames = this._get(samplesInBasin, 'Formation_Name');

        // defaults - the formation that is initially displayed when a basin is clicked
        this.defaultFormation = this.formationNames[0];
        this.defaultFormationData = samplesInBasin.filter(e => e.Formation_Name === this.defaultFormation);

        // instantiate charts with default information
        this.tocChart = new TOC_barchart(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.inverseKrevPlot = new InverseKrevelen(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.vanKrevelenPlot = new VanKrevelenPlot(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.potentialPlot = new PotentialPlot(this.defaultFormationData, this.defaultFormation, this.colorScale);
        /* ******************************************* */
        this.testString = "test string";
        this.formationList = d3.select("#formationList")
                        .append("ul")
                        .attr("id", "formationListUL");
                        
        this.formationList.selectAll("li")
                .data(this.formationNames)
                .enter()
                .append("li").text((d) => {return d;})
                .on("click", (d) => { 
                    let samplesInFormation = samplesInBasin.filter(e => e.Formation_Name === d); 
                    let wellsInFormation = this._get(samplesInFormation, 'SRCLocationID')
                    let samplesInWell = samplesInFormation.filter(e => wellsInFormation.includes(e.SRCLocationID));
                    this.updateWellsList(samplesInWell, wellsInFormation);
                });

        let wellsInDefaultFormation = this._get(this.defaultFormationData, 'SRCLocationID')
        let samplesInDefaultFormationWells =  this.defaultFormationData.filter(e => wellsInDefaultFormation.includes(e.SRCLocationID))
        this.updateWellsList(samplesInDefaultFormationWells, wellsInDefaultFormation);
    }
    
    /**
     * gets the unique values associated with the passed in tag
     */
    _get(samples, tag){
        let set = new Set()
        let i;
        for(i = 0; i < samples.length; i++){
            set.add(samples[i][tag])
        }
        return Array.from(set).sort();
    }

    updateWellsList(wellSamples, well){
        d3.select("#legendListUL").remove();
        
        let wellList = d3.select("#legend")
                            .append("ul")
                            .attr("id", "legendListUL");
        wellList.selectAll("li")
            .data(well)
            .enter()
            .append("li").text((d) => {return d;})
            .on("click", (d) => {
                this.updateGraphs(d);
            });

            /*.on("click", (d) => { 
                let samplesInFormation = samplesInBasin.filter(e => e.Formation_Name === d); 
                let wellsInFormation = this._get(samplesInFormation, 'SRCLocationID')
                let samplesInWell = samplesInFormation.filter(e => wellsInFormation.includes(e.SRCLocationID));
                this.updateWellsList(samplesInWell, wellsInFormation);
            });*/
        //d3.select("#")
        //create a list that displays all the formations in the clicked basin data
        //that contain useful values

        //onclick function that
        /*
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
        })*/
    }
    updateGraphs(well){
        let dummyString = well + " was selected!";
        console.log(dummyString);
        //this.tocChart.update(well);
        this.inverseKrevPlot.update(well);
        //this.legend = new Legend(this.defaultFormationData, this.defaultFormation, this.colorScale);
        //this.vanKrevelenPlot = new VanKrevelenPlot(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.potentialPlot.update(well);
    }
}