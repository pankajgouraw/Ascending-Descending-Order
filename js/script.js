$(function() {

    let result='';
    let index = 1;
    let correctAns = 0;
    $("#headerText").text(headerText);
    $("#instruction").css({color:headerInstructionColor});
    $('body').css({'background-image':bg});
    $('.dropContainer').css({'left': 0});


    // url value
    let url = window.location.href;
    if (url.indexOf('?') > 0) {
        let params = new URLSearchParams(url.substring(1));
        index = parseInt(params.get('qno'));
        // console.log("url variable available....");
    } else {
        // console.log("url variable not available...");
    }


  // function for drag and drop
  function dragDrop(){

      $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            // helper: 'clone'
      });

      $(".drop" ).droppable({

            accept:".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {

              if($(event.target).attr('data-user') == ''){
                    $(event.target).attr('data-user',ui.draggable.text())
                                   .text(ui.draggable.text());
              }else{
                   $(ui.draggable).animate({top: "0px",left: "0px"});
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
          $(ui.draggable).hide();

            },
      }); 

  }  //end here drag and drop 


// load dynamic data
let trainContainer = '';
let dataContainer = '';

function loadDynamicData(){

  let arr = data[index].trackData;
  $.each(arr , function(index,value){
    if(index == 0 || index == arr.length-1){
      let comp = `<li class='' data-ans='${value}' data-user=''>${value}</li>`;
      trainContainer += comp;
    }else{
      let comp = `<li class='drop' data-ans='${value}' data-user=''></li>`;
      let compDrag = `<li class='drag'>${value}</li>`;
      dataContainer+= compDrag;
      trainContainer += comp;
    }
  })
  $('#dropData').html(trainContainer);
  $('#dragData').html(dataContainer);

} // end load dynamic data
 

 // check answer function  
function check(){
  $.each($('.drop'), function(index, value){
      let dataUser = $(value).attr('data-user');
      let dataAns = $(value).attr('data-ans');
      console.log(dataUser, dataAns);
      if(dataUser == dataAns){
        console.log('working...');
        correctAns++;
      }else{
        $(value).css({'backgroundColor':'red'})
      }
  })
 
}  // check answer function  end


//check answer function
$('#check').click(function(){
   check()
   if(correctAns == data[index].trackData.length-2){
    $('.dropContainer').css({'left': '-100%'});
   }
}) // end check answer function 


//reset question function
$('#reset').click(function(){
  $('.drop').empty().attr('data-user' , '').css({'backgroundColor':'transparent'});
  $('.drag').animate({top: "0px",left: "0px"}).show();
  correctAns = 0;

})
//reset question function end

// to suffle the position of options at random places
  let imgRandPosition = function(){
    let questionBox = $('.questionBox');
    $.each(questionBox, function(i, value){
      $(this).css({order: Math.floor(Math.random() * questionBox.length) +1});
    })
  }

  loadDynamicData();
  dragDrop();
  

});   // end document function 
