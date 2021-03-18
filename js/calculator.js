(function(){

    $(document).ready(function() {
            // add event listener to radio buttons
            $("input[name='unlock']").on("click", displaySelection);

            // set hidden default option for ball select
            $ballOptions = $("#ballOptions");
            var defaultOption = document.createElement("option");
            defaultOption.style.display = "none";
            ballOptions.add(defaultOption);

            // add event listener to ball select
            $("#ballOptions").on("change", setupCalculator);
            // add event listener to number inputs
            $("input[name='level']").on("input", calculateCost);
        }
    );


    function displaySelection() {
        // show select box
        $ballOptions = $("#ballOptions");
        //$ballOptions.css('visibility', 'visible');
        var unlock = this.value;
        var selection;
        switch (unlock) {
            case "radBasic":
                selection = ballBasic;
                break;
            case "rad175":
                selection = ball175;
                break;
            case "rad75k":
                selection = ball75k;
                break;
            case "rad175k":
                selection = ball175k;
                break;
            case "rad15M":
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

    function setupCalculator() {
        var ball;
        var ballName = this.value;
        
        for (var i = 0; i < allBalls.length; i++) {
            console.log(allBalls[i].name);
            if (ballName == allBalls[i].name) {
                ball = allBalls[i];
                break;
            }
        }
        $("#ballName").text(ball.name + " Ball");
        $("#curSpd").text("Current speed value: " + ball.speed);
        $("#curPow").text("Current power value: " + ball.power);
    }

    function calculateCost() {
        console.log(this.id);
    }

})();