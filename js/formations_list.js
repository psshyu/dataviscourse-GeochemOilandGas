class formationList {

    constructor(samplesInBasin, unselectedColorScale, selectedColorScale, geospatialData) {
        
        this.unselectedColorScale = unselectedColorScale;
        this.selectedColorScale = selectedColorScale;
        
        // list of formations in the clicked basin
        this.formationNames = this._get(samplesInBasin, 'Formation_Name');
        //ignore unknown formations
        this.formationNames.pop();

        // defaults - the formation that is initially displayed when a basin is clicked
        this.defaultFormation = this.formationNames[0];
        this.defaultFormationData = samplesInBasin.filter(e => e.Formation_Name === this.defaultFormation);
        let wellsInDefaultFormation = this._get(this.defaultFormationData, 'SRCLocationID');
        this.wellDetails = this._setWellDetails(this.defaultFormationData,geospatialData);
        

        // instantiate charts with default information
        this.tocChart = new TOC_barchart(this.defaultFormationData, this.defaultFormation, this.unselectedColorScale);
        this.inverseKrevPlot = new InverseKrevelen(this.defaultFormationData, this.defaultFormation, this.wellDetails);
        this.vanKrevelenPlot = new VanKrevelenPlot(this.defaultFormationData, this.defaultFormation, this.wellDetails);
        this.potentialPlot = new PotentialPlot(this.defaultFormationData, this.defaultFormation, this.wellDetails);

        //passing samples of default formation
        this.tocChart.update(this.defaultFormationData);
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
                let wellDetails = this._setWellDetails(samplesOfClickedFormation, geospatialData);

                //passing samples of clicked formation to the charts
                this.tocChart.update(samplesOfClickedFormation);
                this.vanKrevelenPlot.update(samplesOfClickedFormation, wellDetails);
                this.potentialPlot.update(samplesOfClickedFormation, wellDetails);
                this.inverseKrevPlot.update(samplesOfClickedFormation,wellDetails);

                //passing wells in clicked formation to the legend
                let allWellsInClickedFormation = this._get(samplesOfClickedFormation, 'SRCLocationID');

                // let samplesInWell = samplesOfClickedFormation.filter(e => allWellsInClickedFormation.includes(e.SRCLocationID));//
                d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
                    this.updateWellsList(samplesOfClickedFormation,geospatialData));});

        // passing wells of default formation
        
        d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
            this.updateWellsList(this.defaultFormationData,geospatialData));
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
    _setWellDetails(wellsInSample, geospatialData){
        let wellDetails = [];
        let wellSet = []
        wellsInSample.forEach( well => {
            for (let i = 0; i < geospatialData.length; i++){
                let row = geospatialData[i];
                if (row.SRCLocationID === well.SRCLocationID && wellSet.includes(well.SRCLocationID) == false){
                    let details = {};
                    details['wellID'] = well.SRCLocationID;
                    if (row.Data_Type === 'Well'){ details['wellName'] = row.Well_Name;}
                    else { details['wellName'] = row.Outcrop; }
                    details['unselectedColor'] = this.unselectedColorScale(i); 
                    details['selectedColor'] = this.selectedColorScale(i);
                    wellDetails.push(details);
                    wellSet.push(well.SRCLocationID); 
                }}});

        return wellDetails;
    }
    updateWellsList(allWells, geospatialData){
        this.wellDetails = this._setWellDetails(allWells, geospatialData);

        //change from ulist to table. We'll need to add a colored circle in the left of the well name
        d3.select("#legendListUL").remove();
        let wellList = d3.select("#legend")
                        .append("table")
                        .attr("table-layout", "auto")
                        .attr("width", "100%");

        wellList = wellList.selectAll("tr")
                    .data(this.wellDetails)
                    .enter()
                    .append("tr");

        wellList.append("td")
                    .append("svg")
                        .attr("width", "25px")
                        .attr("height", "25px")
                        .append("circle")
                            .attr("r", 7)
                            .attr("cx", 12.5)
                            .attr("cy", 15.5)
                            .attr("fill", (d) => {
                                return d.unselectedColor;
                            })
                            .attr("stroke", "gray"); 

        wellList.append("td").text((d) => {
                    return d.wellName;})
                .on("click", (d) => {
                    this.updateGraphs(d);});
        /*
        let wellList = d3.select("#legend")
                            .append("ul")
                            .attr("id", "legendListUL");

        wellList.selectAll("li")
            .data(this.wellDetails)
            .enter()
            .append("li").text((d) => {
                return d.wellName;})
            .on("click", (d) => {
                this.updateGraphs(d);
            });
        */
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

            this.legend.update(clickedFormationData,this.unselectedColorScale);
            //this.tocChart.update(clickedFormationData,this.unselectedColorScale);
            this.vanKrevelenPlot.update(clickedFormationData,this.unselectedColorScale);
            this.potentialPlot.update(clickedFormationData,this.unselectedColorScale);
            this.inverseKrevPlot.update(clickedFormationData,this.unselectedColorScale)
        })*/
    }
    updateGraphs(well){

        //This function should highlight the samples (in all charts) corresponding to the well that has been clicked.
        this.vanKrevelenPlot.selectedWell(well);

    }
}