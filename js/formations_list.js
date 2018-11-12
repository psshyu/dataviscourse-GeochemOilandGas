class Formations_list {

    constructor(colorScale) {

        this.tocChart = new TOC_barchart();
        this.vanKrevelenPlot = new VanKrevelenPlot();
        this.potentialPlot = new PotentialPlot();
        this.inverseKrevPlot = new InverseKrevelen();
        this.legend = new Legend();
        this.colorScale = colorScale;

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
            this.tocChart.update(clickedFormationData,this.colorScale);
            this.vanKrevelenPlot.update(clickedFormationData,this.colorScale);
            this.potentialPlot.update(clickedFormationData,this.colorScale);
            this.inverseKrevPlot.update(clickedFormationData,this.colorScale)
        })




    }
}