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
        d3.json("https://unpkg.com/us-atlas@1/us/10m.json", (error, us) => {
            if (error) throw error;
            /**
             * TO DO: Draw basins
             * this.svg.append("path")
             * .attr("d", path( <<BASIN PATHS GO HERE>>));
             */
            this.svg.append("path")
                .attr("d", path(topojson.feature(us, us.objects.nation)));
            });

        console.log("done rendering map");
    }

}

class Basin {
    constructor(){
        
    }
}