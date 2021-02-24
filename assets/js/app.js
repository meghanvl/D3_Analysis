// healthcare vs poverty, smokers vs age, obesity vs income

// svg width and height
const svgWidth = 960;
const svgHeight = 500;

// set margins
const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// svg wrapper and group to hold chart
const svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// x and y choices
const xChoice1 = "poverty";
const xChoice2 = "age";
const xChoice3 = "income";

const yChoice1 = "healthcare";
const yChoice2 = "smokes";
const yChoice3 = "obesity";

// function to update x scale upon click
function xScale(ascData, xChoice1, xChoice2, xChoice3) {
    const xLinearScale1 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[xChoice1]) * 0.8,
            d3.max(ascData, d => d[xChoice1]) * 1.2
        ])
        .range([0, width]);

    const xLinearScale2 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[xChoice2]) * 0.8,
            d3.max(ascData, d => d[xChoice2]) * 1.2  
        ])
        .range([0, width]);

    const xLinearScale3 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[xChoice3]) * 0.8,
            d3.max(ascData, d => d[xChoice3]) * 1.2  
        ])
        .range([0, width]);

    return xLinearScale1, xLinearScale2, xLinearScale3;

}   

// function to update y scale upon click
function yScale(ascData, yChoice1, yChoice2, yChoice3) {
    const yLinearScale1 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[yChoice1]) * 0.8,
            d3.max(ascData, d => d[yChoice1]) *1.2
        ])
        .range([height, 0]);

    const yLinearScale2 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[yChoice2]) * 0.8,
            d3.max(ascData, d => d[yChoice2]) *1.2
        ])
        .range([height, 0]);   
        
    const yLinearScale3 = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[yChoice3]) * 0.8,
            d3.max(ascData, d => d[yChoice3]) *1.2
        ])
        .range([height, 0]);
    
    return yLinearScale1, yLinearScale2, yLinearScale3;

}

// function to update x axis upon click
function renderX(newX, xAxis) {
    const bottomAxis = d3.axisBottom(newX);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;

}

// function to update y axis upon click
function renderY(newY, yAxis) {
    const bottomAxis = d3.axisBottom(newY);

    yAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return yAxis;

}

// update circles
function renderCircles(circlesGroup, newX, xChoice1, xChoice2, xChoice3) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=> newX(d[xChoice1]))
        .attr("cx", d=> newX(d[xChoice2]))
        .attr("cx", d=> newX(d[xChoice3]))


}

