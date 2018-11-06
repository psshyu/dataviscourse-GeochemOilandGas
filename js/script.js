/**
 * script.js will be called only by index.html, where the visualization will live
 * 
 * Data wrangling can be done here, but can be done elsewhere.
 * 
 * What this script needs is the data in JSON format to pass into other objects.
 *
 */

projection = d3.geoAlbersUsa();


let map = new Map(projection);
let basin = new Basin(projection);
let well = new Well(projection);

//d3.json("data/.....").then( data => {});