
class Map {

    constructor(projection, geospatialData) {

        this.projection = projection.scale(1500);
        this.geospatialData = geospatialData;

        let svg = d3.select("#map")
                    .append("svg")
                        .attr("id", "mapSVG")
                        .attr("width","90vw")
                        .attr("height", "90vh")
                        .attr("fill", "none")
                        .attr("stroke","#000")
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("vertical-align", "middle")
                        .attr("horizontal-align", "middle");


        this.svg = d3.select("#mapSVG").append('g').attr("id", "mapWellsGroup");

        //filter wells falling outside geoAlbers projection extent
        this.geospatialData = this.geospatialData.filter(d => projection([d.Longitude,d.Latitude])!==null);
        //filter wells falling outside of basin classification
        this.geospatialData = this.geospatialData.filter(d => d.USGS_Province!==0);

        let wells = this.svg.selectAll('circle').data(this.geospatialData).enter()
        
        wells.append('circle')
            .attr('cx', d => this.projection([d.Longitude,d.Latitude])[0])
            .attr('cy', d => this.projection([d.Longitude,d.Latitude])[1])
            .attr('r', 1.5)
            .style('fill','#008080')
            .attr('stroke-width',0.2);

        let xCenter = document.documentElement.clientWidth * 0.15;
        let yCenter = document.documentElement.clientHeight * 0.15;
        this.svg.attr("transform", "translate("+ xCenter +", " + yCenter+ ") " + "scale("+1.05+")");
    }

}

class Basin {

    constructor(projection) {

        this.svg = d3.select("#mapSVG").append("g").attr("id", "mapBasinsGroup");;
        this.projection = projection;

        //draw basins from topojson

        d3.json("data/USGS_Provinces_topo.json", (error, basins) => {

            let geojson = topojson.feature(basins, basins.objects.USGS_Provinces);
            let geofeatures = geojson.features;
            let basin_path = d3.geoPath().projection(this.projection);


            this.svg.selectAll('.basins')
                .data(geofeatures)
                .enter()
                .append('path')
                .attr('d', basin_path)
                .attr('id', (d) => {
                    let name = d.properties.Name;
                    return "basin-"+name.replace(/\s/g,'');
                })
                .style("fill-opacity", 0.05)
                .attr('fill','#575757')
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
                
            let xCenter = document.documentElement.clientWidth * 0.15;
            let yCenter = document.documentElement.clientHeight * 0.15;
            this.svg.attr("transform", "translate("+ xCenter +", " + yCenter+ ") " + "scale("+1.05+")");

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

                //color scale to be used across charts/legend
                let colorScale = d3.scaleOrdinal(d3.schemePastel1);
                //let selectedColorScale = d3.scaleOrdinal(d3.schemeSet1);
                let formations = new formationList(samplesInClickedBasin, colorScale, geospatialData);
                d3.select("#screen1").style("display", "none");
                d3.select("#screen2").style("display", "block");
   
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
}
