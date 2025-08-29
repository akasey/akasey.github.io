---
title: Nepal Earthquake 2015 Visualization
date: 2015-05-04T20:18:02+00:00
author: Akash Shrestha
layout: post
categories:
  - Random
---

<!-- Leaflet CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
    
<style>
    .container {
        max-width: 1400px;
        margin: 0 auto;
        text-align: center;
    }

    #mapContainer {
        height: 300px;
        width: 100%;
        margin: 20px 0;
        overflow: hidden;
    }

    .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin: 20px 0;
        flex-wrap: wrap;
    }

    /* For information box over map */
    .info-control {
        background: rgba(255, 255, 255, 0.8);
        padding: 4px 16px;
        /* border-radius: 5px; */
        /* box-shadow: 0 2px 5px rgba(0,0,0,0.2); */
        border: 1px solid rgba(0,0,0,0.2);
        /* font-family: Arial, sans-serif; */
        font-size: 12px;
        width: 400px;
        /* text-align: left; */
        color: #4a4a4a;
    }

    .info-control #infoBoxDate {
        text-align: left;
        margin: 0 0 5px 0;
        color: #333;
    }

    /* Custom styles for the progress bar */
    .info-control #infoBoxProgressBarContainer {
        border: 1px solid #0a0a0a;
        height: 5px;
        width: 100%;
        max-width: 400px;
        background-color: #e2e8f0;
        position: relative;
        overflow: hidden;
        border-radius: 8px; /* Added rounded corners */
    }
    
    .info-control #infoBoxProgressBar {
        background-color: #9ec68d;
        height: 100%;
        width: 0%;
        transition: width 0.1s ease-in-out;
        border-radius: 8px; /* Added rounded corners */
    }
    /* End of information box */

    .legend {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 10px 0;
        flex-wrap: wrap;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .legend-circle {
        border-radius: 50%;
        border: 1px solid white;
    }

    /* Custom Leaflet popup styles */
    .leaflet-popup-content-wrapper {
        background: rgba(0,0,0,0.8);
        color: white;
        border-radius: 10px;
    }

    .leaflet-popup-content {
        color: white;
    }

    .leaflet-popup-tip {
        background: rgba(0,0,0,0.8);
    }

    /* Earthquake circle styles */
    .earthquake-marker {
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.8);
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.5);
            opacity: 1;
        }
        70% {
            transform: scale(1);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 0.3;
        }
    }

    .magnitude-1-3 { background: rgba(255, 255, 0, 0.7); }
    .magnitude-4-5 { background: rgba(255, 165, 0, 0.7); }
    .magnitude-6-7 { background: rgba(255, 69, 0, 0.7); }
    .magnitude-8-plus { background: rgba(255, 0, 0, 0.7); }
</style>

<div class="container">
  <div id="mapContainer"></div>

  <div class="legend">
      <div class="legend-item">
          <div class="legend-circle magnitude-1-3" style="width: 20px; height: 20px;"></div>
          <span>Magnitude 1-3</span>
      </div>
      <div class="legend-item">
          <div class="legend-circle magnitude-4-5" style="width: 20px; height: 20px;"></div>
          <span>Magnitude 4-5</span>
      </div>
      <div class="legend-item">
          <div class="legend-circle magnitude-6-7" style="width: 20px; height: 20px;"></div>
          <span>Magnitude 6-7</span>
      </div>
      <div class="legend-item">
          <div class="legend-circle magnitude-8-plus" style="width: 20px; height: 20px;"></div>
          <span>Magnitude 8+</span>
      </div>
  </div>
</div>

<!-- Leaflet JavaScript -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<!-- PapaParse for CSV parsing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

<script>
  class EarthquakeAnimation {
      constructor() {
          this.earthquakes = [];
          this.currentIndex = 0;
          this.isPlaying = false;
          this.speed = 10;
          this.animationId = null;
          this.lastTime = 0;
          this.trailDuration = 3000; // milliseconds
          this.activeMarkers = [];

          this.startTime = 0;
          this.endTime = 0;
          this.paddingMs = 1 * 24 * 60 * 60 * 1000; // how much padding to add before start and after end times in slider
          this.timeSliderTotalSteps = 300000; // total steps in slider that covers from start to end. Reducing makes time go faster
          this.timeSliderUnitStep = 1; // How much time does one step in slider represent. == (end-start)/totalSteps
          this.animationStartTime = -1;
          
          this.initializeMap();
          this.loadEarthquakeData()
              .then(dp => this.processEarthquakeDatapoints(dp))
              .then(_ => this.play());
      }

      initializeMap() {
          // Initialize Leaflet map
          this.map = L.map('mapContainer').setView([20, 0], 2);
          
          // Add tile layer
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 25,
          }).addTo(this.map);

          // Create layer group for earthquake markers
          this.earthquakeLayer = L.layerGroup().addTo(this.map);

          ///// Add information box over the map left-bottom
          // Create a custom control
          var infoControl = L.Control.extend({
              onAdd: function(map) {
                  var div = L.DomUtil.create('div', 'info-control');
                  div.innerHTML = `
                      Time: <strong id="infoBoxDate"></strong>
                      | Earthquakes: <span id="infoBoxEarthquakeCount">0</span> 
                      <div id="infoBoxProgressBarContainer" class="mb-8">
                          <div id="infoBoxProgressBar"></div>
                      </div>
                  `;
                  return div;
              },

              onRemove: function(map) {
                  // Nothing to do here
              }
          });
          // Add the control to the map
          L.control.infoControl = function(opts) {
              return new infoControl(opts);
          }
          L.control.infoControl({ position: 'bottomleft' }).addTo(this.map);
      }

      // Function to fetch and parse the CSV data
      loadEarthquakeData = async () => {
          return new Promise(async (resolve, reject) => {
              try {
                  const response = await fetch('/assets/downloads/nepalEarthquake2015.csv');
                  const csvData = await response.text();

                  Papa.parse(csvData, {
                      header: true,
                      dynamicTyping: true,
                      complete: function (results) {
                          // Filter out any rows with missing or invalid data
                          const datapoints = results.data.filter(d => d.Latitude && d.Longitude && d.Magnitude && d['Date-Time']);
                          console.log(`Loaded csv with ${datapoints.length} datapoints`);
                          resolve(datapoints);
                      }
                  });
              } catch (error) {
                  console.error('Error loading or parsing earthquake data:', error);
                  reject(error);
              }
          });
      }

      processEarthquakeDatapoints = async (datapoints) => {
          return new Promise((resolve, reject) => {
              this.earthquakes = datapoints;
              if (this.earthquakes.length > 0) {
                  // Fit map to earthquake bounds
                  // Following coords are extreme left and right coords of Nepal to ensure whole Nepal is rendered
                  const bounds = L.latLngBounds([[28.065851, 83.147601], [27.831188, 88.168936]]);
                  this.map.fitBounds(bounds);

                  // create timestamps
                  this.earthquakes.forEach(eq => {
                      eq.EpochTime = new Date(eq['Date-Time']).getTime();
                  });
                  // Sort the earthquakes chronologically
                  this.earthquakes.sort((a, b) => a.EpochTime - b.EpochTime);
                  // Set the start and end times for the animation
                  this.startTime = this.earthquakes[0].EpochTime - this.paddingMs;
                  this.endTime = this.earthquakes[this.earthquakes.length - 1].EpochTime + this.paddingMs;

                  this.timeSliderUnitStep = (this.endTime - this.startTime) / this.timeSliderTotalSteps;

                  // Initialize the map and UI with the starting data
                  // updateMarkers(startTime);
              }
              resolve();
          });
      }

      getMagnitudeClass(magnitude) {
          if (magnitude < 3) return 'magnitude-1-3';
          if (magnitude < 5) return 'magnitude-4-5';
          if (magnitude < 7) return 'magnitude-6-7';
          return 'magnitude-8-plus';
      }

      getMagnitudeSize(magnitude) {
          return Math.max(8, Math.min(80, magnitude * 7));
      }

      createEarthquakeMarker(earthquake) {
          const size = this.getMagnitudeSize(earthquake.Magnitude);
          const className = this.getMagnitudeClass(earthquake.Magnitude);
          
          // Create custom HTML marker
          const markerHtml = `<div class="earthquake-marker ${className}" style="width: ${size}px; height: ${size}px;"></div>`;
          
          const marker = L.marker([earthquake.Latitude, earthquake.Longitude], {
              icon: L.divIcon({
                  html: markerHtml,
                  className: 'custom-div-icon',
                  iconSize: [size, size],
                  iconAnchor: [size/2, size/2]
              })
          });

          // Add popup with earthquake information
          const popupContent = `
              <div>
                  <strong>Magnitude ${earthquake.Magnitude}</strong><br>
                  <strong>Location:</strong> ${earthquake.Epicenter}<br>
                  <strong>Coordinates:</strong> ${earthquake.Latitude.toFixed(2)}, ${earthquake.Longitude.toFixed(2)}<br>
                  <strong>Time:</strong> ${new Date(earthquake["Date-Time"]).toLocaleString()}
              </div>
          `;
          marker.bindPopup(popupContent);

          return marker;
      }

      animate(time) {
          if (!this.isPlaying || this.earthquakes.length === 0) return;
          if (this.animationStartTime < 0) {
              this.animationStartTime = time;
          }
          const currentTime = time - this.animationStartTime;

          for (; this.currentIndex < this.earthquakes.length; this.currentIndex++) {
              const earthquake = this.earthquakes[this.currentIndex];
              const normalizedTime = (earthquake.EpochTime - this.startTime);
              
              if (normalizedTime <= currentTime * this.timeSliderUnitStep) {
                  earthquake.displayTime = currentTime;
                  
                  const marker = this.createEarthquakeMarker(earthquake);
                  this.earthquakeLayer.addLayer(marker);
                  
                  this.activeMarkers.push({
                      marker: marker,
                      earthquake: earthquake,
                      displayTime: currentTime
                  });
              } else {
                  break;
              }
          }

          // Remove old earthquake markers (fade out)
          this.activeMarkers = this.activeMarkers.filter(item => {
              const age = currentTime - item.displayTime;
              if (age > this.trailDuration) {
                  this.earthquakeLayer.removeLayer(item.marker);
                  return false;
              }
              
              // Apply fading effect
              const alpha = Math.max(0.2, 1 - (age / this.trailDuration));
              const markerElement = item.marker.getElement();
              if (markerElement) {
                  markerElement.style.opacity = alpha;
              }
              
              return true;
          });

          // Update UI information
          const currentRelativeTime = this.startTime + currentTime * this.timeSliderUnitStep;
          const dateStr = new Date(currentRelativeTime).toISOString().slice(0, 19);
          document.getElementById('infoBoxDate').textContent = dateStr;
          document.getElementById('infoBoxEarthquakeCount').textContent = this.currentIndex + '/' + this.earthquakes.length;
          document.getElementById('infoBoxProgressBar').style.width = ((currentTime / this.timeSliderTotalSteps) * 100) + '%';

          // Check if animation is complete
          if (this.currentIndex >= this.earthquakes.length && this.activeMarkers.length === 0) {
              this.reset();
          }
          this.animationId = requestAnimationFrame((time) => this.animate(time));
      }

      play() {
          if (this.earthquakes.length === 0) {
              console.error('Please load earthquake data first!');
              return;
          }
          
          this.isPlaying = true;
          this.animationId = requestAnimationFrame((time) => this.animate(time));
      }

      reset() {
          this.currentIndex = 0;
          this.animationStartTime = -1;
          if (this.animationId) {
              cancelAnimationFrame(this.animationId);
          }
      }
  }

  // Initialize the animation when the page loads
  window.addEventListener('load', () => {
      new EarthquakeAnimation();
  });
</script>
<!--more-->

This map shows the epicenters of major earthquake and after-shock within one month period (April 25, 2015 - May 26, 2015).

On April 25, 2015, NST 11:56, a major earthquake of magnitude 7.8Mw shook central Nepal killing nearly 9000 people and injuring 20K people.
The after-shocks were felt for whole year.

[wiki](https://en.wikipedia.org/wiki/April_2015_Nepal_earthquake) \| [Download CSV](/assets/downloads/nepalEarthquake2015.csv)
