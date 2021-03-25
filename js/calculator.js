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
        console.log(CURRENT_BALL_INDEX);
    }

    // Calculates the total cost to upgrade from the starting to end level 
    // based on user inputs for levels and cost
    function calculateLevelCost() {
        var curLv = parseInt($("#curLvN").val());
        var curCost = parseInt($("#curCostN").val());
        var toLv = parseInt($("#toLvN").val());
        var totalCost = 0;

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

        $("#ballCost").text("Total Upgrade Cost: " + totalCost);
    }

    function calculateSpeedCost() {
    }

    function calculatePowerCost() {
    }
})();