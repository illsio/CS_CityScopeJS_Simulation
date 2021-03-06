# CityScopeJS Table Simulation Modules

This repo contains a few boilerplate examples for CityScopeJS tables in web/browser environment. These modules should run 'out of the box' with any modern web browser. Modules are designed to work best with [CityScopeJS](https://github.com/CityScope/CS_cityscopeJS) but should accept any cityIO data if properly structured.

Modules are built to represent:

- CityScope grid retrieved from cityIO server on interval
- Visual rep. of cityIO data feature [3d model, land use or other]
- Analysis of grid+spatial data, such as: walkability, energy, mobility etc.

### Requirements (for all modules):

- nodejs (version 10 tested) (`apt install nodejs`), which include `npm`
- parcel-bundler (`npm install -g parcel-bundler`)

---

## Walkability Module

This module include an html5 3D view of walkability of a zone:
It converts 4x4 lego bricks color coded as this:

```
 "0000000000000000","1111111111111111","0000000011111111","1111111100000000"
```

into grid type "P","W",L,"G", respectively, and show these value as overlay on the map.

## ![](https://raw.githubusercontent.com/wiki/CityScope/CS_CityScopeJS_Simulation/img/WALK.gif)

---

## CityScopeJS Table-top Module - Vanilla Js & ES6

This is a boilerplate table module that reads cityIO data, parse it into visual grid and display it on a keystone-able div. It's meant for testing of your cityIO sent data and for further development.

![](https://raw.githubusercontent.com/wiki/CityScope/CS_CityScopeJS_Simulation/img/GENERIC.png)

### Usage

- Clone, build and run using `parcel index.html`
- Add your cityIO endpoint table name after the URL `http://your.domian.end.point/?__YOUR_TABLE_NAME__` to retrieve specific table instance
- Use `shift+z` to start projection mapping functionality

---
