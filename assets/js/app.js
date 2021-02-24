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
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// x and y choices
const xChoice = "poverty";
// const xChoice2 = "age";
// const xChoice3 = "income";

const yChoice = "healthcare";
// const yChoice2 = "smokes";
// const yChoice3 = "obesity";

// function to update x scale upon click
function xScale(ascData, xChoice) {
    const xLinearScale = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[xChoice]) * 0.8,
            d3.max(ascData, d => d[xChoice]) * 1.2
        ])
        .range([0, width]);

    // const xLinearScale2 = d3.scaleLinear()
    //     .domain([d3.min(ascData, d => d[xChoice2]) * 0.8,
    //         d3.max(ascData, d => d[xChoice2]) * 1.2  
    //     ])
    //     .range([0, width]);

    // const xLinearScale3 = d3.scaleLinear()
    //     .domain([d3.min(ascData, d => d[xChoice3]) * 0.8,
    //         d3.max(ascData, d => d[xChoice3]) * 1.2  
    //     ])
    //     .range([0, width]);

    return xLinearScale;

}   

// function to update y scale upon click
function yScale(ascData, yChoice) {
    const yLinearScale = d3.scaleLinear()
        .domain([d3.min(ascData, d => d[yChoice]) * 0.8,
            d3.max(ascData, d => d[yChoice]) *1.2
        ])
        .range([height, 0]);

    // const yLinearScale2 = d3.scaleLinear()
    //     .domain([d3.min(ascData, d => d[yChoice2]) * 0.8,
    //         d3.max(ascData, d => d[yChoice2]) *1.2
    //     ])
    //     .range([height, 0]);   
        
    // const yLinearScale3 = d3.scaleLinear()
    //     .domain([d3.min(ascData, d => d[yChoice3]) * 0.8,
    //         d3.max(ascData, d => d[yChoice3]) *1.2
    //     ])
    //     .range([height, 0]);
    
    return yLinearScale;

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
    const leftAxis = d3.axisLeft(newY);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;

}

// update circles
function renderCircles(circlesGroup, newX, xChoice, newY, yChoice) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newX(d[xChoice]))
        .attr("cy", d => newY(d[yChoice]))
        // .attr("cx", d=> newX(d[xChoice2]))
        // .attr("cy", d=> newY(d[yChoice2]))
        // .attr("cx", d=> newX(d[xChoice3]))
        // .attr("cy", d=> newY(d[yChoice3]))
    
    return circlesGroup;
}

function renderText(textGroup, newX, xChoice, newY, yChoice) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newX(d[xChoice]))
        .attr("y", d => newY(d[yChoice]))
        .attr("text-anchor", "middle");

    return textGroup;
}


function updateToolTip(xChoice, yChoice, circlesGroup, textGroup) {
    const xLabel;

    const yLabel;

    if (xChoice === "poverty") {
        xLabel = "In Poverty (%)";
    }
    else if (xChoice === "age") {
        xLabel = "Age (Median)";
    }
    else {
        xLabel = "Household Income (Median)";
    }
    if (yChoice === "healthcare") {
        yLabel = "Lacks Healthcare (%)";
    }
    else if (yChoice === "smokers") {
        yLabel = "Smokes (%)";
    }
    else {
        yLabel = "Obese (%)";
    }

    const toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([90, 90])
        .html(function(d) {
            return (`${d.abbr}<br>${xLabel} ${d[xChoice]}<br>${yLabel} ${d[yChoice]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    
    return circlesGroup;

}

d3.csv("data.csv").then(function(ascData, err) {
    if (err) throw err;

    ascData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokers = +data.smokes;
        data.obesity = +data.obesity;
    });

    const xLinearScale = xScale(ascData, xChoice);

    const yLinearScale = yScale(ascData, yChoice);

    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    const xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(o, ${height})`)
        .call(bottomAxis);
    
    const yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    
    const circlesGroup = chartGroup.selectAll("circle")
        .data(ascData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[xChoice]))
        .attr("cy", d => yLinearScale(d[yChoice]))
        .attr("r", 20)
        .attr("opacity", ".5");

    const xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    const povertyLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");
    
    const ageLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "age")
        .classed("active", true)
        .text("Age");

    const incomeLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "income")
        .classed("active", true)
        .text("Income");

    const yLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    const healthcareLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Healthcare");

    const smokersLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "smokers")
        .classed("active", true)
        .text("Smokers");

    const obesityLabel = yLabels.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "obesity")
        .classed("active", true)
        .text("Obesity");

    const circlesGroup = updateToolTip(xChoice, yChoice, circlesGroup) 

    XLabelsGroup.selectAll("text")
        .on("click", function() {
            const value = d3.select(this).attr("value");

            if (value !== xChoice) {
                xChoice = value;

                xLinearScale = xScale(ascData, xChoice);

                xAxis = renderX(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, xChoice);

                circlesGroup = updateToolTip(xChoice, circlesGroup);

                if (xChoice === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);

                }
                else if (xChoice === "age") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    YLabelsGroup.selectAll("text")
        .on("click", function() {
            const value = d3.select(this).attr("value");

            if (value !== yChoice) {
                xChoice = value;

                yLinearScale = yScale(ascData, yChoice);

                yAxis = renderY(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, yLinearScale, yChoice);

                circlesGroup = updateToolTip(yChoice, circlesGroup);

                if (yChoice === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokersLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else if (yChoice === "smokers") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokersLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokersLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function(error) {
    console.log(error);
});    



