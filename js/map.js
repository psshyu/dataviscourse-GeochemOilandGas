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
                        .attr("height", "70vh")
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

            wells
                .attr('cx', d => this.projection([d.Longitude,d.Latitude])[0])
                .attr('cy', d => this.projection([d.Longitude,d.Latitude])[1])
                .attr('r', 1.5)
                .style('fill','#008080')
                .attr('stroke-width',0.2)
                .on("mouseover", (d) => {console.log(d)});
    }

}

class Basin {
    //when a basin is clicked,
    constructor(projection, geospatialData, tocChart, vanKrevPlot, potentialPlot, inverseKrevPlot) {
        this.svg = d3.select("#mapSVG");
        this.projection = projection;
        this.geospatialData = geospatialData;
        this.tocChart = tocChart;
        this.vanKrevPlot = vanKrevPlot;
        this.potentialPlot = potentialPlot;
        this.inverseKrevPlot = inverseKrevPlot;

        //dummy color scale
        let domain = [0, 10];
        let range = [0, 10];
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

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


            //this.update(tocChart, vanKrevPlot, potentialPlot, inverseKrevPlot)
        
        });

        function clickHandler(d, i) {

            let that = this;
            //console.log(projection);
            d3.select("#chart1").style("background-color", "black");

            let geoPath = d3.geoPath();
            // console.log(d.geometry.coordinates);
            //let zoomInPath = d3.geoPath().projection(d.geometry);
            let zoomInPath = geoPath(d.geometry);
            //console.log("zoom", d.geometry);
            let mini = d3.select("#info").append("svg").attr("width", "33vw").attr("height", "33vh");

            mini.append('path').attr('d', zoomInPath).attr("transform", "translate(1000, -200) scale(6)").attr("fill", "#373737");

            d3.csv("data/SRCPhase2GeochemUSA2.csv", geospatialData => {
                let samplesInClickedBasin = geospatialData.filter(e=>e.USGS_province === d.properties.Name);
                //console.log(samplesInClickedBasin);
                
                let name = d.properties.Name.replace(/\s/g,'');

                //temporary
                //Shouldn't a click on a basin only update the already-created objects? Here we are creating objects at every click.
                //As this is working, I'll just work from here for now.

                let tocChart = new TOC_barchart();
                let vanKrevelenPlot = new VanKrevelenPlot();
                let potentialPlot = new PotentialPlot();
                let inverseKrevPlot = new InverseKrevelen();

                tocChart.update(samplesInClickedBasin,that.colorScale);
                vanKrevelenPlot.update(samplesInClickedBasin,that.colorScale);
                potentialPlot.update(samplesInClickedBasin,that.colorScale);
                inverseKrevPlot.update(samplesInClickedBasin,that.colorScale);


                // console.log(d.geometry);

                // console.log(d3.select("#basin-"+name));
                //console.log(d.geometry.coordinates);
                //let zoomInPath = d3.geoPath().projection(d.geometry);
                //console.log(zoomInPath);
                //let mini = d3.select("#info").append("svg").attr("width", "33vw").attr("height", "33vh");
                //mini.append("path").attr("d", d3.geoPath().projection(d.geometry));
                

                //this.tocChart.update(samplesInClickedBasin, this.colorScale);         
            });
        }

    }


    update(tocChart, vanKrevPlot, potentialPlot, inverseKrevPlot){

        let that =this;
        let basins = this.svg.selectAll('path');

        basins
            .on('click', (d) => {
                /*
                *load the geochemical csv data and pass the samples (rows) that correspond to the clicked basin to the plots and charts objects
                *The key column in common in both tables is:  the 'USGS_Province' column (geochem.csv) and 'Name' column (USGS_Provinces.json)
                */
                d3.csv("data/SRCPhase2GeochemUSA2.csv", geospatialData => {
                    // console.log(geospatialData);
                    // console.log("update basins");
                    let samplesInClickedBasin = geospatialData.filter(e=>e.USGS_province === d.properties.Name);

                    // console.log(samplesInClickedBasin);
                    let temptocChart = new TOC_barchart();
                    //temptocChart = tocChart;
                    temptocChart.update(samplesInClickedBasin, this.colorScale);
                   /* vanKrevPlot.update(samplesInClickedBasin,this.colorScale);
                    potentialPlot.update(samplesInClickedBasin,this.colorScale);
                    inverseKrevPlot.update(samplesInClickedBasin,this.colorScale);*/
                });

            });

    }
}
