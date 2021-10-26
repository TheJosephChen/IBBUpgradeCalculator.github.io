(function(){

    //Globals
    var RADIO_INDEX = 0;
    var CURRENT_BALL_INDEX;
    var PERF_PRES_1 = false;
    var PERF_PRES_2 = false;

    // array sizes equal to number of slots
    const SLOTS = 11;
    var PURCHASES = [null, null, null, null, null, null, null, null, null, null, null];
    var PURCHASE_COSTS = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];


    // On Document ready
    $(document).ready(function() {
            // disable calculator forms
            $("#upgrades input").prop("disabled", true);
            $("#upgrades select").prop("disabled", true);
            $("#upgrades button").prop("disabled", true);

            // add event listener to radio buttons
            $("input[name='unlock']").click(displaySelection);

            // set hidden default option for ball select
            $ballOptions = $("#ballOptions");
            var defaultOption = document.createElement("option");
            defaultOption.style.display = "none";
            ballOptions.add(defaultOption);

            // add event listener to ball select
            $("#ballOptions").change(setupCalculator);

            // add event listener to calculator inputs
            $("input[name='level']").change(calculateLevelCost);
            $("input[name='speed']").change(calculateSpeedCost);
            $("select[name='speed']").change(calculateSpeedCost);
            $("input[name='power']").change(calculatePowerCost);

            $("#purchase").click(recordPurchase);
        }
    );


    // Change dropdown selection ball options according to which radio button 
    // is checked
    function displaySelection() {

        var radioButtons = $("#radios input:radio[name='unlock']");
        // record selected radio index in global for use elsewhere
        RADIO_INDEX = radioButtons.index(radioButtons.filter(':checked'));
        
        // show select box
        $ballOptions = $("#ballOptions");
        // $ballOptions.css('visibility', 'visible');
        var selection;
        switch (RADIO_INDEX) {
            case 0:
                selection = ballBasic;
                break;
            case 1:
                selection = ball175;
                break;
            case 2:
                selection = ball75k;
                break;
            case 3:
                selection = ball175k;
                break;
            case 4:
                selection = ball15m;
                break;
            default:
                selection = ball400b;
        }

        // clear previous selections, keeping only the empty default
        for (var i = ballOptions.options.length - 1; i > 0; i--) {
            ballOptions.options.remove(i);
        }

        // add current selections
        for (var i = 0; i < selection.length; i++) {
            var option = document.createElement("option");
            option.text = selection[i].name;
            ballOptions.add(option);
        }
    }

    // Set up the calculator default values based on the ball selected from 
    // the dropdown
    function setupCalculator() {
        var ball;
        var index;
        var ballName = this.value;

        resetCalculator();

        for (var i = 0; i < allBalls.length; i++) {
            if (ballName == allBalls[i].name) {
                ball = allBalls[i];
                index = i;
                break;
            }
        }
        $("#ballName").text(ball.name + " Ball");
        CURRENT_BALL_INDEX = index;
        drawBall();

        setSpeedDropdown();

        // enable calculator
        $("#upgrades input, select, button").prop("disabled", false);
    }

    // Reset all form input fields of the calculator
    function resetCalculator() {
        document.getElementById("numForm").reset();
        document.getElementById("spdForm").reset();
        document.getElementById("powForm").reset();
        calculateLevelCost();
        calculateSpeedCost();
        calculatePowerCost();
        PERF_PRES_1 = false;
        PERF_PRES_2 = false;
    }

    // Populate dropdown with possible values
    function setSpeedDropdown() {
        $.each(speedLv, function(i, p) {
            $("#curLvS").append($('<option></option>').val(p).html(p));
            $("#toLvS").append($('<option></option>').val(p).html(p));
        });
    }

    // Calculate the total cost to upgrade from the starting to end level 
    // based on user inputs for levels and cost
    function calculateLevelCost() {
        var curLv = parseInt($("#curLvN").val());
        var rawCost = $("#curCostN").val();
        var toLv = parseInt($("#toLvN").val());
        var totalCost = 0;


        var costReg = rawCost.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var curCost = parseFloat(costReg[0]);

        // Force pierce ball to follow specific quantity restriction
        if (CURRENT_BALL_INDEX == 6) {
            if (toLv > 40) {
                toLv = 40;
                $("#toLvN").val(40);
            }
        }

        // Calculate running cost of upgrading between selected levels
        var lvDiff = toLv - curLv;
        if (lvDiff > 0) {
            for (var i = 0; i < lvDiff; i++) {
                totalCost += curCost;
                curCost *= 1.9;
            }
        }


        totalCost = convertNumberLetter(totalCost, costReg[1]);

        $("#ballCost").text(totalCost);
    }

    // Calculate the total cost to upgrade from the starting to end speed level 
    // based on user inputs for levels, value, and cost
    function calculateSpeedCost() {
        var rawLv = $("#curLvS").val();
        var rawCost = $("#curCostS").val();
        var rawVal = $("#curSpd").val();
        var rawToLv = $("#toLvS").val();
        var totalCost = 0;
        var finalSpeed = 0;

        var costReg = rawCost.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var valReg = rawVal.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var curCost = parseFloat(costReg[0]);
        var curVal = parseFloat(valReg[0]);

        // prestige conditions
        var curP1 = rawLv == "first prestige";
        var curP2 = rawLv == "second prestige";
        var toP1 = rawToLv == "first prestige";
        var toP2 = rawToLv == "second prestige";

        // if starting on a prestige step, adjust levels and costs, perform perstige
        if (curP1) {
            curLv = 40;
            totalCost = curCost;
            curCost = curCost / 9.49 * 1.9;
            PERF_PRES_1 = true;
        } else if (curP2) {
            curLv = 80;
            totalCost = curCost;
            curCost = curCost / 9.49 * 1.9;
            PERF_PRES_2 = true;
        } else {
            var curLv = parseInt(rawLv);
            PERF_PRES_1 = false;
            PERF_PRES_2 = false;
        }
        
        // if ending on a prestige step, do not perform prestige
        if (toP1) {
            toLv = 40;
        } else if (toP2) {
            toLv = 80;
        } else {
            var toLv = parseInt(rawToLv);
        }

        // check for natural prestige through leveling
        if (!toP2 && curLv <= 79 && toLv >= 80) {
            PERF_PRES_2 = true;
        }
        if (!toP1 && curLv <= 39 && toLv >= 40) {
            PERF_PRES_1 = true;
        }

        // Calculate running cost of upgrading speed and the new speed value
        var lvDiff = toLv - curLv;
        if (lvDiff >= 0) {

            // Get ball base speed
            var baseSpeed = allBalls[CURRENT_BALL_INDEX].stats[RADIO_INDEX][0];
            var baseIncrease;

            // Check if selected ball is Demo
            if (CURRENT_BALL_INDEX == 4) {
                baseIncrease = 0.33;
            } else {
                baseIncrease = 0.62;
            }

            // Adjust base speed value for levels
            for (var i = 0; i < curLv; i++) {
                baseSpeed += (baseIncrease);
                baseIncrease *= 0.99;
            }
            
            // Calculate total speed multiplier
            var spdMulti = curVal / baseSpeed;

            // Calculate effect of leveling
            for (var j = 0; j < lvDiff; j++) {
                // Calculate new base speed
                baseSpeed += (baseIncrease);
                baseIncrease *= 0.99;

                // Calculate new total cost
                if ((curLv + j == 39 && PERF_PRES_1) || (curLv + j == 79 && PERF_PRES_2)) {
                    totalCost += curCost * 9.49;
                } 
                totalCost += curCost;
                curCost *= 1.9;
            }


            // Adjust base speed value for any prestiges
            if (PERF_PRES_1 && PERF_PRES_2) {
                baseSpeed *= 0.16;
            } else if (PERF_PRES_1 || PERF_PRES_2) {
                baseSpeed *= 0.4;
            }

            calculatePowerCost();
            finalSpeed = (spdMulti * baseSpeed).toFixed(2);
        } else {
            finalSpeed = curVal;
        }

        finalSpeed = convertNumberLetter(finalSpeed, valReg[1]);
        totalCost = convertNumberLetter(totalCost, costReg[1]);
        $("#newSpd").text(finalSpeed);
        $("#spdCost").text(totalCost);
        

    }

    // Calculate the total cost to upgrade from the starting to end power level 
    // based on user inputs for levels, value, and cost
    function calculatePowerCost() {
        var curLv = parseInt($("#curLvP").val());
        var rawCost = $("#curCostP").val();
        var rawVal = $("#curPow").val();
        var toLv = parseInt($("#toLvP").val());
        var totalCost = 0;
        var finalPower = 0;

        var costReg = rawCost.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var valReg = rawVal.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        
        var curCost = parseFloat(costReg[0]);
        var curVal = parseFloat(valReg[0]);

        // constrain poison to max power level
        if (CURRENT_BALL_INDEX == 3) {
            if (toLv > 119) {
                toLv = 119;
                $("#toLvP").val(119);
            }
        }
        // Calculate running cost of upgrading power and the new power value
        var lvDiff = toLv - curLv;
        if (lvDiff > 0) {

            // Get ball base power
            var basePower = allBalls[CURRENT_BALL_INDEX].stats[RADIO_INDEX][1];
            var baseIncrease;

            // Check if selected ball is Poison or Cash
            if (CURRENT_BALL_INDEX == 3 || CURRENT_BALL_INDEX == 7) {
                baseIncrease = 0.4333;
                increaseMulti = 1 / 1.02;
            } else {
                baseIncrease = basePower * 1.02;
                increaseMulti = 1.02;
            }

            // Adjust base power value for levels
            for (var i = 0; i < curLv; i++) {
                basePower += (baseIncrease);
                baseIncrease *= increaseMulti;
            }
            
            // Calculate total power multiplier
            var powMulti = curVal / basePower;

            // Calculate effect of leveling
            for (var j = 0; j < lvDiff; j++) {
                // Calculate new base power
                basePower += (baseIncrease);
                baseIncrease *= increaseMulti;

                // Calculate new total cost
                totalCost += curCost;
                curCost *= 1.9;
            }

            finalPower = (powMulti * basePower).toFixed(2);
        } else {
            finalPower = curVal;
        }

        // apply purchased prestige boosts
        if (PERF_PRES_1) { 
            finalPower *= 5; 
            console.log("pres 1");
        }
        if (PERF_PRES_2) { 
            finalPower *= 5; 
            console.log("pres 2");
        }

        finalPower = convertNumberLetter(finalPower, valReg[1]);
        totalCost = convertNumberLetter(totalCost, costReg[1]);

        $("#newPow").text(finalPower);
        $("#powCost").text(totalCost);      
    }

    // Persists user's submitted purchase to a global array
    function recordPurchase() {
        var unlock = unlocks[RADIO_INDEX];
        var ball = allBallNames[CURRENT_BALL_INDEX];
        var newNum = parseInt($("#toLvN").val());
        var newSpd = parseInt($("#toLvS").val());
        var newPow = parseInt($("#toLvP").val());
        var numCost = $("#ballCost").text();
        var spdCost = $("#spdCost").text();
        var powCost = $("#powCost").text();

        var costArr = [numCost, spdCost, powCost];
        var totalCost = sumCosts(costArr);

        var row = [unlock, ball, newNum, newSpd, newPow, numCost, spdCost, powCost, totalCost];
        
        PURCHASES[RADIO_INDEX] = row;
        PURCHASE_COSTS[RADIO_INDEX] = totalCost;
        drawTable();
    }

    // Calculates the total cost of all cost elements in a given array.
    // Performs unit conversion.
    function sumCosts(costArr) {
        var sum = 0;
        for (var i = 0; i < costArr.length; i++) {
            var reg = costArr[i].match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
            sum += reverseNumberLetter(parseFloat(reg[0]), reg[1]); 
        }
        return convertNumberLetter(sum, "");
    }


    // Draws the purchases table
    function drawTable() {
        clearTable();
        var table = $("#upgradeTable");
        for (var i = 0; i < SLOTS; i++) {
            var row = PURCHASES[i];
            if (row != null) {
                
                var tableRow = '<tr>';
                for (var j = 0; j < row.length; j++) {
                    tableRow += '<td class="col-1">' + row[j] + '</td>';
                }
                tableRow += '<td><button id="remove' + i + '">Remove</button></td></tr>';
                table.append(tableRow);
                $("#remove"+i).click(removeRow);
            }
        }
        var totalCost = sumCosts(PURCHASE_COSTS);
        var costRow = '<tr><td><b>Total</b></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>' + totalCost + '</td>';
        table.append(costRow);
    }

    // Clears the purchases table
    function clearTable() {
        $("#upgradeTable tbody tr").remove();
    }

    // Deletes a row from the purchases table
    function removeRow() {
        var index = this.id.substring(this.id.length - 1);
        PURCHASES[index] = null;
        PURCHASE_COSTS[index] = "0";
        drawTable();
    }

    // Styles display ball based on current user selection
    function drawBall() {
        $ballImg = $("#ballImage");

        switch(CURRENT_BALL_INDEX) {
            case 1: //sniper
                $ballImg.css({"background": "rgb(253, 168, 17)", "box-shadow": "0 0 0px 10px rgb(253, 168, 17)"});
                break;
            case 2: //splash
                $ballImg.css({"background": "rgb(253, 61, 245)", "box-shadow": "0 0 0px 10px rgb(253, 61, 245)"});
                break;
            case 3: //poison
                $ballImg.css({"background": "rgb(105, 250, 83)", "box-shadow": "0 0 0px 10px rgb(105, 250, 83)"});
                break;
            case 4: //demo
                $ballImg.css({"background": "rgb(253, 19, 10)", "box-shadow": "0 0 0px 10px rgb(253, 19, 10)"});
                break;
            case 5: //scatter
                $ballImg.css({"background": "rgb(22, 219, 253)", "box-shadow": "0 0 0px 10px rgb(22, 219, 253)"});
                break;
            case 6: //pierce
                $ballImg.css({"background": "rgb(147, 147, 147)", "box-shadow": "0 0 0px 10px rgb(147, 147, 147)"});
                break;
            case 7: //cash
                $ballImg.css({"background": "rgb(252, 218, 6)", "box-shadow": "0 0 0px 10px rgb(252, 218, 6)"});
                break;
            case 8: //sword
                $ballImg.css({"background": "rgb(255, 255, 255)", "box-shadow": "0 0 0px 10px rgb(11, 249, 251)"});
                break;
            case 9: //fire
                $ballImg.css({"background": "rgb(238, 78, 26)", "box-shadow": "0 0 0px 10px rgb(238, 78, 26)"});
                break;
            case 10: //lightning
                $ballImg.css({"background": "rgb(66, 133, 244)", "box-shadow": "0 0 0px 10px rgb(66, 133, 244)"});
                break;
            default: //basic
                $ballImg.css({"background": "rgb(255, 255, 255)", "box-shadow": "0 0 0px 10px rgb(255, 255, 255)"});
        }
    }
})();