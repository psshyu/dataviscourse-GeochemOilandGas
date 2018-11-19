// Scatter plot for OI vs HI
// upper right in reference image

class VanKrevelenPlot{

    constructor(defaultData, defaultFormation, colorScale){


    }

    update(samples, colorScale){

        //filter out data that lacks HI && OI
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Oxygen_Index !== '') return d});
        console.log(samplesWithInformation);




    }
}