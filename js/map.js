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
    constructor(projection, geospatialData) {

        this.projection = projection;
        this.geospatialData = geospatialData;

        let svg = d3.select("#map")
                    .append("svg")
                        .attr("id", "mapSVG")
                        .attr("width","65vw")
                        .attr("height", "70vh")
                        .attr("fill", "none")
                        .attr("stroke","#000")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("vertical-align", "middle")
                        .attr("horizontal-align", "middle");


        this.svg = d3.select("#mapSVG");

        // this.basin_group = this.svg.append('g').attr('id','basin_group');

    }

    update(){

            //filter wells falling outside geoAlbers projection extent
            this.geospatialData = this.geospatialData.filter(d => projection([d.Longitude,d.Latitude])!==null);
            //filter wells falling outside of basin classification
            this.geospatialData = this.geospatialData.filter(d => d.USGS_Province!==0);

            let wells = this.svg.selectAll('circle').data(this.geospatialData);
            wells.exit().remove();
            let new_wells = wells.enter().append('circle');
            wells = new_wells.merge(wells);

            wells
                .attr('cx', d => this.projection([d.Longitude,d.Latitude])[0])
                .attr('cy', d => this.projection([d.Longitude,d.Latitude])[1])
                .attr('r', 1.5)
                .style('fill','#008080')
                .attr('stroke-width',0.2);

    }

}

class Basin {
    //when a basin is clicked
    constructor(projection) {

        //this.formationsList = formationsList;
        // this.legend = legend;
        this.svg = d3.select("#mapSVG");
        this.projection = projection;

        //draw basins from topojson

        d3.json("data/USGS_Provinces_topo.json", (error, basins) => {

            let geojson = topojson.feature(basins, basins.objects.USGS_Provinces);
            let geofeatures = geojson.features;
            let basin_path = d3.geoPath().projection(this.projection);


            this.svg.selectAll('path').data(geofeatures)
                .enter()
                .append('path')
                .attr('d', basin_path)
                .attr('id', (d) => {
                    let name = d.properties.Name;
                    return "basin-"+name.replace(/\s/g,'');
                })
                .style("fill-opacity", 0.05)
                .attr('fill','#373737')
                .attr('stroke', 'grey')
                .on('mouseover', mouseOverHandler)
                .on('mouseout', mouseOutHandler)
                .on('click', clickHandler);

            let graticule = d3.geoGraticule();
            this.svg.append('path')
                .datum(graticule)
                .attr('class', "graticule")
                .attr('d', basin_path)
                .attr('fill', 'none');

        });

        function clickHandler(d, i) {

            d3.csv("data/SRCPhase2GeochemUSA2.csv", geospatialData => {
                //remove the plot
                d3.select("#tocBarchartSVG").remove();
                d3.select("#vanKrevelenPlotSVG").remove();
                d3.select("#potentialPlotSVG").remove();
                d3.select("#inverseKrevPlotSVG").remove();

                // remove formation list and legend
                d3.select("#legendListUL").remove();
                d3.select("#formationListUL").remove();
                
                let samplesInClickedBasin = geospatialData.filter(e=>e.USGS_province === d.properties.Name);
                //console.log(samplesInClickedBasin);
                
                //let name = d.properties.Name.replace(/\s/g,'');
                //console.log(formationsList);
                //that.formationsList.update(samplesInClickedBasin);
                //formationsList.update(samplesInClickedBasin)

                //color scale to be used across charts/legend
                let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
                let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];
                let colorScale = d3.scaleQuantile();

                //console.log(d);
                //console.log(samplesInClickedBasin);
                
                let formations = new formationList(samplesInClickedBasin, colorScale);
   
            });
        }

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


    }


    update(){

        //highlight when a basin polygon is clicked

    }
}
