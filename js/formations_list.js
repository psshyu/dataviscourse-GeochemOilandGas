class formationList {

    constructor(samplesInBasin, colorScale, geospatialData) {
        this.samplesInBasin = samplesInBasin;
        this.colorScale = colorScale;

        let wellAttr = ['Hydrogen_Index', 'Oxygen_Index',
                        'TOC_Percent_Measured', 'Tmax_C_Pyrolysis',
                        'S1__mgHC_gmrock_', 'S2__mgHC_gmrock_'];

        // filter out only the samples that have at least one of the attributes we're looking at (in wellAttr)
        this.samplesInBasin = this.samplesInBasin.filter(e => new Set(wellAttr.map( f => { return e[f]; })).size > 1);

        // list of wells the user has clicked on
        this.selected = [];

        // list of formations in the clicked basin
        this.formationNames = this._get(this.samplesInBasin, 'Formation_Name');
        //ignore unknown formations
        this.formationNames.pop();

        // defaults - the formation that is initially displayed when a basin is clicked
        this.defaultFormation = this.formationNames[0];
        this.defaultFormationData = this.samplesInBasin.filter(e => e.Formation_Name === this.defaultFormation);
        this.wellDetails = this._setWellDetails(this.defaultFormationData,geospatialData);

        // instantiate charts with default information
        this.tocChart = new TOC_barchart(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.inverseKrevPlot = new InverseKrevelen(this.defaultFormationData, this.defaultFormation, this.wellDetails);
        this.vanKrevelenPlot = new VanKrevelenPlot(this.defaultFormationData, this.defaultFormation, this.wellDetails);
        this.potentialPlot = new PotentialPlot(this.defaultFormationData, this.defaultFormation, this.wellDetails);

        //passing samples of default formation
        // this.tocChart.update(this.defaultFormationData);


        /* ******************************************* */

        // Create list of formations
        this.formationList = d3.select("#formationList")
                                .append("table")
                                .attr("id", "formationListUL")
                                .attr("table-layout", "auto")
                                .attr("width", "100%");

        // row for each formation
        this.formationList.selectAll("tr")
            .data(this.formationNames)
            .enter()
            .append("tr").append("td").style("padding-left", "15px").text((d) => {return d;})
            .on("click", (d) => { 
                let samplesOfClickedFormation = this.samplesInBasin.filter(e => e.Formation_Name === d); //d: clicked formation
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

    /**
     * creates a list of dictionaries containing all the unique wells in a formation to ensure consistency in color
     * and referencing
     * 
     * each dictionary entry is as follows:
     * {'wellID' : SRCLocationID
     *  'wellName' : Well_Name OR Outcrop
     *  'color' : hex from d3.schemePastel1 }
     * 
     */
    _setWellDetails(wellsInSample, geospatialData){
        let wellDetails = [];
        let wellSet = [];
        wellsInSample.forEach( well => {
            for (let i = 0; i < geospatialData.length; i++){
                let row = geospatialData[i];
                if (row.SRCLocationID === well.SRCLocationID && wellSet.includes(well.SRCLocationID) == false){
                    let details = {};
                    details['wellID'] = well.SRCLocationID;
                    if (row.Data_Type === 'Well'){ details['wellName'] = row.Well_Name;}
                    else { details['wellName'] = row.Outcrop; }
                    details['color'] = this.colorScale(i); 
                    wellDetails.push(details);
                    wellSet.push(well.SRCLocationID); 
                }}});
        return wellDetails;
    }
    updateWellsList(allWells, geospatialData, details){
        this.selected = [];
        this.wellDetails = this._setWellDetails(allWells, geospatialData);

        // creating legend for wells
        d3.select("#legendListUL").remove();
        let wellList = d3.select("#legend")
                        .append("table")
                        .attr("id", "legendListUL")
                        .attr("table-layout", "auto")
                        .attr("width", "100%");
        // well row 
        wellList = wellList.selectAll("tr")
                    .data(this.wellDetails)
                    .enter()
                    .append("tr");

        // the circle part of the legend with the color
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
                                        color = well.color;
                                    }})
                                return color;
                            })
                            .attr("stroke", "gray"); 

        // tack on the well name as text
        wellList.append("td").text((d) => {
                    return d.wellName;})
                .attr("id", (d) => {return "legend"+d.wellID;})
                .on("click", (d) => {
                    // Check to see if the wells has already been selected (clicked on)
                    if(this.selected.includes(d.wellID)){ 
                        let index = this.selected.indexOf(d.wellID);
                        if(index >= 0){
                            this.selected.splice(index, 1);
                            d3.select("#legend"+d.wellID).style("font-weight", "normal");
                        }
                    }
                    else{
                        this.selected.push(d.wellID);
                        d3.select("#legend"+d.wellID).style("font-weight", "bold");
                    }
                    
                    this.updateGraphs(d);
                });
    }

    // click once to select
    // click again to deselect
    updateGraphs(well){
        // update legend
        d3.select("#legend").selectAll("circle")
            .style("opacity", 0.25).attr("stroke", "gray");
        this.selected.forEach(id => {
            d3.select("#legend").selectAll("#"+id).style("opacity", 1).attr("stroke", "black");
        });
        this.tocChart.updateWells(this.selected);
        this.vanKrevelenPlot.updateWells(this.selected);
        this.potentialPlot.updateWells(this.selected);
        this.inverseKrevPlot.updateWells(this.selected);

    }
}