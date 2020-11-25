/*!
    * Start Bootstrap - Freelancer v6.0.4 (https://startbootstrap.com/themes/freelancer)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
    */
import BigNumber from './bignumber.mjs';
    (function($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top - 71)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });
    // Scroll to top button appear
    $(document).scroll(function() {
        const scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 80
    });

    // Collapse Navbar
        const navbarCollapse = function () {
            if ($("#mainNav").offset().top > 100) {
                $("#mainNav").addClass("navbar-shrink");
            } else {
                $("#mainNav").removeClass("navbar-shrink");
            }
        };
        // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    // Floating label headings for the contact form
    $(function() {
      $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
      }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
      }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
      });
    });

  })(jQuery); // End of use strict


// ------------------------------ Converter -------------------------------------------------------------------------------------------------

let converter_from = document.getElementById('converter_unit_1').value
//let regex = new RegExp(/[-]?[0-1]+[,.]?[0-1]*/);
let converter_last_valid = ""
let regex_decimal = new RegExp(/^[-]?[0-9]+[,.]?[0-9]*$/); //RegExp(/^[-]?[0-9]+[,.]?[0-9]*([\/][0-9]+[,.]?[0-9]*)*$/)
let regex_binary = new RegExp(/^[-]?[0-1]+[,.]?[0-1]*$/);
let regex_octal = new RegExp(/^[-]?[0-7]+[,.]?[0-7]*$/);
let regex_hexadecimal = new RegExp(/^[-]?[0-9A-Fa-f]+[,.]?[0-9A-Fa-f]*$/);

//zmena jednotky
$("#converter_unit_1").on("input change keyup paste", function() {
    converter_last_valid = ""
    converter_reset()
    converter_from = document.getElementById('converter_unit_1').value
    document.getElementById('converter_input_label').innerHTML = "Enter " + converter_from + " number"

    let symbol_input, symbol_output1, symbol_output2, symbol_output3;
    if(converter_from === "Decimal") {
        document.getElementById('converter_label_1').innerText = "Binary"
        document.getElementById('converter_label_2').innerText = "Octal"
        document.getElementById('converter_label_3').innerText = "Hexadecimal"
        symbol_input = 10
        symbol_output1 = 2
        symbol_output2 = 8
        symbol_output3 = 16
    } else if(converter_from === "Binary") {
        document.getElementById('converter_label_1').innerText = "Octal"
        document.getElementById('converter_label_2').innerText = "Decimal"
        document.getElementById('converter_label_3').innerText = "Hexadecimal"
        symbol_input = 2
        symbol_output1 = 8
        symbol_output2 = 10
        symbol_output3 = 16
    } else if(converter_from === "Octal"){
        document.getElementById('converter_label_1').innerText = "Binary"
        document.getElementById('converter_label_2').innerText = "Decimal"
        document.getElementById('converter_label_3').innerText = "Hexadecimal"
        symbol_input = 16
        symbol_output1 = 2
        symbol_output2 = 10
        symbol_output3 = 16
    } else if(converter_from === "Hexadecimal"){
        document.getElementById('converter_label_1').innerText = "Binary"
        document.getElementById('converter_label_2').innerText = "Octal"
        document.getElementById('converter_label_3').innerText = "Decimal"
        symbol_input = 16
        symbol_output1 = 2
        symbol_output2 = 8
        symbol_output3 = 10
    }
    document.getElementById('converter_input_symbol').innerHTML = "<sub>"+ symbol_input +"</sub>"
    document.getElementById('converter_output_symbol1').innerHTML = "<sub>"+ symbol_output1 +"</sub>"
    document.getElementById('converter_output_symbol2').innerHTML = "<sub>"+ symbol_output2 +"</sub>"
    document.getElementById('converter_output_symbol3').innerHTML = "<sub>"+ symbol_output3 +"</sub>"

    convert('converter',converter_from, 'converter_input', 'converter_output_1', 'converter_output_2', 'converter_output_3')
})
//zadavanie hodnoty

$("#converter_input").on("input change keyup paste", function(){
    this.value = this.value.toUpperCase()
    let input = this.value
    this.value = input.replace(/\./g, ',')
    convert('converter', converter_from, 'converter_input', 'converter_output_1', 'converter_output_2', 'converter_output_3')
})

function convert(operation, from, input_Id, output_1, output_2, output_3) {
    let input = document.getElementById(input_Id).value.replace(/,/g, '.')
    if(from === "Decimal") {
        if(isValid(input, regex_decimal, operation,input_Id)){
            convertTo(input, 10, 2, output_1)
            convertTo(input, 10, 8, output_2)
            convertTo(input, 10, 16, output_3)
        }
    }
    else if(from === "Binary") {
        if(isValid(input, regex_binary, operation, input_Id)){
            convertTo(input, 2,8, output_1)
            convertTo(input, 2, 10, output_2)
            convertTo(input, 2,16, output_3)
        }
    }
    else if(from === "Octal"){
        if(isValid(input, regex_octal, operation, input_Id)) {
            convertTo(input, 8,2, output_1)
            convertTo(input, 8, 10, output_2)
            convertTo(input, 8,16, output_3)
        }
    }
    else if(from === "Hexadecimal"){
        if(isValid(input, regex_hexadecimal, operation, input_Id)) {
            convertTo(input, 16,2, output_1)
            convertTo(input, 16, 8, output_2)
            convertTo(input, 16,10, output_3)
        }
    }
}

function isValid(input, regex, last_valid, rollbackTo) {
    if(input === "" ){
        console.log("empty")
        if(last_valid === 'converter'){
            converter_reset()
            converter_last_valid = input
        } else{
            if(last_valid.charAt(last_valid.length-1) === "1")
                calculator_last_valid1 = input
            else
                calculator_last_valid2 = input
            calculate(first, second)
        }
    } else if ((input[0] === '-' && input.toString().length < 2) || regex.test(input)) {
        console.log("valid")
        if(last_valid === 'converter')
            converter_last_valid = input
        else{
            if(last_valid.charAt(last_valid.length-1) === "1")
                calculator_last_valid1 = input
            else
                calculator_last_valid2 = input
        }
        //document.getElementById('converter_input').classList.add('error')


        //     form-control:focus {
        //     color: #495057;
        //     background-color: #fff;
        //     border-color: #6bebd1;
        //     outline: 0;
        //     box-shadow: 0 0 0 0.2rem rgba(26, 188, 156, 0.25);
        // }
        return true
    } else {
        console.log("invalid")
        document.getElementById(rollbackTo).value = (last_valid === 'converter') ? converter_last_valid.replace(/\./g, ',') :
            (last_valid.charAt(last_valid.length-1) === "1") ? calculator_last_valid1.replace(/\./g, ',') : calculator_last_valid2.replace(/\./g, ',')
        return false;
    }
}

function convertTo(input, source, dest, output){
    //const [integer, fraction = ''] = input.split('.');
    //result = result.toString(dest)
   // console.log(result)
    //result = result.toString(dest).replace(/\./g, '.')

    /*if(dest === 16){
        result = result.replace(/[0]{2}/g, 'ff')
        result = result.replace(/[0]$/g, 'f').toUpperCase()
    }*/
    /*let result = new BigNumber(parseInt(integer, source) + (integer[0] !== '-' || -1) * fraction
        .split('')
        .reduceRight((r, a) => (r + parseInt(a, source)) / source, 0).toString())*/
    let result = new BigNumber(input, source).toString(dest)
    if(output !== null) {
        result = groupDigits(result, dest)
        document.getElementById(output).value = result.replace(/\./g, ',').toUpperCase()
    }
    else
        return result
}

function groupDigits(input, source){
    //binary 8
    //octal 3
    //decimal 3
    //hexadecimal 4
    switch (source) {
        case 2: source = 8;break
        case 8: case 10: source = 3;break
        case 16: source = 4;break
        default: console.log("wrong"); break;
    }
    let regex = new RegExp("(.)(?=(.{"+source+"})+$)", "g")
    return input.replace(regex, "$1 ");
}



// ------------------------------ Calculator -----------------------------------------------------------------------------------------------

let calculator_first_op = document.getElementById('calculator_first_op').value
let calculator_second_op = document.getElementById('calculator_second_op').value
let calculator_operator = document.getElementById('calculator_op').value
let calculator_last_valid1 = ""
let calculator_last_valid2 = ""
let first = ""
let second = ""


$("#calculator_first_number").on("input change keyup paste", function(){
    this.value = this.value.toUpperCase()
    first = this.value.replace(/,/g, '.')
    this.value = this.value.replace(/\./g, ',')
    if(first === ""  && second === ""){
        calculator_reset_outputs()
        return
    }
    if(isValid(first, toRegex(calculator_first_op), 'calculator1', 'calculator_first_number')){
        calculate()
    }
})

$("#calculator_second_number").on("input change keyup paste", function(){
    this.value = this.value.toUpperCase()
    second = this.value.replace(/,/g, '.')
    this.value = this.value.replace(/\./g, ',')
    if(first === ""  && second === ""){
        calculator_reset_outputs()
        return
    }
    if(isValid(second, toRegex(calculator_second_op), 'calculator2', 'calculator_second_number')){
        calculate()
    }
})

function calculate(){
    let result = new BigNumber(convertTo(first, parseInt(calculator_first_op), 10, null))
    console.log("operator: "+calculator_operator)
    switch (calculator_operator) {
        case "add (+)": result = result.plus(convertTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        case "sub (-)": result = result.minus(convertTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        case "mul (*)": result = result.multipliedBy(convertTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        case "div (/)": result = result.dividedBy(convertTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        case "mod (%)": result = result.modulo(convertTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        //case "or ()": result = result.plus(transferTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        //case "and ()": result = result.plus(transferTo(second.toString(), parseInt(calculator_second_op), 10, null));break;
        default: result = "Error";break;
    }

    convertTo(result, 10, 2, 'calculator_output_1')
    convertTo(result, 10, 8, 'calculator_output_2')
    convertTo(result, 10, 10, 'calculator_output_3')
    convertTo(result, 10, 16, 'calculator_output_4')
}

function toRegex(operator){
    switch (operator) {
        case "2": return regex_binary;
        case "8": return regex_octal;
        case "10": return regex_decimal;
        case "16": return regex_hexadecimal;
    }
}


$("#calculator_first_op").on("input change keyup paste", function() {
    calculator_last_valid1 = ""
    calculator_first_op = this.value

    if(isValid(first, toRegex(calculator_first_op), 'calculator1', 'calculator_first_number')){
        calculate()
    }
    else {
        document.getElementById('calculator_first_number').value = ""
        first = "0"
        calculate()

    }
})

$("#calculator_op").on("input change keyup paste", function() {
    calculator_operator = this.value
    calculate()
})

$("#calculator_second_op").on("input change keyup paste", function() {
    calculator_last_valid2 = ""
    calculator_second_op = this.value

    if(isValid(second, toRegex(calculator_second_op), 'calculator2', 'calculator_second_number')){
        calculate()
    }
    else {
        document.getElementById('calculator_second_number').value = ""
        second = "0"
        calculate()
    }
})



function calculator_reset_outputs() {
    document.getElementById('calculator_output_1').value = ""
    document.getElementById('calculator_output_2').value = ""
    document.getElementById('calculator_output_3').value = ""
    document.getElementById('calculator_output_4').value = ""
}
