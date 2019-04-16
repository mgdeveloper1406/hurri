'use strict';
import './style.scss';

import React from 'react';
import * as d3 from 'd3';

const y

class BarChart extends React.PureComponent {

    constructor(props){
        super(props);

        console.log('init Bar Chart', this.props);
    };

    drawChart(){

        const containerId = this.props.id;
        const container = document.getElementById(containerId);

        container.innerHTML = '';

        const margin = {top: 5, right: 10, bottom: 20, left: 30};
        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const parseDate = d3.isoParse;
        const fieldNameForXAxis = this.props.fieldNameForXAxis;
        const fieldNameForYAxis = this.props.fieldNameForYAxis;
        const xAxisValue = {};
        const data = this.props.data.map(d=>{
            
            d[fieldNameForXAxis] = parseDate(d[fieldNameForXAxis]);

            const day = d[fieldNameForXAxis].getDay();

            if(!xAxisValue[day]){
                xAxisValue[day] = d[fieldNameForXAxis];
            }

            return d;
        });

        const xAxisTickVals = Object.keys(xAxisValue).map(key=>{
            return xAxisValue[key];
        });
        
        const xScale = d3.scaleBand().rangeRound([0, width], .05).padding(0.05);
        const yScale = d3.scaleLinear().range([height, 0]);
        const yScaleMax = d3.max(data, function(d) { return d[fieldNameForYAxis]; });
        xScale.domain(data.map(function(d) { return d[fieldNameForXAxis]; }));
        // TODO: need to calc the max value fo y scale
        yScale.domain([0, yScaleMax < .5 ? .5 : yScaleMax]);

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickValues(xAxisTickVals)
            .tickFormat(d3.timeFormat("%a %m/%d"));

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);
        
        const svg = d3.select("#" + containerId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
            // .selectAll("text")
            // .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", "-.55em")
            // .attr("transform", "rotate(-90)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            // .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("dy", ".71em")
            // .style("text-anchor", "end")
            // .text(chartType);

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return xScale(d[fieldNameForXAxis]); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d[fieldNameForYAxis]); })
            .attr("height", function(d) { return height - yScale(d[fieldNameForYAxis]); })
            .on('click', function(d){
                // console.log('chart on click >>>', d.date.getTime(), d.date);
            });

        // console.log(container.offsetWidth, container.offsetHeight);
    }; 

    updateChart(){

    };

    componentDidMount(){
        // this.drawChart();
    };

    componentDidUpdate(prevProps){

        if(prevProps.data !== this.props.data){
            console.log('bar chart data is updated', this.props.data);
            this.drawChart();
        }
    }

    render(){
        return (
            <div id={this.props.id} 
                style={{
                    width: this.props.width,
                    height: this.props.height,
            }}></div>);
    };

};

export default BarChart;