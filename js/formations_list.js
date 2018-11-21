class formationList {

    constructor(samplesInBasin, colorScale) {
        this.colorScale = colorScale;

        // list of formations in the clicked basin
        this.formationNames = this._get(samplesInBasin, 'Formation_Name');
        //ignore unknown formations
        this.formationNames.pop();

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
                    let samplesOfClickedFormation = samplesInBasin.filter(e => e.Formation_Name === d); //d: clicked formation

                    //passing samples of clicked formation to the charts
                    this.tocChart.update(samplesOfClickedFormation);
                    this.vanKrevelenPlot.update(samplesOfClickedFormation,this.colorScale);
                    // this.potentialPlot.update(samplesOfClickedFormation,this.colorScale);
                    this.inverseKrevPlot.update(samplesOfClickedFormation,this.colorScale);

                    //passing wells in clicked formation to the legend
                    let allWellsInClickedFormation = this._get(samplesOfClickedFormation, 'SRCLocationID');
                    // let samplesInWell = samplesOfClickedFormation.filter(e => allWellsInClickedFormation.includes(e.SRCLocationID));//
                    d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
                        this.updateWellsList(allWellsInClickedFormation,geospatialData));});


        //passing samples of default formation
        
        this.tocChart.update(this.defaultFormationData);
        // this.potentialPlot.update(samplesOfDefaultFormation,this.colorScale);
        // this.inverseKrevPlot.update(samplesOfDefaultFormation,this.colorScale);

        // passing wells of default formation
        let wellsInDefaultFormation = this._get(this.defaultFormationData, 'SRCLocationID');
        d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
            this.updateWellsList(wellsInDefaultFormation,geospatialData));
    }
    
    /**
     * gets the unique values associated with the passed in tag
     */
    _get(rows, tag){
        let set = new Set();
        let i;
        for(i = 0; i < rows.length; i++){
            set.add(rows[i][tag])
        }
        return Array.from(set).sort();
    }

    updateWellsList(allWells, geospatialData){

        //getting well_names from the SRCLocationIDs
        let allWellNames = [];
        allWells.forEach( wellID => {
            geospatialData.forEach(row => {
                if (row.SRCLocationID === wellID){
                    if (row.Data_Type === 'Well')
                        {allWellNames.push(row.Well_Name);}
                    else if (row.Data_Type === 'Outcrop')
                        {allWellNames.push(row.Outcrop);}
            }})});


        //change from ulist to table. We'll need to add a colored circle in the left of the well name
        d3.select("#legendListUL").remove();
        let wellList = d3.select("#legend")
                            .append("ul")
                            .attr("id", "legendListUL");
        wellList.selectAll("li")
            .data(allWellNames)
            .enter()
            .append("li").text((d) => {return d;})
            .on("click", (d) => {
                this.updateGraphs(d);
            });

            /*.on("click", (d) => { 
                let samplesOfClickedFormation = samplesInBasin.filter(e => e.Formation_Name === d); 
                let allWellsInClickedFormation = this._get(samplesOfClickedFormation, 'SRCLocationID')
                let samplesInWell = samplesOfClickedFormation.filter(e => allWellsInClickedFormation.includes(e.SRCLocationID));
                this.updateWellsList(samplesInWell, allWellsInClickedFormation);
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

        //This function should highlight the samples (in all charts) corresponding to the well that has been clicked.

        let dummyString = well + " was selected!";
        console.log(dummyString);

    }
}