// healthcare vs poverty, smokers vs age, obesity vs income

// function to make page responsive, resizes chart
function makeResponsive() {
    // 
    let svgArea = d3.select("body").select("svg");

    // clear svg if it's not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // svg container width and height
    let svgWidth = 970;
    let svgHeight = 550;

    // set margins 
    let margin = {
        top: 20,
        right: 100,
        bottom: 80,
        left: 100
    };

    // chart area minus margins 
    let width = svgWidth - margin.left - margin.right;
    let height = svgHeight - margin.top - margin.bottom;

    // svg wrapper and group to hold chart
    let svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // append group element
    let chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // x and y initial parameters
    let xChoice = "poverty";
    let yChoice = "healthcare";


    // function to update x scale upon click on x-axis label
    function xScale(ascData, xChoice) {
        // create scales
        let xLinearScale = d3.scaleLinear()
            .domain([d3.min(ascData, d => d[xChoice]) * 0.8,
                d3.max(ascData, d => d[xChoice]) * 1.2
            ])
            .range([0, width]);

        return xLinearScale;
    }   

    // function to update y scale upon click on y-axis label
    function yScale(ascData, yChoice) {
        let yLinearScale = d3.scaleLinear()
            .domain([d3.min(ascData, d => d[yChoice]) * 0.8,
                d3.max(ascData, d => d[yChoice]) *1.2
            ])
            .range([height, 0]);

        return yLinearScale;
    }

    // function to update x axis upon click
    function renderX(newX, xAxis) {
        let bottomAxis = d3.axisBottom(newX);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

        // function to update y axis upon click
    function renderY(newY, yAxis) {
        let leftAxis = d3.axisLeft(newY);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // update circles group with transition
    function renderCircles(circlesGroup, newX, xChoice, newY, yChoice) {
        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newX(d[xChoice]))
            .attr("cy", d => newY(d[yChoice]))
    
        return circlesGroup;
    }

    // update the text in circles
    function renderText(textGroup, newX, xChoice, newY, yChoice) {
        textGroup.transition()
            .duration(1000)
            .attr("x", d => newX(d[xChoice]))
            .attr("y", d => newY(d[yChoice]))
            .attr("text-anchor", "middle");

        return textGroup;
    }

    // update circles group with new tooltip
    function updateToolTip(xChoice, yChoice, circlesGroup, textGroup) {
        let xLabel;

        let yLabel;

        if (xChoice === "poverty") {
            xLabel = "In Poverty (%)";
        }
        else if (xChoice === "age") {
            xLabel = "Age (Median)";
        }
        else {
            xLabel = "Income (Median)";
        }
        if (yChoice === "healthcare") {
            yLabel = "Healthcare (%)";
        }
        else if (yChoice === "smokes") {
            yLabel = "Smokes (%)";
        }
        else {
            yLabel = "Obese (%)";
        }

        // initialize tooltip
        let toolTip = d3.tip()
            .attr("class", "tooltip d3-tip")
            .offset([90, 90])
            .html(function(d) {
                return (`State: ${d.state}<br>${xLabel}: ${d[xChoice]}<br>${yLabel}: ${d[yChoice]}`);
            });

        circlesGroup.call(toolTip);

        // circles mouseover event
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // mouseout event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
        
        // text mousover event and mouseout
        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })

            .on("mouseout", function(data) {
                toolTip.hide(data);
            })
    
        return circlesGroup;

    }

    // get data from csv file
    d3.csv("assets/data/data.csv").then(function(ascData, err) {
        if (err) throw err;

        // parse data as integers
        ascData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });

        // scale functions
        let xLinearScale = xScale(ascData, xChoice);
        let yLinearScale = yScale(ascData, yChoice);

        // initial axis functions
        let bottomAxis = d3.axisBottom(xLinearScale);
        let leftAxis = d3.axisLeft(yLinearScale);

        // append x-axis
        let xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
    
        // append y-axis
        let yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // append initial circles
        let circlesGroup = chartGroup.selectAll("stateCircle")
            .data(ascData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[xChoice]))
            .attr("cy", d => yLinearScale(d[yChoice]))
            .attr("class", "stateCircle")
            .attr("r", 15)
            .attr("opacity", ".95");
    
        // append initial text in circles
        let textGroup = chartGroup.selectAll("stateText")
            .data(ascData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[xChoice]))
            .attr("y", d => yLinearScale(d[yChoice]*.98))
            .text(d => (d.abbr))
            .attr("class", "stateText")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");

        // group for x-axis labels
        let xLabelGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        let povertyLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("Poverty (%)");
    
        let ageLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");

        let incomeLabel = xLabelGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");

        // group for y-axis labels
        let yLabelGroup = chartGroup.append("g")
            .attr("transform", `translate(-25, ${height / 2})`);
    
        let healthcareLabel = yLabelGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -20)
            .attr("value", "healthcare")
            .classed("axis-text", true)
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        let smokersLabel = yLabelGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -40)
            .attr("value", "smokes")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Smokes (%)");

        let obesityLabel = yLabelGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0)
            .attr("y", -60)
            .attr("value", "obesity")
            .classed("axis-text", true)
            .classed("inactive", true)
            .text("Obese (%)");
     
        // x-axis labels event listener
        xLabelGroup.selectAll("text")
            .on("click", function() {
                // first get the value
                let value = d3.select(this).attr("value");

                if (value !== xChoice) {
                    // replaces chosen x-axis with value
                    xChoice = value;

                    // updates x scale with new data
                    xLinearScale = xScale(ascData, xChoice);

                    // updates x-axis with transition
                    xAxis = renderX(xLinearScale, xAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, xChoice, yLinearScale, yChoice);

                    textGroup = renderText(textGroup, xLinearScale, xChoice, yLinearScale, yChoice);

                    circlesGroup = updateToolTip(xChoice, yChoice, circlesGroup, textGroup);

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

        yLabelGroup.selectAll("text")
            .on("click", function() {
                let value = d3.select(this).attr("value");

                if (value !== yChoice) {
                    yChoice = value;

                    yLinearScale = yScale(ascData, yChoice);

                    yAxis = renderY(yLinearScale, yAxis);

                    circlesGroup = renderCircles(circlesGroup, xLinearScale, xChoice, yLinearScale, yChoice);

                    textGroup = renderText(textGroup, xLinearScale, xChoice, yLinearScale, yChoice);

                    circlesGroup = updateToolTip(xChoice, yChoice, circlesGroup, textGroup);

                    // changes classes to bold text
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
                    else if (yChoice === "smokes") {
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
    });


}   

makeResponsive();

d3.select(window).on("resize", makeResponsive);



