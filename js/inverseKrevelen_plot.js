// Scatter plot for OI vs HI
// upper right in reference image

class InverseKrevelen{
    mouseOverHandler(d, i){
        let id = d.SRCLocationID+"iVKTip";
        d3.select("#inverseKrevPlot")
            .append("div")
            .attr("class", "plotHover")
            .style("left", d3.event.pageX + 15+"px")
            .style("top", d3.event.pageY+ 15+"px")
            .style("background-color", d3.rgb(255,255,255,0.8))
            .attr("id", id)
            .html(() => { 
                return "<h6>" + d.SRCLocationID + "</h6>"
                    + "<text style='text-align: left;'>Hydrogen Index: "+ d.Hydrogen_Index+"</text>"
                    + "<br>"
                    + "<text style='text-align: left;'>Tmax: "+ d.Tmax_C_Pyrolysis+"</text>"; });
    }

    mouseOutHandler(d, i) {
        let id = d.SRCLocationID+"iVKTip";
        d3.select("#"+id).remove();
    }
    constructor(defaultData, defaultFormation, wellDetails){
        this.defaultData = defaultData;
        this.defaultFormation = defaultFormation;
        this.wellDetails = wellDetails;

        this.margin = {top: 30, right: 30, bottom: 30, left: 30};
        this.width = document.documentElement.clientWidth* 0.30;
        this.height = document.documentElement.clientHeight * 0.45;

        this.svg = d3.select("#inverseKrevPlot")
            .append("svg")
            .attr("id", "inverseKrevPlotSVG")
            .attr("class", "plot");


        // Plot title
        this.svg.append("text")
            .attr("class", "plotTitle")
            .attr("x", this.width/2)
            .attr("y", this.margin.top)
            .text("Maturation");

        //filter out data that lacks HI && OI
        let samplesWithInformation = defaultData.filter(d => {if (d.Hydrogen_Index !== '' && d.Tmax_C_Pyrolysis !== '') return d});


        // X and Y scales 
        this.x = d3.scaleLinear()
                .domain([500, 380])
                .range([this.width - this.margin.right, this.margin.left*2]);
        this.y = d3.scaleLinear()
                .domain([0,900])
                .range([this.height - this.margin.bottom*2, this.margin.top *2]);

        //y gridlines
        this.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate("+ this.margin.right *2+ "," + 0 + ") scale(0.79,1)")
            .call(d3.axisLeft(this.y)
                .tickSize(-this.width, 0, 0)
                .tickFormat("")
            );

        // X-axis
        this.svg.append("g")
            .attr("id", "invKrevPlotX")
            .attr("transform", "translate(0," + parseInt(this.height - this.margin.bottom*2) + ")")
            .call(d3.axisBottom(this.x));
      
        // Y Axis
        this.svg.append("g")
            .attr("id", "invKrevPlotY")
            .attr("transform", "translate("+ this.margin.right * 2 + "," + 0 + ")")
            .call(d3.axisLeft(this.y));

        // Axis labels
        // x
        this.svg.append("text")
            .attr("class", "label")
            .attr("x", this.width/2)
            .attr("y", parseInt(this.height - this.margin.bottom/2))
            .text("Tmax");
        // y
        this.svg.append('text')
            .attr("class", "label")
            .attr('x', -(this.height / 2))
            .attr('y', this.width / 20)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('HI')


        // Scatterplot circles
        this.svg.selectAll("circle")
            .data(samplesWithInformation)
            .enter().append("circle")
            .attr("id", (d)=>{ return d.SRCLocationID; })
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .attr("fill", (d) => { //return "#fddaec";
                let color;
                this.wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){ color = well.color; }})
                return color;})
            .attr("stroke", "gray")
            .attr("r", 5)
            .style("opacity", 1)
            .on("mouseover", this.mouseOverHandler)
            .on("mouseout", this.mouseOutHandler);



        //appending delimiters
        let that = this;
        function _scalePoints(curve){
             let curvex = curve.map((d) => {
                return [that.x(d[0]),that.y(d[1])];});
            return curvex;
        }
        let lineGenerator = d3.line().curve(d3.curveCardinal);

        // curve points
         let curve1 = [[395.03253325621745, 54.655870445344135],
            [397.1818970503181, 65.58704453441351],
            [399.8691440138809, 80.16194331983843],
            [403.6278195488722, 94.73684210526335],
            [407.92220936957773, 109.31174089068872],
            [412.21659919028343, 119.88663967611365],
            [418.64083285135916, 116.59919028340073],
            [422.92004048583, 105.66801619433227],
            [426.12565066512434, 91.09311740890735],
            [429.8626373626374, 69.23076923076951],
            [434.13967611336034, 54.655870445344135],
            [437.881000578369, 40.080971659919214],
            [443.2272990167727, 21.86234817813829],
            [447.5097599768652, 16.39676113360383],
            [450.98864950838635, 10.931174089068918]];
         let curve2 =[[407, 572.0647773279354],
            [411.4032677848468, 557.4898785425103],
            [415.14242336610755, 539.2712550607289],
            [417.27443609022555, 521.0526315789475],
            [419.40427993059575, 499.1902834008099],
            [421.5319548872181, 473.68421052631606],
            [424.19317524580686, 444.53441295546577],
            [427.3705899363794, 382.5910931174092],
            [428.9473684210526, 331.57894736842127],
            [429.9754193175246, 258.70445344129575],
            [430.4916136495084, 225.91093117408946],
            [431.00130133024874, 182.18623481781424],
            [431.5218334297282, 156.6801619433204],
            [432.04236552920764, 131.1740890688261]];
         let curve3 = [[422.3105841526894, 881.7813765182188],
            [426.58111625216884, 856.2753036437248],
            [428.1774146905726, 838.0566801619436],
            [431.8927125506073, 779.757085020243],
            [432.40890688259117, 746.9635627530367],
            [432.6420618854829, 688.6639676113364],
            [432.3308270676692, 615.7894736842106],
            [432.30696934644305, 575.7085020242916],
            [432.537955465587, 513.7651821862348],
            [432.98908328513596, 371.65991902834],
            [432.9673944476576, 335.2226720647775],
            [433.46623770965874, 273.2793522267209],
            [434.77949681897053, 229.55465587044569],
            [436.3627819548872, 189.47368421052624],
            [438.47744360902254, 142.10526315789502],
            [441.13866396761136, 112.95546558704473],
            [444.3399363794101, 91.09311740890735],
            [448.6126373626374, 69.23076923076951],
            [453.95676691729324, 47.368421052631675],
            [459.84311740890683, 36.43724696356321],
            [480.1915847310584, 21.86234817813829],
            [493.85013013302495, 18.218623481781833],
            [497.86798727588206, 18.218623481781833]];
         curve1 = _scalePoints(curve1);
        curve2 = _scalePoints(curve2);
        curve3 = _scalePoints(curve3);
         //generate line
        let path1 = lineGenerator(curve1);
        let path2 = lineGenerator(curve2);
        let path3 = lineGenerator(curve3);

        this.svg.selectAll('.delimiter').remove();
        let paths = [path1, path2, path3];

        for(let i=0; i < paths.length; i++){
            this.svg.append('path')
            .attr('class','delimiter')
            .attr('d', paths[i])
            .style('fill','none')
            .style('stroke','darkred')
            .style('opacity',0.5)
            .style('stroke-width','2px');
        }

//vertical lines
        let lineGeneratorV = d3.line();
        let points=[[this.x(435),this.y(0)],[this.x(435),this.y(900)]];
        let path = lineGeneratorV(points);

        this.svg.append('path')
            .attr('class','vertical')
            .attr('d', path)
            .style('fill','none')
            .style('stroke','grey')
            .style('opacity',0.5)
            .style('stroke-width','1px');

        let points1=[[this.x(465),this.y(0)],[this.x(465),this.y(900)]];
        let pathx = lineGeneratorV(points1);

        this.svg.append('path')
            .attr('class','vertical')
            .attr('d', pathx)
            .style('fill','none')
            .style('stroke','grey')
            .style('opacity',0.5)
            .style('stroke-width','1px');


        //delimiter text
        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(390))
            .attr('y', this.y(800))
            .attr('text-anchor', 'middle')
            .text('Type I');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(385))
            .attr('y', this.y(550))
            .attr('text-anchor', 'middle')
            .text('Type II');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(385))
            .attr('y', this.y(140))
            .attr('text-anchor', 'middle')
            .text('Type III');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(390))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Immature')

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(440))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Mature')

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(470))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Post-mature')



    }

    update(samples, wellDetails){
        let samplesWithInformation = samples.filter(d => {if (d.Hydrogen_Index !== '' && d.Tmax_C_Pyrolysis !== '') return d});


        this.svg.selectAll('.vertical').remove();

//vertical lines
        let lineGeneratorV = d3.line();
        let points=[[this.x(435),this.y(0)],[this.x(435),this.y(900)]];
        let path = lineGeneratorV(points);

        this.svg.append('path')
            .attr('class','vertical')
            .attr('d', path)
            .style('fill','none')
            .style('stroke','grey')
            .style('opacity',0.5)
            .style('stroke-width','1px');

        let points1=[[this.x(465),this.y(0)],[this.x(465),this.y(900)]];
        let pathx = lineGeneratorV(points1);

        this.svg.append('path')
            .attr('class','vertical')
            .attr('d', pathx)
            .style('fill','none')
            .style('stroke','grey')
            .style('opacity',0.5)
            .style('stroke-width','1px');


        //circles
        let c = this.svg.selectAll("circle").data(samplesWithInformation);
        c.exit().remove();
        let newc = c.enter().append('circle');
        c = newc.merge(c);

        this.svg.selectAll("circle")
            .transition()
            .duration(900)
            .attr("id", (d)=>{return d.SRCLocationID})
            .attr("fill", (d,i) => {
                let color;
                wellDetails.forEach( well => {
                    if(d.SRCLocationID === well.wellID){
                        color = well.color;
                    }})
                return color;
            }) 
            .attr("cx", (d) => { return this.x(d.Tmax_C_Pyrolysis); })
            .attr("cy", (d) => { return this.y(d.Hydrogen_Index); })
            .on("end", function() {
                d3.select(this)
                .attr("id", (d)=>{return d.SRCLocationID})
                .attr("fill", (d,i) => {
                    let color;
                    wellDetails.forEach( well => {
                        if(d.SRCLocationID === well.wellID){
                            color = well.color;
                        }})
                    return color;
                });
            });
        this.svg.selectAll("circle")
                .attr("stroke", "gray")
                .attr("r", 5)
                .style("opacity", 1)
                .on("mouseover", this.mouseOverHandler)
                .on("mouseout", this.mouseOutHandler);




        this.svg.selectAll('.delimiterLabel').remove();
        //delimiter text
        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(390))
            .attr('y', this.y(800))
            .attr('text-anchor', 'middle')
            .text('Type I');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(385))
            .attr('y', this.y(550))
            .attr('text-anchor', 'middle')
            .text('Type II');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(385))
            .attr('y', this.y(140))
            .attr('text-anchor', 'middle')
            .text('Type III');

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(390))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Immature')

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(440))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Mature')

        this.svg.append('text')
            .attr("class", "delimiterLabel")
            .attr('x', this.x(470))
            .attr('y', this.y(850))
            .attr('text-anchor', 'middle')
            .text('Post-mature')

        //appending delimiters
        let that = this;
        function _scalePoints(curve){
            let curvex = curve.map((d) => {
                return [that.x(d[0]),that.y(d[1])];});
            return curvex;
        }
        let lineGenerator = d3.line().curve(d3.curveCardinal);

        // curve points
        let curve1 = [[395.03253325621745, 54.655870445344135],
            [397.1818970503181, 65.58704453441351],
            [399.8691440138809, 80.16194331983843],
            [403.6278195488722, 94.73684210526335],
            [407.92220936957773, 109.31174089068872],
            [412.21659919028343, 119.88663967611365],
            [418.64083285135916, 116.59919028340073],
            [422.92004048583, 105.66801619433227],
            [426.12565066512434, 91.09311740890735],
            [429.8626373626374, 69.23076923076951],
            [434.13967611336034, 54.655870445344135],
            [437.881000578369, 40.080971659919214],
            [443.2272990167727, 21.86234817813829],
            [447.5097599768652, 16.39676113360383],
            [450.98864950838635, 10.931174089068918]];
        let curve2 =[[407, 572.0647773279354],
            [411.4032677848468, 557.4898785425103],
            [415.14242336610755, 539.2712550607289],
            [417.27443609022555, 521.0526315789475],
            [419.40427993059575, 499.1902834008099],
            [421.5319548872181, 473.68421052631606],
            [424.19317524580686, 444.53441295546577],
            [427.3705899363794, 382.5910931174092],
            [428.9473684210526, 331.57894736842127],
            [429.9754193175246, 258.70445344129575],
            [430.4916136495084, 225.91093117408946],
            [431.00130133024874, 182.18623481781424],
            [431.5218334297282, 156.6801619433204],
            [432.04236552920764, 131.1740890688261]];
        let curve3 = [[422.3105841526894, 881.7813765182188],
            [426.58111625216884, 856.2753036437248],
            [428.1774146905726, 838.0566801619436],
            [431.8927125506073, 779.757085020243],
            [432.40890688259117, 746.9635627530367],
            [432.6420618854829, 688.6639676113364],
            [432.3308270676692, 615.7894736842106],
            [432.30696934644305, 575.7085020242916],
            [432.537955465587, 513.7651821862348],
            [432.98908328513596, 371.65991902834],
            [432.9673944476576, 335.2226720647775],
            [433.46623770965874, 273.2793522267209],
            [434.77949681897053, 229.55465587044569],
            [436.3627819548872, 189.47368421052624],
            [438.47744360902254, 142.10526315789502],
            [441.13866396761136, 112.95546558704473],
            [444.3399363794101, 91.09311740890735],
            [448.6126373626374, 69.23076923076951],
            [453.95676691729324, 47.368421052631675],
            [459.84311740890683, 36.43724696356321],
            [480.1915847310584, 21.86234817813829],
            [493.85013013302495, 18.218623481781833],
            [497.86798727588206, 18.218623481781833]];
        curve1 = _scalePoints(curve1);
        curve2 = _scalePoints(curve2);
        curve3 = _scalePoints(curve3);
        //generate line
        let path1 = lineGenerator(curve1);
        let path2 = lineGenerator(curve2);
        let path3 = lineGenerator(curve3);

        this.svg.selectAll('.delimiter').remove();
        let paths = [path1, path2, path3];

        for(let i=0; i < paths.length; i++){
            this.svg.append('path')
                .attr('class','delimiter')
                .attr('d', paths[i])
                .style('fill','none')
                .style('stroke','darkred')
                .style('opacity',0.5)
                .style('stroke-width','2px');
        }



    }
    updateWells(selectedWells){
        this.svg.selectAll("circle")
                .style("opacity", 0.25)
                .attr("stroke", "white")
                .on("mouseover", null)
                .on("mouseout", null);
        selectedWells.forEach(id => {
            this.svg.selectAll("#"+id).raise(); //brings the selected elements to the top
            this.svg.selectAll("#"+id)
                    .style("opacity", 1)
                    .attr("stroke", "black")
                    .on("mouseover", this.mouseOverHandler)
                    .on("mouseout", this.mouseOutHandler);
        });
    }
}