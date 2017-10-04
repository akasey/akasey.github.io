---
title: Tic-Tac-Toe
date: 2017-10-01T00:00:00+00:00
author: Akash Shrestha
layout: post
categories:
  - Random
---

Here's little AI for tic-tac-toe game. Game tree search algorithm that I used is Negamax with alpha-beta pruning.



<div id='game' style="width:100%; margin:auto; text-align:center;" >

<canvas id='canvas' width='300' height='300'></canvas>

</div>

<input type="button" onclick="reset()" value="Reset"/>
<div id='game-msg' style="font-size: 18px; color: red;"></div>

<script type="text/javascript">

var TicTacToeRender=function(){function t(t){this.context=t,me="x",turn="o",this.tGame=new TicTacToe(me,turn),this.algorithm=new NegaMax,this.draw(),me==turn&&this.makeOurMove()}return t.prototype.theirTurn=function(){return this.tGame.whoseTurn!=this.tGame.me},t.prototype.makeOurMove=function(){var t=this.algorithm.negamax(this.tGame,10,"-Infinity","Infinity");return null==t[1]?!1:"over"==t[1].data?"Game Over":(this.tGame.makeMove(t[1]),this.draw(),!0)},t.prototype.handle=function(t,e){if(this.theirTurn()){var n=3*e+t,o=new Move(n);return this.tGame.isOver()?"Game Over":this.tGame.canMakeMove(o)?(this.tGame.makeMove(o),this.draw(),this.makeOurMove()):"Not Blank"}return!1},t.prototype.draw=function(){this.context.clearRect(0,0,canvas.width,canvas.height);var t,e,n,o=0;for(this.context.beginPath();2>o;o++)t=100+100*o,this.context.moveTo(t,0),this.context.lineTo(t,300);for(o=0;2>o;o++)e=100+100*o,this.context.moveTo(0,e),this.context.lineTo(300,e);for(this.context.strokeStyle="#000000",this.context.stroke(),this.context.closePath(),n=this.tGame.getPositions(),o=0;9>o;o++)t=o%3|0,e=o/3|0,"x"===n[o]?this.drawX(t,e):"o"===n[o]&&this.drawO(t,e)},t.prototype.drawX=function(t,e){var n,o,i=0;for(this.context.beginPath(),i=0;2>i;i++)n=100*t+10+80*i,o=100*e+10,this.context.moveTo(n,o),n=100*t+90-80*i,o=100*e+90,this.context.lineTo(n,o);this.context.strokeStyle="#ff0000",this.context.stroke(),this.context.closePath()},t.prototype.drawO=function(t,e){this.context.beginPath(),this.context.arc(100*t+50,100*e+50,40,0,6.28,!1),this.context.strokeStyle="#00ff00",this.context.stroke(),this.context.closePath()},t}(),Move=function(){function t(t){this.data=t}return t}(),TicTacToe=function(){function t(t,e){this.positions=["","","","","","","","",""],this.me=t,this.whoseTurn=e}return t.prototype.isOver=function(){return null!=this.getUtility()},t.prototype.getMoves=function(){for(var t=this.locations(""),e=[],n=0,o=t;n<o.length;n++){var i=o[n],r=new Move;r.data=i,e.push(r)}return e},t.prototype.makeMove=function(t){this.positions[t.data]=this.whoseTurn,this.changePlayer()},t.prototype.unMakeMove=function(t){this.positions[t.data]="",this.changePlayer()},t.prototype.changePlayer=function(){this.whoseTurn="x"==this.whoseTurn?"o":"x"},t.prototype.locations=function(t){for(var e=[],n=0;9>n;n++)this.positions[n]==t&&e.push(n);return e},t.prototype.checkWinner=function(t,e){for(var n=0,o=t;n<o.length;n++){var i=o[n],r=i.every(function(t){return e.indexOf(t)>=0});if(r)return!0}return!1},t.prototype.getUtility=function(){if(this.positions.indexOf("")<0)return 0;var t=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],e=this.locations("x"),n=this.locations("o");return this.checkWinner(t,e)?"x"==this.whoseTurn?1:-1:this.checkWinner(t,n)?"o"==this.whoseTurn?1:-1:null},t.prototype.getPositions=function(){return this.positions},t.prototype.canMakeMove=function(t){return""==this.positions[t.data]},t}(),NegaMax=function(){function t(){}return t.prototype.negamax=function(t,e,n,o){if(t.isOver()||0==e)return[t.getUtility(),null];for(var i="-Infinity",r=null,s=0,a=t.getMoves();s<a.length;s++){var h=a[s];t.makeMove(h);var c=this.negamax(t,e-1,-o,-n);if(t.unMakeMove(h),null!=c[0]&&(c[0]=-c[0],c[0]>i&&(i=c[0],r=h),n=Math.max(i,n),n>=o))break}return[i,r]},t}();window.onload=function(){var t=document.getElementById("canvas"),e=t.getContext("2d"),n=new TicTacToeRender(e),o=document.getElementById("game-msg");handleClick=function(t){var e,i;e=t.offsetX/100|0,i=t.offsetY/100|0;var r=n.handle(e,i);return console.log("return",r),"string"==typeof r&&(o.innerHTML=r),!0},reset=function(){n=new TicTacToeRender(e)},t.addEventListener("click",handleClick,!1)};

</script>