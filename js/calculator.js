(function(){

    //Globals
    var RADIO_INDEX = 0;
    var CURRENT_BALL_INDEX;
    var PERF_PRES_1 = false;
    var PERF_PRES_2 = false;


    $(document).ready(function() {
            // disable calculator forms
            $("#upgrades input").prop("disabled", true);
            $("#upgrades select").prop("disabled", true);

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
            $("select").change(calculateSpeedCost);
            $("input[name='power']").change(calculatePowerCost);
        }
    );


    // Changes dropdown selection ball options according to which radio button 
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

        setSpeedDropdown();

        // enable calculator
        $("#upgrades input, select").prop("disabled", false);
    }

    // resets all form input fields of the calculator
    function resetCalculator() {
        document.getElementById("numForm").reset();
        document.getElementById("spdForm").reset();
        document.getElementById("powForm").reset();
        PERF_PRES_1 = false;
        PERF_PRES_2 = false;
    }

    function setSpeedDropdown() {
        $.each(speedLv, function(i, p) {
            $("#curLvS").append($('<option></option>').val(p).html(p));
            $("#toLvS").append($('<option></option>').val(p).html(p));
        });
    }

    // Calculates the total cost to upgrade from the starting to end level 
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
                totalCost += Math.round(curCost);
                curCost *= 1.9;
            }
        }


        totalCost = convertNumberLetter(totalCost, costReg[1]);

        $("#ballCost").text(totalCost);
    }

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
            if (toLv >= 80 && !toP2) {
                baseSpeed *= 0.16;
            } else if (toLv >= 40 && !toP1) {
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

    function calculatePowerCost() {
        console.log("calculating power");
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
})();