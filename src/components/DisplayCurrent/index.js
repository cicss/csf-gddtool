///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming Growing Degree Day Calculator
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Loader from 'react-loader-advanced';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';
import moment from 'moment';

import '../../styles/DisplayCurrent.css';
import '../../styles/loader.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(ReactHighcharts.Highcharts);

const spinner = <div className="loader"></div>

@inject("store") @observer
class DisplayCurrent extends Component {

  render() {

        if ( (this.props.store.app.currentStatus) && (this.props.store.app.getChartData) ) {

            var data = this.props.store.app.getChartData
            var gdd_thresh = this.props.store.app.getGddType
            let planting_date = this.props.store.app.getPlantingDate
            let year = this.props.store.app.getPlantingYear

            let gdd_labels = {
                'gdd50': 'Base 50',
                'gdd8650': 'Base 8650',
            }

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

            //function daysUntilToday(d) {
            //    let today = moment()
            //    return today.diff(d, 'days')
            //}

            const getXaxisMin = () => {
                let dateActive = this.props.store.app.getPlantingDate;
                return dateActive
            }

            const getXaxisMax = () => {
                let startOfSeason = Date.UTC(year,0,1)
                let endOfSeason = Date.UTC(year,10,1)
                let endOfData = addDays(startOfSeason, data[gdd_thresh]['obs'].length);
                if ( endOfData > endOfSeason ) {
                    return endOfSeason
                } else {
                    return endOfData
                }
            }

            const normalize = (a,v) => {
                let res = a.map( (valueInArray) => { return valueInArray - v } );
                return res
            }

            function tooltipFormatter() {
                var i, item;
                var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d, %Y', this.x) + '</span>';
                var tips = "";
                for (i=0; i<this.points.length; i++) {
                    item = this.points[i];
                    if ( (item.series.name !== "POR Max") && (item.series.name !== "POR Min") && (item.series.name !== "POR") ) {
                        tips += '<br/>' + item.y.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                    if (item.series.name === "POR Min") {
                        tips += '<br/>' + item.y.toFixed(0) + '-';
                    }
                    if (item.series.name === "POR Max") {
                        tips += item.y.toFixed(0) + ' : <span font-size:12px;">Period of Record</span>';
                    }
                }
                return header + tips;
            }

            const afterRender = (chart) => {
                chart.renderer.text(year + ' Current Conditions', 300, 85).css({ color:"#000000", fontSize:"16px" }).add();
            };

            // calculate data array for display: obs, normal, recent
            let dayOfYear = planting_date.dayOfYear()
            let obs = normalize(data[gdd_thresh]['obs'].slice(dayOfYear-1,-1), data[gdd_thresh]['obs'][dayOfYear-1])
            let normal = normalize(data[gdd_thresh]['normal'].slice(dayOfYear-1,-1), data[gdd_thresh]['normal'][dayOfYear-1])
            let recent = normalize(data[gdd_thresh]['recent'].slice(dayOfYear-1,-1), data[gdd_thresh]['recent'][dayOfYear-1])

            // calculate gdd_min and gdd_max, the range for POR
            let avg = normalize(data[gdd_thresh]['avg'].slice(dayOfYear-1,-1), data[gdd_thresh]['avg'][dayOfYear-1])
            let min = data[gdd_thresh]['min'].slice(dayOfYear-1,-1)
            let max = data[gdd_thresh]['max'].slice(dayOfYear-1,-1)
            let por = avg.map( (v, i) => { return [v*min[i], v*max[i]] });
            let gdd_min = avg.map( (v, i) => { return v*min[i] });
            let gdd_max = avg.map( (v, i) => { return v*max[i] });

            var chartConfig = {
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         pointStart: moment(this.props.store.app.getPlantingDate,"MM/DD/YYYY"),
                         pointInterval: 24*3600*1000,
                         animation: { duration: 800 },
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                         },
                         states: {
                             hover: {
                                 enabled: true,
                                 halo: {
                                     size: 0
                                 }
                             }
                         }
                     }
                 },
                 chart: { height: 460, width: 724, marginTop: 60, backgroundColor: null },
                 title: {
                     text: 'Cumulative ' + gdd_labels[this.props.store.app.getGddType] + ' Growing Degree Days'
                 },
                 subtitle: {
                     text: '@ ' + this.props.store.app.getAddress,
                     style:{"font-size":"14px",color:"#000000"},
                 },
                 tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
                   xDateFormat:"%b %d, %Y", positioner:function(){return {x:80, y:60}}, shape: 'rect',
                   crosshairs: { width:1, color:"#ff0000", snap:true, zIndex:12 }, formatter:tooltipFormatter },
                 credits: { text:"Powered by NRCC", href:"http://www.nrcc.cornell.edu/", color:"#000000" },
                 legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
                 xAxis: { type: 'datetime', startOnTick: false, endOnTick: false, min: getXaxisMin(), max: getXaxisMax(), labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
                 yAxis: { title:{ text:'Cumulative GDD', style:{"font-size":"14px", color:"#000000"}}, min: 0, gridZIndex:1, labels:{style:{color:"#000000"}}},
                 series: [{
                     name: "Year to Date", data: obs, type: "line", zIndex: 24, lineWidth: 2, color: "#00dd00", shadow: false, marker: { enabled: true, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" } },{
                     name: "15 Year Average", data: recent, type: "line", zIndex: 23, lineWidth: 2, color: "#0000ff", marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     name: '30 Year "Normal"', data: normal, type: "line", zIndex: 22, lineWidth: 2, color: "#B041FF", marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     //name: "POR Min", data: gdd_min, type: "area", showInLegend: false, zIndex: 10, lineWidth: 2, color: "#444444", fillColor: "#ffffff", fillOpacity: 0.1, marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     //name: "POR Max", data: gdd_max, type: "area", showInLegend: false, zIndex: 8, lineWidth: 2, color: "#444444", fillColor: "#eeeeee", fillOpacity: 0.1, marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     name: "POR Min", data: gdd_min, type: "line", showInLegend: false, zIndex: 10, lineWidth: 2, color: "#444444", marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     name: "POR Max", data: gdd_max, type: "line", showInLegend: false, zIndex: 10, lineWidth: 2, color: "#444444", marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     name: "POR", data: por, type: "arearange", showInLegend: false, zIndex: 10, lineWidth: 2, color: "#444444", fillColor: "#eeeeee", fillOpacity: 0.1, marker: { enabled: false, states: { hover: { enabled: false }} } },{
                     name: "Period of Record", data: {}, color: '#444444', lineWidth: 0, marker : {symbol: 'square', radius: 12 } }
                 ]
            };

            return (
                <div className='current-display-active'>
                  <Loader message={spinner} show={this.props.store.app.getLoaderData} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={true}>
                    <div className="current-display-content">
                      <ReactHighcharts config={ chartConfig } callback={afterRender} isPureConfig />
                    </div>
                  </Loader>
                </div>
            )

        } else {
            return(false)
        }
  }

};

export default DisplayCurrent;
