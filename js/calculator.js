(function(){

    //Globals
    var RADIO_INDEX = 0;
    var CURRENT_BALL_INDEX;


    $(document).ready(function() {
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
        
        for (var i = 0; i < allBalls.length; i++) {
            if (ballName == allBalls[i].name) {
                ball = allBalls[i];
                index = i;
                break;
            }
        }
        $("#ballName").text(ball.name + " Ball");
        CURRENT_BALL_INDEX = index;
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
        var curLv = parseInt($("#curLvS").val());
        var rawCost = $("#curCostS").val();
        var rawVal = $("#curSpd").val();
        var toLv = parseInt($("#toLvS").val());
        var totalCost = 0;



        var costReg = rawCost.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var valReg = rawVal.match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);
        var curCost = parseFloat(costReg[0]);
        var curVal = parseFloat(valReg[0]);


        // Calculate running cost of upgrading speed and the new speed value
        var lvDiff = toLv - curLv;
        if (lvDiff > 0) {

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

            // Adjust base speed value for prestiges
            if (curLv >= 80) {
                baseSpeed *= 0.16;
                baseIncrease *= 0.16;
            } else if (curLv >= 40) {
                baseSpeed *= 0.4;
                baseIncrease *= 0.4;
            }
            
            // Calculate total speed multiplier
            var spdMulti = curVal / baseSpeed;


            // TODO: Account for leveling through a ball prestige

            // Calculate effect of leveling
            for (var j = 0; j < lvDiff; j++) {
                // Calculate new base speed
                baseSpeed += (baseIncrease);
                baseIncrease *= 0.99;

                // Calculate new total cost
                totalCost += Math.round(curCost);
                curCost *= 1.9;
            }

            var finalSpeed = (spdMulti * baseSpeed).toFixed(2);

            finalSpeed = convertNumberLetter(finalSpeed, valReg[1]);
            totalCost = convertNumberLetter(totalCost, costReg[1]);
            $("#newSpd").text(finalSpeed);
            $("#spdCost").text(totalCost);
        }
        

    }

    function calculatePowerCost() {
        var curLv = parseInt($("#curLvP").val());
        var rawCost = $("#curCostP").val();
        var rawVal = $("#curPow").val();
        var toLv = parseInt($("#toLvP").val());
        var totalCost = 0;

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
                totalCost += Math.round(curCost);
                curCost *= 1.9;
            }

            var finalPower = (powMulti * basePower).toFixed(2);
            finalPower = convertNumberLetter(finalPower, valReg[1]);
            totalCost = convertNumberLetter(totalCost, costReg[1]);


            $("#newPow").text(finalPower);
            $("#powCost").text(totalCost);
        }
        
    }
})();