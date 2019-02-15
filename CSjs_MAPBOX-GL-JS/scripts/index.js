/*
/////////////////////////////////////////////////////////////////////////////////////////////////////////

{{ CityScope Choice Models }}
Copyright (C) {{ 2018 }}  {{ Ariel Noyman }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

/////////////////////////////////////////////////////////////////////////////////////////////////////////

"@context": "https://github.com/CityScope/", "@type": "Person", "address": {
"@type": "75 Amherst St, Cambridge, MA 02139", "addressLocality":
"Cambridge", "addressRegion": "MA",}, 
"jobTitle": "Research Scientist", "name": "Ariel Noyman",
"alumniOf": "MIT", "url": "http://arielnoyman.com", 
"https://www.linkedin.com/", "http://twitter.com/relno",
https://github.com/RELNO]

///////////////////////////////////////////////////////////////////////////////////////////////////////
*/

import "babel-polyfill";
//Import Storage class
import "./Storage";
import { Maptastic } from "./maptastic";

async function init() {
  // cityio update interval
  var interval = 1000;

  //GET CITYIO
  var tableName = window.location.search.substring(1);
  if (tableName == "") {
    console.log("using default cityIO endpoint");
    tableName = "grasbrook";
  }
  let cityIOtableURL =
    "https://cityio.media.mit.edu/api/table/" + tableName.toString();

  Storage.cityIOurl = cityIOtableURL;
  //call server once at start, just to init the grid
  const cityIOjson = await getCityIO(cityIOtableURL);
  //save to storage
  Storage.cityIOdata_OLD = null;

  Storage.cityIOdata = cityIOjson;

  console.log("cityIO first read", Storage.cityIOdata);

  //run the update
  window.setInterval(update, interval);

  //make the mapbox gl base map
  makeMap();

  let mapDIV = document.querySelector("#mapDIV");
  // maptastic the div
  Maptastic(mapDIV);
}

//start applet
window.onload = init();

///////////////////////////////////////////////////////////////////////////////////////////////////////

// using https://github.com/peterqliu/threebox

import "babel-polyfill";
import "./Storage";

import { SpriteText2D, textAlign } from "three-text2d";

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeMap() {
  let cityIOdata = Storage.cityIOdata;
  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;

  var mapDIV = document.createElement("div");
  mapDIV.className = "mapDIV";
  mapDIV.id = "mapDIV";
  document.body.appendChild(mapDIV);

  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag";
  var scence_origin_position = [table_lat, table_lon, 0];

  var map = new mapboxgl.Map({
    container: "mapDIV",
    style: "mapbox://styles/relnox/cjs5fbcl40prk1fkagpti0h8h",
    //  "mapbox://styles/relnox/cjs55hrkv11x61fp4h9bslg5j",
    // "mapbox://styles/mapbox/dark-v9",
    center: [scence_origin_position[0], scence_origin_position[1]],
    bearing: 0,
    pitch: 0,
    zoom: 13
  });

  map.on("style.load", function() {
    map.addLayer({
      id: "custom_layer",
      type: "custom",
      onAdd: function(map, gl) {
        onAdd(map, gl);
      },
      render: function(gl, matrix) {
        threebox.update();
      }
    });
  });

  function onAdd(map, mbxContext) {
    window.threebox = new Threebox(map, mbxContext);
    threebox.setupDefaultLights();
    console.log(threebox);

    // adds the 3d cityscope gemoerty

    threebox.addAtCoordinate(
      create_threeJS_grid_form_cityIO()[0],
      scence_origin_position,
      {
        preScale: 1
      }
    );

    // //adds the text gemoerty
    // threebox.addAtCoordinate(
    //   create_threeJS_grid_form_cityIO()[1],
    //   scence_origin_position,
    //   {
    //     preScale: 1
    //   }
    // );

    // add the scene objects to storage for later update
    Storage.threeGrid = threebox.scene.children[0].children[1].children[0];
  }
  Storage.map = map;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * makes the initial 3js grid of meshes and texts
 * @param sizeX, sizeY of grid
 */
function create_threeJS_grid_form_cityIO() {
  let cityIOdata = Storage.cityIOdata;
  //build threejs initial grid on load

  //get table dims
  var grid_columns = cityIOdata.header.spatial.ncols;
  var grid_rows = cityIOdata.header.spatial.nrows;
  var cell_size_in_meters = cityIOdata.header.spatial.cellSize;
  var cell_rescale_precentage = 0.85;
  var this_mesh = null;
  var three_grid_group = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //converted 35deg to radians in an ugly way
  var grid_rotation_for_table = degree_to_rads(
    cityIOdata.header.spatial.rotation
  );

  var z_height_of_mesh = 1;
  var three_text_group = new THREE.Object3D();

  //loop through grid rows and cols and create the grid

  for (var this_row = 0; this_row < grid_rows; this_row++) {
    for (var this_column = 0; this_column < grid_columns; this_column++) {
      geometry = new THREE.BoxBufferGeometry(
        cell_size_in_meters * cell_rescale_precentage,
        cell_size_in_meters * cell_rescale_precentage,
        z_height_of_mesh
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: "red"
      });
      //make mesh for cell
      this_mesh = new THREE.Mesh(geometry, material);

      this_mesh.position.set(
        this_column * -cell_size_in_meters,
        this_row * cell_size_in_meters,
        0
      );
      three_grid_group.add(this_mesh);

      //make text over geometry cell
      let text_object = create_threeJS_text_from_cityIO("null", "black");
      text_object.name = "text";
      text_object.scale.set(0.05, 0.05, 0.05);
      text_object.position.set(
        this_mesh.position.x,
        this_mesh.position.y,
        this_mesh.position.z
      );
      three_text_group.add(text_object);
    }
  }
  // very bad!! using hardcode rotation
  three_grid_group.rotation.setFromVector3(
    new THREE.Vector3(0, 0, grid_rotation_for_table)
  );
  //rotates the text gorup the same way
  three_text_group.rotation.setFromVector3(
    new THREE.Vector3(0, 0, grid_rotation_for_table)
  );
  // adds this groups to storage for later updates
  Storage.threeGrid = three_grid_group;
  Storage.threeText = three_text_group;
  return [three_grid_group, three_text_group];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function degree_to_rads(angle) {
  return angle * (Math.PI / 180);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//TEXT OVER
function create_threeJS_text_from_cityIO(text_string, three_text_color) {
  var three_text_object = new SpriteText2D(text_string, {
    align: textAlign.center,
    font: "50px helvetica",
    fillStyle: three_text_color,
    antialias: true
  });
  return three_text_object;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Update the grid in fixed intervals
// should adapt a more passive updating approach

function update_grid_from_cityio() {
  var array_of_types_and_colors = [
    {
      type: "Road",
      color: "rgb(100,100,100)",
      height: 0
    },
    {
      type: "Open Space",
      color: "rgb(0,240,30)",
      height: 0
    },
    {
      type: "live",
      color: "rgb(100, 50, 170)",
      height: 30
    },
    {
      type: "work",
      color: "rgb(244,0,255)",
      height: 100
    },
    {
      type: "Work 2",
      color: "rgb(255,0,150)",
      height: 50
    }
  ];

  let cityIOdata = Storage.cityIOdata;
  let grid = Storage.threeGrid;
  let textHolder = Storage.threeText;

  for (let i = 0; i < grid.children.length; i++) {
    //cell edit
    let thisCell = grid.children[i];
    //clear the text obj
    textHolder.children[i].text = " ";

    if (cityIOdata.grid[i] !== -1) {
      thisCell.material.color.set(
        array_of_types_and_colors[cityIOdata.grid[i]].color
      );

      let this_cell_height =
        array_of_types_and_colors[cityIOdata.grid[i]].height + 1;
      thisCell.scale.z = this_cell_height;
      thisCell.position.z = this_cell_height / 2;
      thisCell.material.opacity = 0.6;

      //cell's text
      textHolder.children[i].text = i;
      // array_of_types_and_colors[cityIOdata.grid[i]].type;
      textHolder.children[i].position.z = this_cell_height + 5;
    } else {
      // hide the non-read pixels undergound
      thisCell.position.z = 0;
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * controls the cityIO streeam
 */
async function update() {
  // get cityIO url from storage
  let cityIOtableURL = Storage.cityIOurl;
  // put cityIO data to storage after it's updated
  Storage.cityIOdata = await getCityIO(cityIOtableURL);

  // check for new cityIO data stream
  if (
    Storage.cityIOdata_OLD !== null &&
    Storage.cityIOdata.meta.id.toString() ===
      Storage.cityIOdata_OLD.meta.id.toString()
  ) {
    return;
  } else {
    // compare the two data sets
    Storage.cityIOdata_OLD = Storage.cityIOdata;
    //update the grid props
    update_grid_from_cityio();
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * get cityIO method [uses polyfill]
 * @param cityIOtableURL cityIO API endpoint URL
 */
async function getCityIO() {
  let cityIOtableURL = Storage.cityIOurl;
  // console.log("trying to fetch " + cityIOtableURL);
  return fetch(cityIOtableURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      // console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      return cityIOdata;
    });
}
