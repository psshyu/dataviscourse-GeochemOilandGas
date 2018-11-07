/**
 * We should have all the classes for the map here.
 * 
 * This includes the map itself, as well as the basins
 * 
 */

class Map {
    /**
     * not sure of the exact params that should be passed into the constructor right now
     */
    constructor(projection, geospatialData, tocChart, vanKrevPlot, potentialPlot, inverseKrevPlot) {

        this.projection = projection;
        this.geospatialData = geospatialData;
        this.tocChart = tocChart;
        this.vanKrevPlot = vanKrevPlot;
        this.potentialPlot = potentialPlot;
        this.inverseKrevPlot = inverseKrevPlot;

        let svg = d3.select("#map")
                    .append("svg")
                        .attr("id", "mapSVG")
                        .attr("width","65vw")
                        .attr("height", "80vh")
                        .attr("fill", "none")
                        .attr("stroke","#000")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("vertical-align", "middle")
                        .attr("horizontal-align", "middle");


        this.svg = d3.select("#mapSVG");

        
        //let path = d3.geoPath();


        //d3.json("https://unpkg.com/us-atlas@1/us/10m.json", (error, us) => {
         //   if (error) throw error;
            /**
             * TODO: Draw basins
             * this.svg.append("path")
             * .attr("d", path( <<BASIN PATHS GO HERE>>));
             */
            //Not sure how to call my json from here. are d3.json calls nest-able? Will fix later
         //   this.svg.append("path")
          //      .attr("d", path(topojson.feature(us, us.objects.nation)));
          //  }
           // );

        /*
         *TODO:
         * Generate a color palette/scale for at least 50 (maybe?) differentiable colors
         */
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //dummy color scale
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);


    }

    update(){

            //filter wells falling outside geoAlbers projection extent
            //get a wider projection as we have offshore wells in the gulf of mexico (sea) and Cali?
            //GeoAlbers will return null if well falls outside the US
            this.geospatialData = this.geospatialData.filter(d => projection([d.Longitude,d.Latitude])!==null);

            let wells = this.svg.selectAll('circle').data(this.geospatialData);
            wells.exit().remove();
            let new_wells = wells.enter().append('circle');
            wells = new_wells.merge(wells);
        console.log('drawing basins');
            wells
                .attr('cx', d => this.projection([d.Longitude,d.Latitude])[0])
                .attr('cy', d => this.projection([d.Longitude,d.Latitude])[1])
                .attr('r', 1.5)
                .style('fill','#87CEFA')
                .attr('stroke-width',0.2);
    }

}

class Basin {


    constructor(projection) {

        // this.wellObject = wellObject;
        this.svg = d3.select("#mapSVG");
        this.projection = projection;

        function mouseOverHandler(d, i){
            d3.select(this).attr('fill', 'white');

            let name = d.properties.Name;
            let id = name.replace(/\s/g,'');  

            d3.select("#mapSVG").append("text").attr("y", "47.5vh").attr("id", id)
             .text((d) => { return name; });
        }
        function mouseOutHandler(d, i) {
            d3.select(this).attr('fill', 'grey');

            let name = d.properties.Name;
            let id = "#" + name.replace(/\s/g,''); 
            d3.select(id).remove();
        }
        d3.json("data/USGS_Provinces_topo.json", (error, basins) => {

            let geojson = topojson.feature(basins, basins.objects.USGS_Provinces);
            let geofeatures = geojson.features;
            let basin_path = d3.geoPath().projection(this.projection);

            this.svg.selectAll('path').data(geofeatures)
                .enter()
                .append('path')
                .attr('d', basin_path)
                .style("fill-opacity", 0.1)
                .attr('fill','#373737')
                .attr('stroke', 'grey')
                .on('mouseover', mouseOverHandler)
                .on('mouseout', mouseOutHandler);

            this.update()});
    }


    update(){
        let that = this;
        let basins = this.svg.selectAll('path');
        basins
            .on('click', function(d){
                /*
                *load the geochemical csv data and pass the samples (rows) that correspond to the clicked basin to the plots and charts objects
                *The key column in common in both tables is:  the 'USGS_Province' column (geochem.csv) and 'Name' column (USGS_Provinces.json)
                */
                d3.csv("data/SRCPhase2GeochemUSA2.csv", geospatialData => {

                    let samplesInClickedBasin = geospatialData.filter(e=>e.USGS_province === d.properties.Name);
                    console.log(that.tocChart); //prints undefined. Could you take a look at this, please?
                    that.tocChart.update(samplesInClickedBasin, that.colorScale);
                    that.vanKrevPlot.update(samplesInClickedBasin,that.colorScale);
                    that.potentialPlot.update(samplesInClickedBasin,that.colorScale);
                    that.inverseKrevPlot.update(samplesInClickedBasin,that.colorScale);
                });

            });

    }
}
