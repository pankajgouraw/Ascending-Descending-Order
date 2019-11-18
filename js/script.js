$(function() {

    let result = '';
    let index = 0;
    let correctAns = 0;
    let chance = 0;
    let userAns = 0;
    let output = $('.output');
    $("#headerText").text(headerText);
    $("#instruction").css({
        color: headerInstructionColor
    });
    $('body').css({
        'background-image': bg
    });
    $('.dropContainer').css({
        'left': 0
    });

    // generate numbers
    let arrayContainer = [];
    let noOfBoxLength = noOfBox;

    function generateNumbers() {
        for (let i = 0; i < noOfBoxLength; i++) {
            let x = Math.floor(Math.random() * (maxNumber - minNumber) + 1) + minNumber;
            if (!arrayContainer.includes(x)) {
                arrayContainer.push(x);
                if (ascending == true) {
                    arrayContainer.sort(function(a, b) {
                        return a - b
                    })
                } else {
                    arrayContainer.sort(function(a, b) {
                        return b - a
                    })
                }

            } else {
                noOfBoxLength++;
            }
        }
    } // end generate numbers
    generateNumbers();




    // function for drag and drop
    function dragDrop() {

        $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            // helper: 'clone'
        });

        $(".drop").droppable({

            accept: ".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {

                if ($(event.target).attr('data-user') == '') {
                    $(event.target).attr('data-user', ui.draggable.text())

                    setTimeout(function() {
                        $(event.target).text(ui.draggable.text());
                    }, 1000)

                } else {
                    $(ui.draggable).animate({
                        top: "0px",
                        left: "0px"
                    });
                    return false;
                }
                // centering element when drop
                var drop_el = $(this).offset();
                var drag_el = ui.draggable.offset();
                var left_end = (drop_el.left + ($(this).width() / 2)) - (drag_el.left + (ui.draggable.width() / 2));
                var top_end = (drop_el.top + ($(this).height() / 2)) - (drag_el.top + (ui.draggable.height() / 2));
                ui.draggable.animate({
                    top: '+=' + top_end,
                    left: '+=' + left_end
                });
                // centering element when drop end
                setTimeout(function() {
                    $(ui.draggable).hide();
                }, 1000)

            } // drop method end here
        });

    } //end here drag and drop 


    // load dynamic data

    let generateHints = [];

    function loadDynamicData() {
        let trainContainer = '';
        let dataContainer = '';
        let noOfHints = hints;
        for (let i = 0; i < noOfHints; i++) {
            // let x = Math.floor(Math.random() * arrayContainer.length);
            let x = arrayContainer[Math.floor(Math.random() * arrayContainer.length)];
            if (!generateHints.includes(x)) {
                generateHints.push(x);
            } else {
                noOfHints++;
            }
        }
        // console.log(generateHints)

        let arr = arrayContainer;
        // console.log('main arr', arr)
        $.each(arr, function(index, value) {

            if (generateHints.includes(value)) {
                let comp = `<li class='' data-ans='${value}' data-user=''>${value}</li>`;
                trainContainer += comp;
            } else {
                let comp = `<li class='drop' data-ans='${value}' data-user=''></li>`;
                let compDrag = `<li class='dragLi'><span class='drag'>${value}</span></li>`;
                dataContainer += compDrag;
                trainContainer += comp;
            }
        })
        $('#dropData').html(trainContainer);
        $('#dragData').html(dataContainer);

    } // end load dynamic data


    // check answer function  
    function check() {

        correctAns = null;
        $.each($('.drop'), function(index, value) {
            let dataUser = $(value).attr('data-user');
            let dataAns = $(value).attr('data-ans');
            // console.log(dataUser, dataAns);
            if (dataUser == dataAns) {
                // console.log('working...');
                correctAns++;
            } else {
                $(value).css({
                    'backgroundColor': 'red'
                })
            }
        })

    } // check answer function  end


    //check answer function
    $('#check').click(function() {
        let dropLength = $('.drop').length;
        let dropTag = $('.drop');
        let userInput = '';
        $.each(dropTag, function(i, value) {
            let userData = $(value).text();
            userInput += userData;
        });
        // console.log(parseInt(userInput));
        // console.log(output)
        if (userInput == '') {
            return false;
        }
        // if(chance >= 1){
        //   $(this).hide();
        //   $('#showAnswer').show();
        //   $('#next').show();
        //   $('#reset').hide();
        //   $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
        //     userAns++;

        // }


        check();

        // console.log('droplength',dropLength)
        // console.log('correctAns', correctAns)
        if (correctAns == dropLength) {
            $('#showAnswer').hide();
            $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
            $('.drop').css({
                'backgroundColor': 'transparent'
            });
            chance = 0;
            userAns++;
            // $('.drop').css({'backgroundColor':'transparent'})
            $('.dropContainer').css({
                'left': '-100%',
                'transition': 'all 1s ease-in-out'
            });
            var audio = new Audio('audio/welldone.mp3');
            audio.play();
            setTimeout(function() {
                $('.wellDone').fadeIn();

            }, 1000)
            $('#reset').hide();
            $('#check').hide();
            $('#next').show();
        } else {
            if (chance == 0) {
                chance++;
                return false;
            } else {
                $(this).hide();
                $('#reset').hide();
                $('#showAnswer').show();
                $('#next').show();
                $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
                userAns++;
            }

        }
        if (userAns == 10) {
            $('#next').hide();
            $('#playAgain').show();
        }
    }) // end check answer function 


    //reset question function
    $('#reset').click(function() {
        $('.drop').empty().attr('data-user', '').css({
            'backgroundColor': 'transparent'
        });
        $('.drag').animate({
            top: "0px",
            left: "0px"
        }).show();
        correctAns = 0;
        optionRandPosition();
        $('#check').show();

    })
    //reset question function end

    // to suffle the position of options at random places
    let optionRandPosition = function() {
        let dragElement = $('.dragLi');
        $.each(dragElement, function(i, value) {
            $(this).css({
                order: Math.floor(Math.random() * dragElement.length) + 1
            });
        })
    }


    $('#next').click(function() {
        $('.dropContainer').css({
            'opacity': 0,
            'left': '100%',
            'transition': 'all 0s'
        })
        chance = 0;
        noOfHints = hints;
        arrayContainer = [];
        generateHints = [];
        noOfBoxLength = noOfBox;
        generateNumbers();
        setTimeout(function() {
            $('.dropContainer').css({
                'opacity': 1,
                'left': '0%',
                'transition': 'all 1s ease-in-out'
            });
        }, 500)

        $('#dropData').empty();
        loadDynamicData();
        dragDrop();
        $('#check').show();
        $('#reset').show();
        $('#showAnswer').hide();
        $(this).hide();
        $('.wellDone').hide();
    }); // for next


    // show answer function
    $('#showAnswer').click(function() {
        chance = 0;
        $.each($('.drop'), function(index, value) {
            $(this).text($(this).attr('data-ans'));

        })
        $('.drop').css({
            'backgroundColor': 'transparent'
        });
        $(this).hide();
    })


    $('#playAgain').click(function() {
        location.reload();
    })


    loadDynamicData();
    dragDrop();
    optionRandPosition();


}); // end document function 