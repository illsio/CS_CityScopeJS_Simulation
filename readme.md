# CityScopeJS Tables Modules

This repo contains several examples for deployable CityScopeJS table for web/browser environment. These modules can be used 'out of the box' with any modern web browser. Modules are designed to work best with [CityScopeJS](https://github.com/CityScope/CS_cityscopeJS) but will accept any cityIO data if properly formulated.

Each module should include at least:

- CityScope grid retrieved from cityIO server on interval
- Visual rep. of cityIO data feature [3d model, land use or other]
- Analysis of grid+spatial data, such as: walkability, energy, mobility etc.

### Requirements (for both modules):
install nodejs (version 10 tested) ('apt install nodejs'), which include npm
install parcel-bundler ('npm install -g parcel-bundler')

## module CSjs_WALK
This module include an html5 3D view of walkabilty of a zone...
![CSjs_WALK screenshot](https://user-images.githubusercontent.com/3581513/48592867-b2b72980-e94a-11e8-8971-cdb2ce081b0d.png)
It converts 4x4 lego bricks color coded as this: "0000000000000000","1111111111111111","0000000011111111","1111111100000000", into grid type "P","W",L,"G", respectively, and show these value as overlay on the map. (see associated json setting file: https://github.com/CityScope/CS_CityScopeJS_Tables/blob/master/CSjs_WALK/CSJS_WALK.json )

### Get and run the app
'git clone https://github.com/CityScope/CS_CityScopeJS_Tables.git'
'cd CS_CityScopeJS_Tables-master/CSjs_WALK'
edit scripts/index.js line 48 to set the table name you want visualize.
Check two line above in the same file (line 50) the url of the backend server you want to use.
Run 'parcel index.html'
Usage: Left-click and drop for rotate the camera, right click and drop to move the view, mousewheel for zoom.

## module CSjs_Mobcho
This module include a html5 3d render of... the wanted zone in mapbox (you need an account, a API key, and to set your coordinates in index.js, for that), then add as overlay the data from a physical table.

![MobCho screenshot](https://user-images.githubusercontent.com/3581513/48668160-3148ce00-eae7-11e8-82db-43fed34ffbb1.png)
### Get and run the app
'git clone https://github.com/CityScope/CS_CityScopeJS_Tables.git' if its not already done
'cd CS_CityScopeJS_Tables-master/CSjs_MobCho'
edit index.js line 44 to set the table name you want visualize.
Check three line above in the same file (line 47) the url of the backend server you want to use.
Run 'parcel index.html'
Usage: Left-click and drop for rotate the camera,  mousewheel for zoom.

#### how to build a table module with `parcel` into GitHub pages

- make an empty `gh-pages` branch and push it to GH

- Build production into `dist` folder:

  - use `GH.sh` to build the a local `dist` folder
  - make changes to `.sh` to fit static `https` and Table location

