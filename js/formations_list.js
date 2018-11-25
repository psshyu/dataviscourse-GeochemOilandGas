class formationList {

    constructor(samplesInBasin, unselectedColorScale, selectedColorScale, geospatialData) {
        
        this.unselectedColorScale = unselectedColorScale;
        this.selectedColorScale = selectedColorScale;
        this.selected = [];
        // list of formations in the clicked basin
        this.formationNames = this._get(samplesInBasin, 'Formation_Name');
        //ignore unknown formations
        this.formationNames.pop();

        // defaults - the formation that is initially displayed when a basin is clicked
        this.defaultFormation = this.formationNames[0];
        this.defaultFormationData = samplesInBasin.filter(e => e.Formation_Name === this.defaultFormation);
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
                                .append("table")
                                .attr("id", "formationListUL")
                                .attr("table-layout", "auto")
                                .attr("width", "100%");

        this.formationList.selectAll("tr")
            .data(this.formationNames)
            .enter()
            .append("tr").append("td").style("padding-left", "15px").text((d) => {return d;})
            .on("click", (d) => { 
                let samplesOfClickedFormation = samplesInBasin.filter(e => e.Formation_Name === d); //d: clicked formation
                let wellDetails = this._setWellDetails(samplesOfClickedFormation, geospatialData);

                //passing samples of clicked formation to the charts
                this.tocChart.update(samplesOfClickedFormation);
                this.vanKrevelenPlot.update(samplesOfClickedFormation, wellDetails);
                this.potentialPlot.update(samplesOfClickedFormation, wellDetails);
                this.inverseKrevPlot.update(samplesOfClickedFormation, wellDetails);

                //passing wells in clicked formation to the legend
                d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
                    this.updateWellsList(samplesOfClickedFormation,geospatialData, wellDetails));});

        // passing wells of default formation
        d3.csv("data/SRCPhase2GeospatialUSA2.csv", geospatialData =>
            this.updateWellsList(this.defaultFormationData,geospatialData, this.wellDetails));
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
    updateWellsList(allWells, geospatialData, details){
        this.selected = [];
        this.wellDetails = this._setWellDetails(allWells, geospatialData);

        //change from ulist to table. We'll need to add a colored circle in the left of the well name
        d3.select("#legendListUL").remove();
        let wellList = d3.select("#legend")
                        .append("table")
                        .attr("id", "legendListUL")
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
                            .attr("id", (d)=>{return d.wellID})
                            .attr("r", 7)
                            .attr("cx", 12.5)
                            .attr("cy", 15.5)
                            .attr("fill", (d) => {
                                let color; 
                                details.forEach( well => {
                                    if(d.wellID === well.wellID){
                                        color = well.unselectedColor;
                                    }})
                                return color;
                            })
                            .attr("stroke", "gray"); 

        wellList.append("td").text((d) => {
                    return d.wellName;})
                .on("click", (d) => {
                    this.updateGraphs(d);});

            /*.on("click", (d) => { 
                let samplesOfClickedFormation = samplesInBasin.filter(e => e.Formation_Name === d); 
                let allWellsInClickedFormation = this._get(samplesOfClickedFormation, 'SRCLocationID')
                let samplesInWell = samplesOfClickedFormation.filter(e => allWellsInClickedFormation.includes(e.SRCLocationID));
                this.updateWellsList(samplesInWell, allWellsInClickedFormation);
            });*/

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

    // click once to select
    // click again to deselect
    updateGraphs(well){
        // Check to see if the wells has already been selected (clicked on)
        if(this.selected.includes(well.wellID)){ 
            let index = this.selected.indexOf(well.wellID);
            if(index >= 0){
                this.selected.splice(index, 1);
            }
        }
        else{
            this.selected.push(well.wellID);
        }
        d3.select("#legend").selectAll("circle")
            .style("opacity", 0.25).attr("stroke", "gray");
        this.selected.forEach(id => {
            d3.select("#legend").selectAll("#"+id).style("opacity", 1).attr("stroke", "black");
        });
        this.vanKrevelenPlot.updateWells(this.selected);
        this.potentialPlot.updateWells(this.selected);
        this.inverseKrevPlot.updateWells(this.selected);

    }
}