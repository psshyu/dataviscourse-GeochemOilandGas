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
                    let samplesOfClickedFormation = samplesInBasin.filter(e => e.Formation_Name === d); //d: clicked formation
                    let allWellsInClickedFormation = this._get(samplesOfClickedFormation, 'SRCLocationID');//all wells in clicked formation

                    // let samplesInWell = samplesOfClickedFormation.filter(e => allWellsInClickedFormation.includes(e.SRCLocationID));//?

                    d3.csv("data/SRCPhase2GeospatialUSA2.csv", function(geospatialData){
                        formationList.updateWellsList(allWellsInClickedFormation,geospatialData);});



                });

        let wellsInDefaultFormation = this._get(this.defaultFormationData, 'SRCLocationID');
        // let samplesInDefaultFormationWells =  this.defaultFormationData.filter(e => wellsInDefaultFormation.includes(e.SRCLocationID));
        this.updateWellsList(wellsInDefaultFormation);
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

    updateWellsList(allWells,geospatialData){

        //look for well name in geospatil table
        //read in data


        console.log(geospatial);
        console.log(this._get(geospatial,'Well_Name'));



        d3.select("#legendListUL").remove();
        
        let wellList = d3.select("#legend")
                            .append("ul")
                            .attr("id", "legendListUL");
        wellList.selectAll("li")
            .data(allWells)
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
        let dummyString = well + " was selected!";
        console.log(dummyString);
        //this.tocChart.update(well);
        this.inverseKrevPlot.update(well);
        //this.legend = new Legend(this.defaultFormationData, this.defaultFormation, this.colorScale);
        //this.vanKrevelenPlot = new VanKrevelenPlot(this.defaultFormationData, this.defaultFormation, this.colorScale);
        this.potentialPlot.update(well);
    }
}