const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

fetch(dataURL) 
  .then((response) => response.json())
  .then((data) => {
    heatMapGraph(data);
  });

let heatMapGraph = (data) => {
  const width = 1200;
  const height = 700;
  const padding = 60;
  const legendPaddingX = 350;
  const legendPaddingY = 25;
  
  //generate svg
  const svg = d3
     .select('.graphic-container')
     .append('svg')
     .attr('width', width)
     .attr('height', height)
  
  //generate scale 
  const legendValues = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
  
  const getYear = data['monthlyVariance'].map((element) => {
    return element['year'];
  })
  
  const getMonth = data['monthlyVariance'].map((element) => {
    return element['month'];
  })
  
  const legendScale = d3
    .scaleOrdinal()
    .domain(legendValues)
    .range([0, 30, 60, 90, 120, 150, 180, 210, 240, 270])
  
  const xScale = d3
    .scaleBand()
    .domain(getYear)
    .range([padding, width - padding])
  
  const yScale = d3
    .scaleBand()
    .domain(getMonth)
    .range([height - padding, padding])
  
  //generate legend-axis
  const legendAxis = d3.axisBottom(legendScale);
  
  svg
    .append('g')
    .attr('id', 'legend-axis')
    .attr("transform", `translate(${width - legendPaddingX}, ${legendPaddingY})`)
    .call(legendAxis);
  
  //generate x-axis
  const xAxis = d3.axisBottom(xScale).tickValues(
      xScale.domain().filter((element) => {
        return element % 10 === 0;
      })
    );
  
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);
  
  //generate y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
      let format = d3.timeFormat('%B');
      return format(new Date(0,month,0,0,0,0));
    });
  
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr("transform", `translate( ${padding}, 0)`)
    .call(yAxis);
  
  //generate legend
  const legend = d3
    .select('svg')
    .append('g')
    .attr('id', 'legend')
    .selectAll('rect')
    .data([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .enter()
    .append('rect')
    .attr('x', (d, i) => 30 * i + width - legendPaddingX)
    .attr('y', legendPaddingY - 20)
    .attr('width', 30)
    .attr('height', 20)
    .attr('fill', (d) => {
      if(d === 1) {
        return '#344CB7';
      } else if(d === 2) {
        return '#1363DF';
      } else if(d === 3) {
        return '#47B5FF';
      } else if(d === 4) {
        return '#C4DDFF';
      } else if(d === 5) {
        return '#FFEA85';
      } else if(d === 6) {
        return '#FFD93D';
      } else if(d === 7) {
        return '#FF884B';
      } else if(d === 8) {
        return '#FF731D';
      } else {
        return '#E21818';
      }
    });
  
  //generate tooltip
  let tooltip = d3
    .select('.graphic-container')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)
  
  //generate map
  svg
    .selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('x', (d) => xScale(d['year']))
    .attr('y', (d) => yScale(d['month']))
    .attr('width', (width - (2 * padding)) / (d3.max(getYear) - d3.min(getYear)))
    .attr('height', (height - (2 * padding)) / 12)
    .attr('data-year', (d) => d['year'])
    .attr('data-month', (d) => d['month'] - 1)
    .attr('data-temp', (d) => data['baseTemperature'] + d['variance'])
    .attr("fill", (d) => {
      let temp = data['baseTemperature'] + d['variance'];
    
      if(temp < 3.9) {
        return '#344CB7';
      } else if(temp >= 3.9 && temp < 5) {
        return '#1363DF';
      } else if(temp >= 5 && temp < 6.1) {
        return '#47B5FF';
      } else if(temp >= 6.1 && temp < 7.2) {
        return '#C4DDFF';
      } else if(temp >= 7.2 && temp < 8.3) {
        return '#FFEA85';
      } else if(temp >= 8.3 && temp < 9.5) {
        return '#FFD93D';
      } else if(temp >= 8.3 && temp < 10.6) {
        return '#FF884B';
      } else if(temp >= 10.6 && temp < 11.7) {
        return '#FF731D';
      } else {
        return '#E21818';
      }
    })
    .on("mouseover", function(d) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        tooltip.transition()
                 .duration(100)
                 .style("opacity", 0.9);
        tooltip.style("left", d3.event.pageX + 20 + "px")
                 .style("top", d3.event.pageY + 20 + "px")
                 .attr("data-year", d['year']);
        tooltip.html(months[d['month'] - 1] + ' ' + d['year'] + '<br/>' + d3.format('.1f')(data['baseTemperature'] + d['variance']) + '℃' + '<br/>' + d3.format('+.2f')(d['variance']) + '℃');
     })
     .on("mouseout", function() {
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
      });
}