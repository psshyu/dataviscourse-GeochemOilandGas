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
    constructor() {
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

        this.projection = d3.geoAlbersUsa();


        d3.json("https://unpkg.com/us-atlas@1/us/10m.json", (error, us) => {
            if (error) throw error;
            /**
             * TO DO: Draw basins
             * this.svg.append("path")
             * .attr("d", path( <<BASIN PATHS GO HERE>>));
             */
            //Not sure how to call my json from here. Is it nest-able? Will fix later
            this.svg.append("path")
                .attr("d", path(topojson.feature(us, us.objects.nation)));
            });


        d3.json("data/USGS_Provinces_topo.json", (error, basins) => {

            let geojson = topojson.feature(basins, basins.objects.USGS_Provinces);
            let geofeatures = geojson.features;
            let basin_path = d3.geoPath().projection(this.projection);

            this.svg.selectAll('path').data(geofeatures)
                .enter()
                .append('path')

                .attr('d',basin_path)
                .attr('stroke','brown')
                .attr('fill','grey');

        console.log(geojson);
        });



        console.log("done rendering map");
    }

}

class Basin {
    constructor(){
        
    }
}