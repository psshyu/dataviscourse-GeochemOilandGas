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
                        .attr("height", "65vh")
                        .attr("fill", "none")
                        .attr("stroke","#000")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("vertical-align", "middle")
                        .attr("horizontal-align", "middle");


        this.svg = d3.select("#mapSVG");
        let path = d3.geoPath();


        d3.json("https://unpkg.com/us-atlas@1/us/10m.json", (error, us) => {
            if (error) throw error;
            /**
             * TODO: Draw basins
             * this.svg.append("path")
             * .attr("d", path( <<BASIN PATHS GO HERE>>));
             */
            //Not sure how to call my json from here. are d3.json calls nest-able? Will fix later
            this.svg.append("path")
                .attr("d", path(topojson.feature(us, us.objects.nation)));
            });
    }

    update(){

            //filter data points falling outside geoAlbers projection extent
            //get a wider projection as we have offshore wells in the gulf of mexico (sea) and Cali.
            this.geospatialData = this.geospatialData.filter(d => projection([d.Longitude,d.Latitude])!==null);

            let wells = this.svg.selectAll('circle').data(this.geospatialData);
            wells.exit().remove();
            let new_wells = wells.enter().append('circle');
            wells = new_wells.merge(wells);

            wells
                .attr('cx', d => this.projection([d.Longitude,d.Latitude])[0])
                .attr('cy', d => this.projection([d.Longitude,d.Latitude])[1])
                .attr('r', 2)
                .style('fill','#87CEFA')
    }

}

class Basin {


    constructor(projection) {

        // this.wellObject = wellObject;
        this.svg = d3.select("#mapSVG");
        this.projection = projection;

        d3.json("data/USGS_Provinces_topo.json", (error, basins) => {

            let geojson = topojson.feature(basins, basins.objects.USGS_Provinces);
            let geofeatures = geojson.features;
            let basin_path = d3.geoPath().projection(this.projection);

            this.svg.selectAll('path').data(geofeatures)
                .enter()
                .append('path')

                .attr('d', basin_path)
                .attr('stroke', 'grey');
                // .attr('fill', 'grey');

        })
    }
}
