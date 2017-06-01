---
title: Conway's game of life
date: 2017-03-21T00:18:02+00:00
author: Akash Shrestha
layout: post
categories:
  - Random
---

[About Conway's game of life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life)

#### Four simple rules: 

* Any alive cell with less than two alive neighbours dies.
* Any alive cell with two or three alive neighours lives on for next generation.
* Any alive cell with more than three alive neighbours dies.
* Any dead cell with three alive neighbour becomes alive for next generation.

<!--more-->
<canvas id="game" style="opacity:0.3; position:absolute; top:0; left:0;">

        Your browser does not support html5 canvas
</canvas>
<script type="text/javascript">
var Cell=function(a,b){var c=this;return c.isAlive=!1,c.x=a,c.y=b,c.neighbors=null,c.countNeighbors=function(){return c.neighbors.filter(function(a){return a.isAlive}).length},c.lifetime=0,c.lifetimePlusPlus=function(){c.lifetime<2&&c.lifetime++},c},Grid=function(a,b){for(var c=this,d=new Array(a*b),f=0;f<a;f++)for(var g=0;g<b;g++)!function(){d[f+g*a]=new Cell(f,g)}();return d.forEach(function(a){a.neighbors=d.filter(function(b){var c=Math.abs(b.x-a.x),d=Math.abs(b.y-a.y);return 1===c&&1===d||1===c&&0===d||0===c&&1===d})}),c.filter=function(a){return d.filter(a)},c.updateLiving=function(){var a=d.filter(function(a){return a.isAlive&&a.countNeighbors()>3}),b=d.filter(function(a){return a.isAlive&&a.countNeighbors()<2}),c=d.filter(function(a){return!a.isAlive&&3===a.countNeighbors()}),e=d.filter(function(a){return a.isAlive&&(2===a.countNeighbors()||3===a.countNeighbors())});a.concat(b).forEach(function(a){a.lifetime=0,a.isAlive=!1}),c.forEach(function(a){a.isAlive=!0}),e.forEach(function(a){a.lifetimePlusPlus(),a.isAlive=!0})},c.getCell=function(b,c){return d[b+c*a]},c},App=function(a,b,c){var d="#009688",e=["#80CBC4","#B2DFDB","#E0F2F1"],f=this;f.canvas=document.getElementById(a),f.ctx=f.canvas.getContext("2d"),viewWidth=f.canvas.width=window.innerWidth,viewHeight=f.canvas.height=window.innerHeight,b=b||20,c=c||20;var g=f.canvas.width/b,h=g,i=new Grid(b,c),j=[[1,5],[1,6],[2,5],[2,6],[11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],[21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],[25,6],[25,7],[35,3],[35,4],[36,3],[36,4]],k=[[50,40],[50,41],[51,40],[51,41]];f.dummyInit=function(a){a.forEach(function(a){i.getCell(a[0],a[1]).isAlive=!0})};var l=!1;f.mouseclicks=[];var m=function(a){var b=a.pageX-f.canvas.offsetLeft,c=a.pageY-f.canvas.offsetTop,d=Math.floor(b/g),e=Math.floor(c/h);f.mouseclicks.push([d,e]),i.getCell(d,e).isAlive=!0};return window.onresize=function(a){viewWidth=f.canvas.width=window.innerWidth,viewHeight=f.canvas.height=window.innerHeight},f.canvas.addEventListener("mousedown",function(a){l=!0,m(a),f.canvas.addEventListener("mousemove",m)}),f.canvas.addEventListener("mouseup",function(a){l=!1,f.canvas.removeEventListener("mousemove",m)}),f.start=function(){f.dummyInit(j),f.dummyInit(k),setInterval(function(){f.update(),f.draw()},20),setInterval(function(){f.dummyInit(k)},1e3)},f.update=function(){i.updateLiving()},f.draw=function(){f.ctx.fillStyle="white",f.ctx.fillRect(0,0,f.canvas.width,f.canvas.height),i.filter(function(a){return a.isAlive}).forEach(function(a){var b=2;f.ctx.fillStyle=d,f.ctx.fillRect(a.x*g,a.y*h,g,h),f.ctx.fillStyle=e[a.lifetime],f.ctx.fillRect(a.x*g+b,a.y*h+b,g-2*b,h-2*b)})},f},app=new App("game",100,50);app.start();
</script>
