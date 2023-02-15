import BigNumber from './bignumber.mjs';

(function ($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
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
    $(document).scroll(function () {
        const scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
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
    $(function () {
        $("body").on("input propertychange", ".floating-label-form-group", function (e) {
            $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
        }).on("focus", ".floating-label-form-group", function () {
            $(this).addClass("floating-label-form-group-with-focus");
        }).on("blur", ".floating-label-form-group", function () {
            $(this).removeClass("floating-label-form-group-with-focus");
        });
    });

})(jQuery); // End of use strict


// $(function () {
//     // $('[data-toggle="tooltip"]').tooltip({title: $.i18n("copied")})
// });


let darkMode = localStorage.getItem('darkMode');
const darkModeToggle = document.querySelector('#modal_nightMode');
function enableDarkMode() {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'enabled');
}
function disableDarkMode() {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', null);
}
if (darkMode === 'enabled') {
    enableDarkMode();
    $('#modal_nightMode').prop("checked", true)
}
darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');

    if (darkMode !== 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function translateText(text) {
    switch (text) {
        case "Dvojková": return "Binary";
        case "Desiatková": return "Decimal";
        case "Osmičková": return "Octal";
        case "Šestnástková": return "Hexadecimal";
        case "BCD kód": return "BCD code";
        case "Priamy kód": return "Direct code";
        case "Inverzný kód": return "Inverse code";
        case "Doplnkový kód": return "Complement code";
        case "plus (+)": return "add (+)";
        case "mínus (-)": return "sub (-)";
        case "krát (*)": return "mul (*)";
        case "delené (/)": return "div (/)";
        default: return text;
    }
}

// ------------------------------ Converter -------------------------------------------------------------------------------------------------

let converter_from = translateText(document.getElementById('converter_unit_1').value);
let co_from_id = ".co3";
let converter_last_valid = "";
let regex_decimal = new RegExp(/^[-]?[0-9]+[,.]?[0-9]*$/); //RegExp(/^[-]?[0-9]+[,.]?[0-9]*([\/][0-9]+[,.]?[0-9]*)*$/)
let regex_binary = new RegExp(/^[-]?[0-1]+[,.]?[0-1]*$/);
let regex_binary_abs = new RegExp(/^[0-1]+[,.]?[0-1]*$/);
let regex_binary_abs_int = new RegExp(/^[0-1]*$/);
let regex_octal = new RegExp(/^[-]?[0-7]+[,.]?[0-7]*$/);
let regex_hexadecimal = new RegExp(/^[-]?[0-9A-Fa-f]+[,.]?[0-9A-Fa-f]*$/);
let toggler = true;
let bits1 = 8;

$("#converter_unit_1").on("change", function () {
    changeLayout()
})

function changeLayout() {
    converter_last_valid = "";
    converter_reset(true, "");
    converter_from = translateText(document.getElementById('converter_unit_1').value);
    let input_symbol
    switch (converter_from) {
        case "Decimal":
            co_from_id = ".co3"
            input_symbol = 10
            break;
        case "Binary":
            co_from_id = ".co1"
            input_symbol = 2
            break;
        case "Octal":
            co_from_id = ".co2"
            input_symbol = 8
            break;
        case "Hexadecimal":
            co_from_id = ".coex"
            input_symbol = 16
            break;
        case "BCD code":
            co_from_id = ".co4"
            input_symbol = "bcd_l"
            break;
        case "Direct code":
            co_from_id = ".co5"
            input_symbol = "dc_l"
            break;
        case "Inverse code":
            co_from_id = ".co6"
            input_symbol = "ic_l"
            break;
        case "Complement code":
            co_from_id = ".co7"
            input_symbol = "cc_l"
            break;
    }
    if(typeof input_symbol === 'string'){
        document.getElementById('converter_input_symbol').innerHTML = $.i18n(input_symbol)
        $('#converter_input_symbol').attr("data-i18n", input_symbol)
    }
    else{
        $('#converter_input_symbol').removeAttr("data-i18n")
        document.getElementById('converter_input_symbol').innerHTML = input_symbol
    }
    // $(jquery).localize()
    toggler = !toggler
    toggleBin($("#binaryButton"))
    convert()
}

$("#converter_input").on("input paste", function () {
    this.value = this.value.toUpperCase()
    let input = this.value
    this.value = input.replace(/\./g, ',')
    convert()
})

$("#converter_bits").on("change", function () {
    bits1 = this.value
    convert()
})

$("#converter_reset").on("click", function () {
    converter_reset(true, '', true);
    converter_last_valid = ""
    changeLayout()
})

$("#binaryButton").on("click", function () {
    toggleBin(this)
})

function toggleBin(btn) {
    if (toggler) {
        $(".co1").hide()
        $(".co2").hide()
        $(".co3").hide()
        $(".coex").hide()
        $(".co4").show()
        $(".co5").show()
        $(".co6").show()
        $(".co7").show()
        $(".cb").show()
        if (co_from_id !== "")
            $(co_from_id).hide()
        $(btn).css("background-color", "var(--lightPrimary)")
        $(btn).css("border-color", "var(--lightPrimary)")
        $(btn).css("color", "var(--textSecondary)")

    } else {
        $(".co1").show()
        $(".co2").show()
        $(".co3").show()
        $(".coex").show()
        $(".co4").hide()
        $(".co5").hide()
        $(".co6").hide()
        $(".co7").hide()
        $(".cb").hide()
        if (co_from_id !== "")
            $(co_from_id).hide()
        $(btn).css("background-color", "var(--modalSwitchOnBackground)")
        $(btn).css("border-color", "var(--modalSwitchOnBackground)")
        $(btn).css("color", "var(--textWhite)")
    }
    toggler = !toggler
}

function convert() {
    let operation = 'converter'
    let input_Id = 'converter_input'
    let output_1 = 'converter_output_1'
    let output_2 = 'converter_output_2'
    let output_3 = 'converter_output_3'
    let output_ex = 'converter_output_ex'
    bits1 = document.getElementById("converter_bits").value
    let input = document.getElementById(input_Id).value.replace(/,/g, '.')
    converter_from = translateText(document.getElementById('converter_unit_1').value);
    if (converter_from === "BCD code" || converter_from === "Direct code" || converter_from === "Inverse code" || converter_from === "Complement code") {
        let source = ""
        let regex
        switch (converter_from) {
            case "BCD code":
                source = "BCD";
                regex = regex_binary_abs;
                break;
            case "Direct code":
                source = "DC";
                regex = regex_binary_abs_int;
                break;
            case "Inverse code":
                source = "IC";
                regex = regex_binary_abs_int;
                break;
            case "Complement code":
                source = "CC";
                regex = regex_binary_abs_int;
                break;
        }
        if (isValid(input, regex, operation, input_Id)) {
            input = convertTo(input, source, 10, output_3)
            if (input === null) {
                converter_reset(false, "")
                return
            } else if (input === "value error") {
                converter_reset(false, "Value higher than 9")
                return
            } else if (input === "Waiting for input") {
                converter_reset(false, input)
                return
            }
        } else return

    }
    if (converter_from === "Decimal" || converter_from === "BCD code" || converter_from === "Direct code" || converter_from === "Inverse code" || converter_from === "Complement code") {
        if ((converter_from === "Decimal" && isValid(input, regex_decimal, operation, input_Id)) || converter_from === "BCD code" || converter_from === "Direct code" || converter_from === "Inverse code" || converter_from === "Complement code") {
            convertTo(input, 10, 2, output_1)
            convertTo(input, 10, 8, output_2)
            convertTo(input, 10, 16, output_ex)
            convertToBinary(input, "normal", "converter")
        }
    } else if (converter_from === "Binary") {
        if (isValid(input, regex_binary, operation, input_Id)) {
            convertTo(input, 2, 8, output_2)
            let decimal = convertTo(input, 2, 10, output_3)
            convertTo(input, 2, 16, output_ex)
            convertToBinary(decimal, "normal", "converter")
        }
    } else if (converter_from === "Octal") {
        if (isValid(input, regex_octal, operation, input_Id)) {
            convertTo(input, 8, 2, output_1)
            let decimal = convertTo(input, 8, 10, output_3)
            convertTo(input, 8, 16, output_ex)
            convertToBinary(decimal, "normal", "converter")
        }
    } else if (converter_from === "Hexadecimal") {
        if (isValid(input, regex_hexadecimal, operation, input_Id)) {
            convertTo(input, 16, 2, output_1)
            convertTo(input, 16, 8, output_2)
            let decimal = convertTo(input, 16, 10, output_3)
            convertToBinary(decimal, "normal", "converter")
        }
    }
}

function isValid(input, regex, last_valid, rollbackTo) {
    if (input === "") {
        if (last_valid === 'converter') {
            converter_reset(true, "")
            converter_last_valid = input
        } else {
            if (last_valid.charAt(last_valid.length - 1) === "1")
                calculator_last_valid1 = input
            else
                calculator_last_valid2 = input
            calculate(first, second)
        }
    } else if ((converter_from === "BCD code" && last_valid === "converter")
        || (calculator_first_op === "BCD code" && last_valid === "calculator1")
        || (calculator_second_op === "BCD code" && last_valid === "calculator2")) {
        if (!regex.test(input)
            || (input.includes('.') && ((input.indexOf('.')) % 4 !== 0 || input.count('.') > 1))) {
            if (!regex.test(input) || (input.indexOf('.')) % 4 !== 0 || input.count('.') > 1) {
                document.getElementById(rollbackTo).value = (last_valid === 'converter') ? converter_last_valid.replace(/\./g, ',') :
                    (last_valid.charAt(last_valid.length - 1) === "1") ? calculator_last_valid1.replace(/\./g, ',')
                        : calculator_last_valid2.replace(/\./g, ',')
                console.log(input.indexOf('.'))
                if ((input.indexOf('.')) !== 1) {
                    throwError(rollbackTo)
                }
                return false
            }
        } else {
            makeBackup(last_valid, input)
            return true
        }
    } else if ((input[0] === '-' && input.toString().length < 2 && regex !== regex_binary_abs && regex !== regex_binary_abs_int) || regex.test(input)) {
        makeBackup(last_valid, input)
        return true
    } else {
        document.getElementById(rollbackTo).value = (last_valid === 'converter') ? converter_last_valid.replace(/\./g, ',') :
            (last_valid.charAt(last_valid.length - 1) === "1") ? calculator_last_valid1.replace(/\./g, ',') : calculator_last_valid2.replace(/\./g, ',')
        throwError(rollbackTo)
        return false;
    }
}

function makeBackup(last_valid, input) {
    if (last_valid === 'converter') {
        converter_last_valid = input
    } else {
        if (last_valid.charAt(last_valid.length - 1) === "1")
            calculator_last_valid1 = input
        else
            calculator_last_valid2 = input
    }
}

function throwError(element) {
    setTimeout(() => {
        $('#' + element).removeClass("error")
    }, 500);
    $('#' + element).addClass("error")
}

function convertTo(input, source, dest, output) {
    let result = ""
    switch (source) {
        case "BCD":
        case "DC":
        case "IC":
        case "CC":
            result = convertFromBinary(input, source, output)
            return result
        default:
            result = new BigNumber(input, source)
            result = result.toString(dest)

            // if(dest === 2){
            //     let [integer, fraction = ''] = input.split(".")
            //     result = new BigNumber(integer, source)
            //     result = result.toString(dest) + "."
            //     if (fraction !== '') {
            //         let sum = "0." + parseInt(fraction)
            //         while(sum > 0.0000000000000005){
            //             sum = sum*2
            //             if(sum < 1) {
            //                 result += "0"
            //             }
            //             else {
            //                 result += "1"
            //                 sum = sum-1
            //             }
            //         }
            //     }
            // }

            if (output !== null) {
                document.getElementById(output).value = (result === "NaN" || result === "Infinity") ? "" : groupDigits(result, dest).replace(/\./g, ', ').toUpperCase()
                return result
            } else
                return result
    }
}

function convertToBinary(input, mode, output) {

    if (isNaN(input))
        return;
    let numb = new BigNumber(input)
    input = input.toString()
    let result = ""
    let temp
    let output1
    let output2
    let output3
    let output4
    let bits
    if (mode !== "normal") {
        return convertFromBinary(input, mode, output)
    }

    if (output === "converter") {
        output1 = "converter_output_4"
        output2 = "converter_output_5"
        output3 = "converter_output_6"
        output4 = "converter_output_7"
        bits = bits1
    } else {
        output1 = "calculator_output_5"
        output2 = "calculator_output_6"
        output3 = "calculator_output_7"
        output4 = "calculator_output_8"
        bits = bits2
    }
    let negative = false
    if (numb < 0 || input.charAt(0) === "-") {
        input = input.replace("-", "")
        negative = true
    }
    for (let i = 0; i < input.toString().length; i++) {
        if (input.charAt(i) !== ".") {
            temp = new BigNumber(input.charAt(i)).toString(2)
            temp = toFixedBinary(temp, 4)
            if (negative) {
                break;
            }
            result += temp
            if (input.charAt(i + 1) !== ".")
                result += " "
        } else
            result += ". "
    }
    document.getElementById(output1).value = negative ? $.i18n("Negative number not allowed!") : result.replace(/\./g, ',')   //BCD

    let error = false
    let error_msg = ""
    const integer = numb.toString(2).replace("-", "")

    if (integer.length >= bits || input.includes(".")) {
        error = true
        error_msg = input.includes(".") ? "Fraction number not allowed!" : "Not enough bits"
        error_msg = $.i18n(error_msg)
    }
    if (negative) {

        temp = toFixedBinary(integer.replace("-", ""), bits).replace(/^0/, "1")
        document.getElementById(output2).value = error ? error_msg : temp.replace(/\./g, ', ') //PK

        result = ""
        for (let i = 0; i < temp.length; i++) {
            result += temp[i] === "0" || i === 0 ? "1" : "0"
        }
        document.getElementById(output3).value = error ? error_msg : result;   //IK
        if (!negative)
            document.getElementById(output4).value = document.getElementById(output2).value
        else {
            if (input === "128")
                result = result.substring(1)
            result = error && input !== "128" ? error_msg : (new BigNumber(result, 2).plus(new BigNumber("1", 2)).toString(2));     //DK
            if (input === "0")
                result = result.substring(1)
            document.getElementById(output4).value = result
        }
    } else {
        if (input === "-") {
            document.getElementById(output1).value = ""
            document.getElementById(output2).value = "";
            document.getElementById(output3).value = "";
            document.getElementById(output4).value = "";
        } else {
            temp = toFixedBinary(groupDigits(integer, 2), bits)
            document.getElementById(output2).value = error ? error_msg : temp === "Infinity" ? "" : temp; //PK
            document.getElementById(output3).value = error ? error_msg : temp === "Infinity" ? "" : temp; //IK
            document.getElementById(output4).value = error ? error_msg : temp === "Infinity" ? "" : temp; //DK
        }
    }
}

function convertFromBinary(input, mode, output) {
    let result = ""

    if (mode === "BCD") {
        if ((input.includes('.') && (input.length - 1) % 4 !== 0)
            || ((!input.includes('.') && input.length % 4 !== 0))) {
            return "Waiting for input"
        }
        let temp = ""
        for (let i = 0; i < input.toString().length; i += 4) {
            if (input.charAt(i) !== ".") {
                temp = input.charAt(i) + input.charAt(i + 1) + input.charAt(i + 2) + input.charAt(i + 3)
                temp = convertTo(temp, 2, 10, null)
                if (parseInt(temp) > 9) {
                    // console.log("value error")
                    return "value error"
                }
                result += temp
            } else {
                result += "."
                i -= 3;
            }
        }
        if (output != null)
            document.getElementById(output).value = groupDigits(result, 2).replace(/\./g, ', ').toUpperCase()
    } else if (mode === "DC") {
        // console.log(input)
        if (input.charAt(0) === "1") {
            result += "-"
            input = input.substring(1)
        }
        result += convertTo(input, 2, 10, null)
        if (output)
            document.getElementById(output).value = groupDigits(result, 2).replace(/\./g, ', ').toUpperCase(); //result === "-0" ? result :
    } else if (mode === "IC") {
        if (input[0] === "1") {
            result += input[0];
            for (let i = 1; i < input.length; i++) {
                result += input[i] === "0" ? "1" : "0"
            }
        } else
            result = input
        result = convertFromBinary(result, "DC", output)
        if (output)
            document.getElementById(output).value = groupDigits(result, 2).replace(/\./g, ', ').toUpperCase(); //result === "-0" ? result :
    } else if (mode === "CC") {

        if (input.includes("1")) {
            result += new BigNumber(input, 2).minus(new BigNumber("1", 2)).toString(2)
            result = convertFromBinary(result, "IC", output)
        } else
            result = "0"

        if (output)
            document.getElementById(output).value = groupDigits(result, 2).replace(/\./g, ', ').toUpperCase();
    }
    return result
}

function groupDigits(input, source) {

    let numb = new BigNumber(input)

    let fmt = {
        decimalSeparator: '.',
        groupSeparator: ' ',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
    }
    switch (source) {
        case 2:
            fmt.groupSize = 8;
            fmt.fractionGroupSize = 8;
            break
        case 8:
        case 10:
            fmt.groupSize = 3;
            fmt.fractionGroupSize = 3;
            break
        case 16:
            fmt.groupSize = 4;
            fmt.fractionGroupSize = 4;
            break
        default:
            console.log("wrong");
            break;
    }
    if (source !== 16)
        return numb.toFormat(fmt)
    else {
        let regex = new RegExp("(.)(?=(.{" + fmt.groupSize + "})+$)", "g")
        return input.replace(regex, "$1 ");
    }
}


// ------------------------------ Calculator -----------------------------------------------------------------------------------------------

let calculator_first_op = document.getElementById('calculator_first_op').value;
let calculator_second_op = document.getElementById('calculator_second_op').value;
let calculator_operator = translateText(document.getElementById('calculator_op').value);
let calculator_last_valid1 = "";
let calculator_last_valid2 = "";
let first = "";
let second = "";
let toggler2 = true;
let calculator_bits = 8;
let bits2 = 8;


$("#calculator_first_number").on("input paste", function () {
    second = document.getElementById('calculator_second_number').value.replace(/,/g, '.')
    this.value = this.value.toUpperCase()
    first = this.value.replace(/,/g, '.')
    this.value = this.value.replace(/\./g, ',')
    if (first === "" && second === "") {
        calculator_reset(false, "")
        calculator_last_valid1 = ""
        calculator_last_valid2 = ""
        return
    }
    calculator_first_op = translateText(document.getElementById('calculator_first_op').value);
    if (isValid(first, toRegex(calculator_first_op), 'calculator1', 'calculator_first_number')) {
        calculate()
    }
})

$("#calculator_first_op").on("change", function () {
    calculator_first_op = translateText(this.value)
    first = document.getElementById('calculator_first_number').value.replace(/,/g, '.')
    if (isValid(first, toRegex(calculator_first_op), 'calculator1', 'calculator_first_number')) {
        calculate()
    } else {
        document.getElementById('calculator_first_number').value = ""
        first = ""
        calculate()

    }
})

$("#calculator_second_number").on("input paste", function () {
    first = document.getElementById('calculator_first_number').value.replace(/,/g, '.')
    this.value = this.value.toUpperCase()
    second = this.value.replace(/,/g, '.')
    this.value = this.value.replace(/\./g, ',')
    if (first === "" && second === "") {
        calculator_reset(false, "")
        calculator_last_valid1 = ""
        calculator_last_valid2 = ""
        return
    }
    calculator_second_op = translateText(document.getElementById('calculator_second_op').value);
    if (isValid(second, toRegex(calculator_second_op), 'calculator2', 'calculator_second_number')) {
        calculate()
    }
})

$("#calculator_second_op").on("change", function () {
    calculator_second_op = translateText(this.value)
    second = document.getElementById('calculator_second_number').value.replace(/,/g, '.')

    if (isValid(second, toRegex(calculator_second_op), 'calculator2', 'calculator_second_number')) {
        calculate()
    } else {
        document.getElementById('calculator_second_number').value = ""
        second = ""
        calculate()
    }
})

$("#calculator_op").on("input change paste", function () {
    calculator_operator = translateText(this.value)
    calculate()
})

$("#calculator_bits").on("change", function () {
    bits2 = this.value
    calculate()
})

function calculate() {
    calculator_first_op = translateText(document.getElementById('calculator_first_op').value);
    calculator_second_op = translateText(document.getElementById('calculator_second_op').value);
    calculator_operator = translateText(document.getElementById('calculator_op').value);
    bits2 = document.getElementById('calculator_bits').value
    let operator
    switch (calculator_first_op) {
        case "BCD code":
            operator = "BCD";
            break;
        case "Direct code":
            operator = "DC";
            break;
        case "Inverse code":
            operator = "IC";
            break;
        case "Complement code":
            operator = "CC";
            break;
        default:
            operator = parseInt(calculator_first_op);
    }
    let result = convertTo(first, operator, 10, null);
    if (result === "value error") {
        calculator_reset(false, "Value higher than 9")
        return
    } else if (result === "Waiting for input") {
        calculator_reset(false, result)
        return
    } else if (result === "NaN" || result === "") {
        return;
    }
    result = new BigNumber(result, 10)

    switch (calculator_second_op) {
        case "BCD code":
            operator = "BCD";
            break;
        case "Direct code":
            operator = "DC";
            break;
        case "Inverse code":
            operator = "IC";
            break;
        case "Complement code":
            operator = "CC";
            break;
        default:
            operator = parseInt(calculator_second_op);
    }
    let secondOp = convertTo(second.toString(), operator, 10, null);
    if (secondOp === "value error") {
        calculator_reset(false, "Value higher than 9")
        return
    } else if (secondOp === "Waiting for input") {
        calculator_reset(false, secondOp)
        return
    } else if (secondOp === "NaN" || secondOp === "") {
        // alert("none")
        return;
    }
    secondOp = new BigNumber(secondOp, 10)
    switch (calculator_operator) {
        case "add (+)":
            result = +result + +secondOp;
            break;
        case "sub (-)":
            result = +result - +secondOp;
            break;
        case "mul (*)":
            result = +result * +secondOp;
            break;
        case "div (/)":
            console.log(secondOp)
            if(secondOp == 0){
                calculator_reset(false, "Dividing with zero!")
                return
            }
            result = +result / +secondOp;
            break;
        case "mod (%)":
            result = +result % +secondOp;
            break;
        case "or (|)":
            result = +result | +secondOp;
            break;
        case "xor (^)":
            result = +result ^ +secondOp;
            break;
        case "and (&)":
            result = +result & +secondOp;
            break;
        default:
            result = "Error";
            break;
    }
    if (result === "Error") {
        console.log("fail")
        return
    }
    convertTo(result, 10, 2, 'calculator_output_1')
    convertTo(result, 10, 8, 'calculator_output_2')
    convertTo(result, 10, 10, 'calculator_output_3')
    convertTo(result, 10, 16, 'calculator_output_4')
    convertToBinary(result, "normal", "calculator")

}

function toRegex(operator) {
    switch (operator) {
        case "2":
            return regex_binary;
        case "8":
            return regex_octal;
        case "10":
            return regex_decimal;
        case "16":
            return regex_hexadecimal;
        case "BCD code":
            return regex_binary_abs;
        default:
            return regex_binary_abs_int;
    }
}

$("#binaryButton2").on("click", function () {
    toggleBin2(this)
})

function toggleBin2(btn) {
    if (toggler2) {
        $(".co8").hide()
        $(".co9").hide()
        $(".co10").hide()
        $(".co11").hide()

        $(".co12").show()
        $(".co13").show()
        $(".co14").show()
        $(".co15").show()
        $(".cb1").show()
        $(btn).css("background-color", "var(--lightPrimary)")
        $(btn).css("border-color", "var(--tableCells)")
        $(btn).css("color", "var(--textSecondary)")
    } else {
        $(".co8").show()
        $(".co9").show()
        $(".co10").show()
        $(".co11").show()
        $(".cb1").hide()
        $(".co12").hide()
        $(".co13").hide()
        $(".co14").hide()
        $(".co15").hide()
        $(btn).css("background-color", "var(--modalSwitchOnBackground)")
        $(btn).css("border-color", "var(--modalSwitchOnBackground)")
        $(btn).css("color", "var(--textPrimary)")
    }
    toggler2 = !toggler2
}

$("#calculator_converter_bits").on("change", function () {
    calculator_bits = this.value
})

$("#calculator_reset").on("click", function () {
    calculator_reset(true, "", true)
    calculator_last_valid1 = ""
    calculator_last_valid2 = ""
    bits2 = 8
    first = ""
    second = ""
})

//------------------------------- Map solver ---------------------------------------------------------------------------------------------

let Kmap = [];
let Kmap_UXNF = [];
let Kmap_SXNF = [];
let Kmap_IXNF = [];
let Kmap_MXNF = [];
let selected = 0;
Kmap.showMap = true;
Kmap.showCircuit = true;
Kmap.showTable = true;
Kmap.showExtras = false;

$(document).ready(function () {
    generateTable()
    generateMap()
    // jQuery('#loading').fadeOut(500);
});


$(".slider").on("input", function () {
    $('#modal_modeSwitch').prop("checked", true)
    if (this.value > 6)
        $('#loading').show();
    const output = document.getElementById("output");
    let compensate;
    if (this.value > 9)
        compensate = 0;
    else compensate = 6;
    const newValue = Number((this.value - this.min) * 100 / (this.max - this.min)),
        newPosition = compensate - (newValue * 0.25);
    output.style.marginLeft = `calc(${newValue}% + (${newPosition}px))`;
    output.innerHTML = `<span>${this.value}</span>`;
    setTimeout(function () {
        generateTable()
        generateMap()
        colorKmap()
        const circuit = document.getElementById("circuitDiv");
        circuit.style.display = "none"
    }, 0)

    setTimeout(function () {
        $('#loading').fadeOut(200);
    }, 1)
})

$("body")
    .delegate(".switch", "click", function () {
        let newState
        if (this.innerText === "0") {
            newState = "1"
            this.classList.add("switch_state_1")
            this.classList.remove("switch_state_0")
        } else if (this.innerText === "1") {
            newState = "&#x2715;"
            this.classList.add("switch_state_X")
            this.classList.remove("switch_state_1")
        } else {
            newState = "0"
            this.classList.add("switch_state_0")
            this.classList.remove("switch_state_X")
        }
        this.innerHTML = "<span class=\"switch_number\">" + newState + "</span>" +
            "<div class=\"switch_ball\"></div>"

        render(this.id, this.innerText)
    })
    .delegate('.TruthTable tr', "mouseenter", function () {
        $(this).css("background", "var(--tableRowHover)");
    })
    .delegate('.TruthTable tr', "mouseleave", function () {
        $(this).css("background", "var(--tableCells)");
    })
    .delegate('.highlight', "mouseenter", function () {
        // console.log(selected)
        if (selected === parseInt($(this).parent().attr('id').slice(-1))) {
            $(this).addClass("highlightBackground")
            if(selected === 3)
                highlightGroup(parseInt(this.id.substring(9).substring(0, 2)), parseInt(this.id.substring(12)))
            else
                highlightGroup(parseInt(this.id.substring(9).substring(0, 2)))
        }
    })
    .delegate('.highlight', "mouseleave", function () {
        if (selected === parseInt($(this).parent().attr('id').slice(-1))) {
            $(this).removeClass("highlightBackground")
            $('#Kmap > .cellRect')//.attr("fill", "var(--tableCells)")
                .removeClass("flashing")
            $('.hovered').css("background-color", "var(--tableCells)")
        }
    })

function highlightGroup(id, index = null) {
    if(index !== null) {
        Kmap = Kmap_IXNF[index]
        display_Format("IXNF", index)
    }

    Kmap.groups[id].forEach(item => {
        $('#cell' + item.id).prev("rect")
            .addClass("flashing")
        $('#tableRow' + item.id).css("background-color", "var(--tableRowHover)")
    })
}

$('#modal_modeSwitch').on("change", function () {
    if (this.checked) {
        Kmap.mode = 1
        $("#solver_result_1_label").i18n("udnf")
        $("#solver_result_2_label").i18n("sdnf")
        $("#solver_result_3_label").i18n("idnf")
        $("#solver_result_4_label").i18n("mdnf")
    } else {
        Kmap.mode = 0
        $("#solver_result_1_label").i18n("uknf")
        $("#solver_result_2_label").i18n("sknf")
        $("#solver_result_3_label").i18n("iknf")
        $("#solver_result_4_label").i18n("mknf")
    }
    if(Kmap.variables > 4) {
        $('#loading').show()
        setTimeout(function () {
            colorKmap()
        }, 0)
        setTimeout(function () {
            $('#loading').fadeOut(0);
        }, 1)
    }
    else
        colorKmap()
})

$('#modal_switch1').on("change", function () {
    Kmap.showTable = !!this.checked
    if (!Kmap.showTable) {
        $('#tableDiv').hide()
    } else {
        $('#tableDiv').show()
        // colorKmap()
    }
})

$('#modal_switch2').on("change", function () {
    Kmap.showMap = !!this.checked
    if (!Kmap.showMap) {
        $('#KmapDiv').hide()
    } else {
        $('#KmapDiv').show()
        $('#loading').show()
        setTimeout(function () {
            display_Format("MXNF")
        }, 0)
        setTimeout(function () {
            $('#loading').fadeOut(0);
        }, 1)
    }
})

$('#modal_switch3').on("change", function () {
    Kmap.showCircuit = !!this.checked
    if (!Kmap.showCircuit) {
        $('#circuitDiv').hide()
    } else {
        $('#circuitDiv').show()
        $('#loading').show()
        setTimeout(function () {
            display_Format("MXNF")
        }, 0)
        setTimeout(function () {
            $('#loading').fadeOut(0);
        }, 1)
    }
})

$('#modal_switch4').on("change", function () {
    Kmap.showExtras = !!this.checked
    if (!Kmap.showExtras) {
        $(".map_extras").hide()
    } else
        $(".map_extras").show()
})

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateTable() {
    const variables = document.getElementById("slider").value;
    const table = document.getElementById("tableDiv");
    let stringBuilder = ""

    stringBuilder += "<table class=\"TruthTable\">\n" +
        "<tr>\n" +
        "<th>S</th>"
    for (let j = 0; j < variables; j++) {
        stringBuilder +=
            "<th>" + alphabet.charAt(j) + "</th>"
    }
    stringBuilder +=
        "<th>Y</th>" +
        "</tr>"

    for (let i = 0; i < Math.pow(2, variables); i++) {
        stringBuilder +=
            "<tr class='hovered' id='tableRow" + i + "'>" +
            "<td>" + i + "</td>"
        for (let j = 0; j < variables; j++) {
            stringBuilder +=
                "<td>" + toFixedBinary(i, variables).charAt(j) + "</td>"
        }
        stringBuilder +=
            "<td>" +
            "<div id=\"switch" + i + "\" class=\"switch switch_state_0\">" +
            "<span class=\"switch_number\">0</span>" +
            "<div class=\"switch_ball\"></div>" +
            "</div>" +
            "</td>" +
            "</tr>"
    }
    table.innerHTML = stringBuilder
}

function toFixedBinary(num, length) {
    let result = num.toString(2);

    if (result.length !== length) {
        length -= result.length
        while (length-- > 0) {
            result = "0" + result;
        }
    }
    return result
}

function coordsToId(row, variablesRow, col, variablesCol) {
    let binaryRow = toFixedBinary(matchKmapPosition(row), variablesRow)
    let binaryCol = toFixedBinary(matchKmapPosition(col), variablesCol)
    return parseInt(binaryRow + binaryCol, 2)
}

function matchKmapPosition(position) {
    return (position ^ Math.floor(position / 2))
}

let yOffset = 40
let xOffset = 0


function generateMap() {
    Kmap.variables = parseInt(document.getElementById("slider").value);

    const map = document.getElementById("KmapDiv");
    let stringBuilder = ""
    let stringBuilderExtras = ""
    // let cellId = 0

    if (Kmap.variables % 2 === 0) {
        Kmap.width = Kmap.height = Kmap.width = Math.sqrt(Math.pow(2, Kmap.variables))
    } else {
        Kmap.width = Math.sqrt(Math.pow(2, +Kmap.variables + +1))
        Kmap.height = Math.pow(2, Kmap.variables) / Kmap.width
    }
    Kmap.mode = 1
    Kmap.groups = []


    if(Kmap.variables >= 9){
        xOffset = 38
        yOffset = 45
    } else if (Kmap.variables >= 6) {
        xOffset = 25
    } else xOffset = 0

    stringBuilder += "<svg width=\"" + (Kmap.width * 40 + 60 + xOffset) + "\" height=\"" + (Kmap.height * 40 + 120) + "\" id=\"Kmap\">"

    for (let y = 0; y < Kmap.height; y++) {
        Kmap[y] = [];
        for (let x = 0; x < Kmap.width; x++) {
            Kmap[y][x] = []
            Kmap[y][x].value = 0;
            Kmap[y][x].id = coordsToId(y, Math.floor(Kmap.variables / 2), x, Math.ceil(Kmap.variables / 2))
            Kmap[y][x].posX = 40 * (x + 1)
            Kmap[y][x].posY = 40 * (y + 1)
            Kmap[y][x].inGroup = -1
            stringBuilder +=
                "<rect class='cellRect' x=\"" + ((x + 1) * 40 + xOffset) + "\" y=\"" + ((y + 1) * 40 + yOffset) + "\" height=\"40\" width=\"40\" fill=\"var(--tableCells)\" " +
                "stroke=\"var(--tableCellsBorder)\" stroke-width=\"2\"></rect>" +
                "<text class='map_extras' style='display: none;z-index: 10000' fill=\"var(--sliderLine)\" font-family=\"sans-serif\" font-size=\"10\" x=\"" + ( 2+((x + 1) * 40) + xOffset) + "\" y=\"" + (37+(((y + 1) * 40)) + yOffset) + "\">"+ Kmap[y][x].id + "</text>" +
            "<text fill=\"var(--tableFontColor)\" font-family=\"sans-serif\" text-anchor=\"middle\" id=\"cell" + Kmap[y][x].id + "\" " +
                "font-size=\"20\" x=\"" + (20 + ((x + 1) * 40) + xOffset) + "\" y=\"" + ((27 + ((y + 1) * 40)) + yOffset) + "\">" + 0 + "</text>";
        }
    }

    switch (Kmap.variables) {
        case 1:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M 80," + (29 + yOffset) + " L 80," + (33 + yOffset) + " M 80," + (31 + yOffset) + " L 120," + (31 + yOffset) + " M 120," + (29 + yOffset) + " L 120," + (33 + yOffset) + "\"></path>";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:95px;\">" +
                "<i>A</i></div>"
            break;
        case 2:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M 28," + (80 + yOffset) + " L 32," + (80 + yOffset) + " M 30," + (80 + yOffset) + " L 30," + (120 + yOffset) + " M 28," + (120 + yOffset) + " L 32," + (120 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M 80," + (29 + yOffset) + " L 80," + (33 + yOffset) + " M 80," + (31 + yOffset) + " L 120," + (31 + yOffset) + " M 120," + (29 + yOffset) + " L 120," + (33 + yOffset) + "\"></path>";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (86 + yOffset) + "px; left:11px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:95px;\">" +
                "<i>B</i></div>"
            break;
        case 3:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M 28," + (80 + yOffset) + " L 32," + (80 + yOffset) + " M 30," + (80 + yOffset) + " L 30," + (120 + yOffset) + " M 28," + (120 + yOffset) + " L 32," + (120 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M 80," + (29 + yOffset) + " L 80," + (33 + yOffset) + " M 80," + (31 + yOffset) + " L 160," + (31 + yOffset) + " M 160," + (29 + yOffset) + " L 160," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M 120," + (23 + yOffset) + " L 120," + (27 + yOffset) + " M 120," + (25 + yOffset) + " L 200," + (25 + yOffset) + " M 200," + (23 + yOffset) + " L 200," + (27 + yOffset) + "\"></path>";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (86 + yOffset) + "px; left:11px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-3 + yOffset) + "px; left:155px;\">" +
                "<i>B</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:95px;\">" +
                "<i>C</i></div>"

            break;
        case 4:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M 28," + (120 + yOffset) + " L 32," + (120 + yOffset) + " M 30," + (120 + yOffset) + " L 30," + (200 + yOffset) + " M 28," + (200 + yOffset) + " L 32," + (200 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M 22," + (80 + yOffset) + " L 26," + (80 + yOffset) + " M 24," + (80 + yOffset) + " L 24," + (160 + yOffset) + " M 22," + (160 + yOffset) + " L 26," + (160 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M 80," + (29 + yOffset) + " L 80," + (33 + yOffset) + " M 80," + (31 + yOffset) + " L 160," + (31 + yOffset) + " M 160," + (29 + yOffset) + " L 160," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M 120," + (23 + yOffset) + " L 120," + (27 + yOffset) + " M 120," + (25 + yOffset) + " L 200," + (25 + yOffset) + " M 200," + (23 + yOffset) + " L 200," + (27 + yOffset) + "\"></path>";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (165 + yOffset) + "px; left:11px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (105 + yOffset) + "px; left:5px;\">" +
                "<i>B</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-3 + yOffset) + "px; left:155px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:95px;\">" +
                "<i>D</i></div>"
            break;
        case 5:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M 28," + (120 + yOffset) + " L 32," + (120 + yOffset) + " M 30," + (120 + yOffset) + " L 30," + (200 + yOffset) + " M 28," + (200 + yOffset) + " L 32," + (200 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M 22," + (80 + yOffset) + " L 26," + (80 + yOffset) + " M 24," + (80 + yOffset) + " L 24," + (160 + yOffset) + " M 22," + (160 + yOffset) + " L 26," + (160 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M 200," + (4 + yOffset) + " L 200," + (8 + yOffset) + " M 200," + (6 + yOffset) + " L 360," + (6 + yOffset) + " M 360," + (4 + yOffset) + " L 360," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M 80," + (29 + yOffset) + " L 80," + (33 + yOffset) + " M 80," + (31 + yOffset) + " L 160," + (31 + yOffset) + " M 160," + (29 + yOffset) + " L 160," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E2
                "d=\"M 240," + (29 + yOffset) + " L 240," + (33 + yOffset) + " M 240," + (31 + yOffset) + " L 320," + (31 + yOffset) + " M 320," + (29 + yOffset) + " L 320," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M 120," + (17 + yOffset) + " L 120," + (21 + yOffset) + " M 120," + (19 + yOffset) + " L 280," + (19 + yOffset) + " M 280," + (17 + yOffset) + " L 280," + (21 + yOffset) + "\"></path> ";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (165 + yOffset) + "px; left:11px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (105 + yOffset) + "px; left:5px;\">" +
                "<i>B</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:275px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:155px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:95px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:295px;\">" +
                "<i>E</i></div>"
            break;
        case 6:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (4 + xOffset) + "," + (200 + yOffset) + " L " + (8 + xOffset) + "," + (200 + yOffset) + " M " + (6 + xOffset) + "," + (200 + yOffset) + " L " + (6 + xOffset) + "," + (360 + yOffset) + " M " + (4 + xOffset) + "," + (360 + yOffset) + " L " + (8 + xOffset) + "," + (360 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (28 + xOffset) + "," + (80 + yOffset) + " L " + (32 + xOffset) + "," + (80 + yOffset) + " M " + (30 + xOffset) + "," + (80 + yOffset) + " L " + (30 + xOffset) + "," + (160 + yOffset) + " M " + (28 + xOffset) + "," + (160 + yOffset) + " L " + (32 + xOffset) + "," + (160 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C2
                "d=\"M " + (28 + xOffset) + "," + (240 + yOffset) + " L " + (32 + xOffset) + "," + (240 + yOffset) + " M " + (30 + xOffset) + "," + (240 + yOffset) + " L " + (30 + xOffset) + "," + (320 + yOffset) + " M " + (28 + xOffset) + "," + (320 + yOffset) + " L " + (32 + xOffset) + "," + (320 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (16 + xOffset) + "," + (120 + yOffset) + " L " + (20 + xOffset) + "," + (120 + yOffset) + " M " + (18 + xOffset) + "," + (120 + yOffset) + " L " + (18 + xOffset) + "," + (280 + yOffset) + " M " + (16 + xOffset) + "," + (280 + yOffset) + " L " + (20 + xOffset) + "," + (280 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (200 + xOffset) + "," + (4 + yOffset) + " L " + (200 + xOffset) + "," + (8 + yOffset) + " M " + (200 + xOffset) + "," + (6 + yOffset) + " L " + (360 + xOffset) + "," + (6 + yOffset) + " M " + (360 + xOffset) + "," + (4 + yOffset) + " L " + (360 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (80 + xOffset) + "," + (29 + yOffset) + " L " + (80 + xOffset) + "," + (33 + yOffset) + " M " + (80 + xOffset) + "," + (31 + yOffset) + " L " + (160 + xOffset) + "," + (31 + yOffset) + " M " + (160 + xOffset) + "," + (29 + yOffset) + " L " + (160 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F2
                "d=\"M " + (240 + xOffset) + "," + (29 + yOffset) + " L " + (240 + xOffset) + "," + (33 + yOffset) + " M " + (240 + xOffset) + "," + (31 + yOffset) + " L " + (320 + xOffset) + "," + (31 + yOffset) + " M " + (320 + xOffset) + "," + (29 + yOffset) + " L " + (320 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (120 + xOffset) + "," + (17 + yOffset) + " L " + (120 + xOffset) + "," + (21 + yOffset) + " M " + (120 + xOffset) + "," + (19 + yOffset) + " L " + (280 + xOffset) + "," + (19 + yOffset) + " M " + (280 + xOffset) + "," + (17 + yOffset) + " L " + (280 + xOffset) + "," + (21 + yOffset) + "\"></path> ";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (265 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (85 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (285 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (145 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>B</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (275 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (155 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (95 + xOffset) + "px;\">" +
                "<i>F</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (295 + xOffset) + "px;\">" +
                "<i>F</i></div>"
            break;
        case 7:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (4 + xOffset) + "," + (200 + yOffset) + " L " + (8 + xOffset) + "," + (200 + yOffset) + " M " + (6 + xOffset) + "," + (200 + yOffset) + " L " + (6 + xOffset) + "," + (360 + yOffset) + " M " + (4 + xOffset) + "," + (360 + yOffset) + " L " + (8 + xOffset) + "," + (360 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (28 + xOffset) + "," + (80 + yOffset) + " L " + (32 + xOffset) + "," + (80 + yOffset) + " M " + (30 + xOffset) + "," + (80 + yOffset) + " L " + (30 + xOffset) + "," + (160 + yOffset) + " M " + (28 + xOffset) + "," + (160 + yOffset) + " L " + (32 + xOffset) + "," + (160 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C2
                "d=\"M " + (28 + xOffset) + "," + (240 + yOffset) + " L " + (32 + xOffset) + "," + (240 + yOffset) + " M " + (30 + xOffset) + "," + (240 + yOffset) + " L " + (30 + xOffset) + "," + (320 + yOffset) + " M " + (28 + xOffset) + "," + (320 + yOffset) + " L " + (32 + xOffset) + "," + (320 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (16 + xOffset) + "," + (120 + yOffset) + " L " + (20 + xOffset) + "," + (120 + yOffset) + " M " + (18 + xOffset) + "," + (120 + yOffset) + " L " + (18 + xOffset) + "," + (280 + yOffset) + " M " + (16 + xOffset) + "," + (280 + yOffset) + " L " + (20 + xOffset) + "," + (280 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (200 + xOffset) + "," + (4 + yOffset) + " L " + (200 + xOffset) + "," + (8 + yOffset) + " M " + (200 + xOffset) + "," + (6 + yOffset) + " L " + (520 + xOffset) + "," + (6 + yOffset) + " M " + (520 + xOffset) + "," + (4 + yOffset) + " L " + (520 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (80 + xOffset) + "," + (29 + yOffset) + " L " + (80 + xOffset) + "," + (33 + yOffset) + " M " + (80 + xOffset) + "," + (31 + yOffset) + " L " + (160 + xOffset) + "," + (31 + yOffset) + " M " + (160 + xOffset) + "," + (29 + yOffset) + " L " + (160 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (240 + xOffset) + "," + (29 + yOffset) + " L " + (240 + xOffset) + "," + (33 + yOffset) + " M " + (240 + xOffset) + "," + (31 + yOffset) + " L " + (320 + xOffset) + "," + (31 + yOffset) + " M " + (320 + xOffset) + "," + (29 + yOffset) + " L " + (320 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (120 + xOffset) + "," + (17 + yOffset) + " L " + (120 + xOffset) + "," + (21 + yOffset) + " M " + (120 + xOffset) + "," + (19 + yOffset) + " L " + (280 + xOffset) + "," + (19 + yOffset) + " M " + (280 + xOffset) + "," + (17 + yOffset) + " L " + (280 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (360 + xOffset) + "," + (-9 + yOffset) + " L " + (360 + xOffset) + "," + (-5 + yOffset) + " M " + (360 + xOffset) + "," + (-7 + yOffset) + " L " + (680 + xOffset) + "," + (-7 + yOffset) + " M " + (680 + xOffset) + "," + (-9 + yOffset) + " L " + (680 + xOffset) + "," + (-5 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (560 + xOffset) + "," + (29 + yOffset) + " L " + (560 + xOffset) + "," + (33 + yOffset) + " M " + (560 + xOffset) + "," + (31 + yOffset) + " L " + (640 + xOffset) + "," + (31 + yOffset) + " M " + (640 + xOffset) + "," + (29 + yOffset) + " L " + (640 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (400 + xOffset) + "," + (29 + yOffset) + " L " + (400 + xOffset) + "," + (33 + yOffset) + " M " + (400 + xOffset) + "," + (31 + yOffset) + " L " + (480 + xOffset) + "," + (31 + yOffset) + " M " + (480 + xOffset) + "," + (29 + yOffset) + " L " + (480 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F2
                "d=\"M " + (440 + xOffset) + "," + (17 + yOffset) + " L " + (440 + xOffset) + "," + (21 + yOffset) + " M " + (440 + xOffset) + "," + (19 + yOffset) + " L " + (600 + xOffset) + "," + (19 + yOffset) + " M " + (600 + xOffset) + "," + (17 + yOffset) + " L " + (600 + xOffset) + "," + (21 + yOffset) + "\"></path> ";

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (265 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>A</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (85 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (285 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (145 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>B</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (275 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (155 + xOffset) + "px;\">" +
                "<i>F</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (95 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (295 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-34 + yOffset) + "px; left:" + (512 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (415 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (615 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (555 + xOffset) + "px;\">" +
                "<i>F</i></div>";
            break;
        case 8:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (-9 + xOffset) + "," + (360 + yOffset) + " L " + (-5 + xOffset) + "," + (360 + yOffset) + " M " + (-7 + xOffset) + "," + (360 + yOffset) + " L " + (-7 + xOffset) + "," + (680 + yOffset) + " M " + (-9 + xOffset) + "," + (680 + yOffset) + " L " + (-5 + xOffset) + "," + (680 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (4 + xOffset) + "," + (200 + yOffset) + " L " + (8 + xOffset) + "," + (200 + yOffset) + " M " + (6 + xOffset) + "," + (200 + yOffset) + " L " + (6 + xOffset) + "," + (520 + yOffset) + " M " + (4 + xOffset) + "," + (520 + yOffset) + " L " + (8 + xOffset) + "," + (520 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (80 + yOffset) + " L " + (32 + xOffset) + "," + (80 + yOffset) + " M " + (30 + xOffset) + "," + (80 + yOffset) + " L " + (30 + xOffset) + "," + (160 + yOffset) + " M " + (28 + xOffset) + "," + (160 + yOffset) + " L " + (32 + xOffset) + "," + (160 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (240 + yOffset) + " L " + (32 + xOffset) + "," + (240 + yOffset) + " M " + (30 + xOffset) + "," + (240 + yOffset) + " L " + (30 + xOffset) + "," + (320 + yOffset) + " M " + (28 + xOffset) + "," + (320 + yOffset) + " L " + (32 + xOffset) + "," + (320 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (400 + yOffset) + " L " + (32 + xOffset) + "," + (400 + yOffset) + " M " + (30 + xOffset) + "," + (400 + yOffset) + " L " + (30 + xOffset) + "," + (480 + yOffset) + " M " + (28 + xOffset) + "," + (480 + yOffset) + " L " + (32 + xOffset) + "," + (480 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (560 + yOffset) + " L " + (32 + xOffset) + "," + (560 + yOffset) + " M " + (30 + xOffset) + "," + (560 + yOffset) + " L " + (30 + xOffset) + "," + (640 + yOffset) + " M " + (28 + xOffset) + "," + (640 + yOffset) + " L " + (32 + xOffset) + "," + (640 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (120 + yOffset) + " L " + (20 + xOffset) + "," + (120 + yOffset) + " M " + (18 + xOffset) + "," + (120 + yOffset) + " L " + (18 + xOffset) + "," + (280 + yOffset) + " M " + (16 + xOffset) + "," + (280 + yOffset) + " L " + (20 + xOffset) + "," + (280 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (440 + yOffset) + " L " + (20 + xOffset) + "," + (440 + yOffset) + " M " + (18 + xOffset) + "," + (440 + yOffset) + " L " + (18 + xOffset) + "," + (600 + yOffset) + " M " + (16 + xOffset) + "," + (600 + yOffset) + " L " + (20 + xOffset) + "," + (600 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (200 + xOffset) + "," + (4 + yOffset) + " L " + (200 + xOffset) + "," + (8 + yOffset) + " M " + (200 + xOffset) + "," + (6 + yOffset) + " L " + (520 + xOffset) + "," + (6 + yOffset) + " M " + (520 + xOffset) + "," + (4 + yOffset) + " L " + (520 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (80 + xOffset) + "," + (29 + yOffset) + " L " + (80 + xOffset) + "," + (33 + yOffset) + " M " + (80 + xOffset) + "," + (31 + yOffset) + " L " + (160 + xOffset) + "," + (31 + yOffset) + " M " + (160 + xOffset) + "," + (29 + yOffset) + " L " + (160 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (240 + xOffset) + "," + (29 + yOffset) + " L " + (240 + xOffset) + "," + (33 + yOffset) + " M " + (240 + xOffset) + "," + (31 + yOffset) + " L " + (320 + xOffset) + "," + (31 + yOffset) + " M " + (320 + xOffset) + "," + (29 + yOffset) + " L " + (320 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (120 + xOffset) + "," + (17 + yOffset) + " L " + (120 + xOffset) + "," + (21 + yOffset) + " M " + (120 + xOffset) + "," + (19 + yOffset) + " L " + (280 + xOffset) + "," + (19 + yOffset) + " M " + (280 + xOffset) + "," + (17 + yOffset) + " L " + (280 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                "d=\"M " + (360 + xOffset) + "," + (-9 + yOffset) + " L " + (360 + xOffset) + "," + (-5 + yOffset) + " M " + (360 + xOffset) + "," + (-7 + yOffset) + " L " + (680 + xOffset) + "," + (-7 + yOffset) + " M " + (680 + xOffset) + "," + (-9 + yOffset) + " L " + (680 + xOffset) + "," + (-5 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (560 + xOffset) + "," + (29 + yOffset) + " L " + (560 + xOffset) + "," + (33 + yOffset) + " M " + (560 + xOffset) + "," + (31 + yOffset) + " L " + (640 + xOffset) + "," + (31 + yOffset) + " M " + (640 + xOffset) + "," + (29 + yOffset) + " L " + (640 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (400 + xOffset) + "," + (29 + yOffset) + " L " + (400 + xOffset) + "," + (33 + yOffset) + " M " + (400 + xOffset) + "," + (31 + yOffset) + " L " + (480 + xOffset) + "," + (31 + yOffset) + " M " + (480 + xOffset) + "," + (29 + yOffset) + " L " + (480 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F2
                "d=\"M " + (440 + xOffset) + "," + (17 + yOffset) + " L " + (440 + xOffset) + "," + (21 + yOffset) + " M " + (440 + xOffset) + "," + (19 + yOffset) + " L " + (600 + xOffset) + "," + (19 + yOffset) + " M " + (600 + xOffset) + "," + (17 + yOffset) + " L " + (600 + xOffset) + "," + (21 + yOffset) + "\"></path> ";

            stringBuilderExtras =

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (505 + yOffset) + "px; left:" + (-23 + xOffset) + "px;\">" +
                "<i>A</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (265 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>B</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (85 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (285 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (405 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (605 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (145 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (545 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>C</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (275 + xOffset) + "px;\">" +
                "<i>F</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (155 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (95 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (295 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-34 + yOffset) + "px; left:" + (512 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (415 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (615 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (555 + xOffset) + "px;\">" +
                "<i>G</i></div>";
            break;
        case 9:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (-9 + xOffset) + "," + (360 + yOffset) + " L " + (-5 + xOffset) + "," + (360 + yOffset) + " M " + (-7 + xOffset) + "," + (360 + yOffset) + " L " + (-7 + xOffset) + "," + (680 + yOffset) + " M " + (-9 + xOffset) + "," + (680 + yOffset) + " L " + (-5 + xOffset) + "," + (680 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (4 + xOffset) + "," + (200 + yOffset) + " L " + (8 + xOffset) + "," + (200 + yOffset) + " M " + (6 + xOffset) + "," + (200 + yOffset) + " L " + (6 + xOffset) + "," + (520 + yOffset) + " M " + (4 + xOffset) + "," + (520 + yOffset) + " L " + (8 + xOffset) + "," + (520 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (80 + yOffset) + " L " + (32 + xOffset) + "," + (80 + yOffset) + " M " + (30 + xOffset) + "," + (80 + yOffset) + " L " + (30 + xOffset) + "," + (160 + yOffset) + " M " + (28 + xOffset) + "," + (160 + yOffset) + " L " + (32 + xOffset) + "," + (160 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (240 + yOffset) + " L " + (32 + xOffset) + "," + (240 + yOffset) + " M " + (30 + xOffset) + "," + (240 + yOffset) + " L " + (30 + xOffset) + "," + (320 + yOffset) + " M " + (28 + xOffset) + "," + (320 + yOffset) + " L " + (32 + xOffset) + "," + (320 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (400 + yOffset) + " L " + (32 + xOffset) + "," + (400 + yOffset) + " M " + (30 + xOffset) + "," + (400 + yOffset) + " L " + (30 + xOffset) + "," + (480 + yOffset) + " M " + (28 + xOffset) + "," + (480 + yOffset) + " L " + (32 + xOffset) + "," + (480 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (560 + yOffset) + " L " + (32 + xOffset) + "," + (560 + yOffset) + " M " + (30 + xOffset) + "," + (560 + yOffset) + " L " + (30 + xOffset) + "," + (640 + yOffset) + " M " + (28 + xOffset) + "," + (640 + yOffset) + " L " + (32 + xOffset) + "," + (640 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (120 + yOffset) + " L " + (20 + xOffset) + "," + (120 + yOffset) + " M " + (18 + xOffset) + "," + (120 + yOffset) + " L " + (18 + xOffset) + "," + (280 + yOffset) + " M " + (16 + xOffset) + "," + (280 + yOffset) + " L " + (20 + xOffset) + "," + (280 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (440 + yOffset) + " L " + (20 + xOffset) + "," + (440 + yOffset) + " M " + (18 + xOffset) + "," + (440 + yOffset) + " L " + (18 + xOffset) + "," + (600 + yOffset) + " M " + (16 + xOffset) + "," + (600 + yOffset) + " L " + (20 + xOffset) + "," + (600 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (200 + xOffset) + "," + (4 + yOffset) + " L " + (200 + xOffset) + "," + (8 + yOffset) + " M " + (200 + xOffset) + "," + (6 + yOffset) + " L " + (520 + xOffset) + "," + (6 + yOffset) + " M " + (520 + xOffset) + "," + (4 + yOffset) + " L " + (520 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (80 + xOffset) + "," + (29 + yOffset) + " L " + (80 + xOffset) + "," + (33 + yOffset) + " M " + (80 + xOffset) + "," + (31 + yOffset) + " L " + (160 + xOffset) + "," + (31 + yOffset) + " M " + (160 + xOffset) + "," + (29 + yOffset) + " L " + (160 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (240 + xOffset) + "," + (29 + yOffset) + " L " + (240 + xOffset) + "," + (33 + yOffset) + " M " + (240 + xOffset) + "," + (31 + yOffset) + " L " + (320 + xOffset) + "," + (31 + yOffset) + " M " + (320 + xOffset) + "," + (29 + yOffset) + " L " + (320 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (120 + xOffset) + "," + (17 + yOffset) + " L " + (120 + xOffset) + "," + (21 + yOffset) + " M " + (120 + xOffset) + "," + (19 + yOffset) + " L " + (280 + xOffset) + "," + (19 + yOffset) + " M " + (280 + xOffset) + "," + (17 + yOffset) + " L " + (280 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                "d=\"M " + (360 + xOffset) + "," + (-9 + yOffset) + " L " + (360 + xOffset) + "," + (-5 + yOffset) + " M " + (360 + xOffset) + "," + (-7 + yOffset) + " L " + (1000 + xOffset) + "," + (-7 + yOffset) + " M " + (1000 + xOffset) + "," + (-9 + yOffset) + " L " + (1000 + xOffset) + "," + (-5 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (560 + xOffset) + "," + (29 + yOffset) + " L " + (560 + xOffset) + "," + (33 + yOffset) + " M " + (560 + xOffset) + "," + (31 + yOffset) + " L " + (640 + xOffset) + "," + (31 + yOffset) + " M " + (640 + xOffset) + "," + (29 + yOffset) + " L " + (640 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (400 + xOffset) + "," + (29 + yOffset) + " L " + (400 + xOffset) + "," + (33 + yOffset) + " M " + (400 + xOffset) + "," + (31 + yOffset) + " L " + (480 + xOffset) + "," + (31 + yOffset) + " M " + (480 + xOffset) + "," + (29 + yOffset) + " L " + (480 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F2
                "d=\"M " + (440 + xOffset) + "," + (17 + yOffset) + " L " + (440 + xOffset) + "," + (21 + yOffset) + " M " + (440 + xOffset) + "," + (19 + yOffset) + " L " + (600 + xOffset) + "," + (19 + yOffset) + " M " + (600 + xOffset) + "," + (17 + yOffset) + " L " + (600 + xOffset) + "," + (21 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                "d=\"M " + (680 + xOffset) + "," + (-22 + yOffset) + " L " + (680 + xOffset) + "," + (-18 + yOffset) + " M " + (680 + xOffset) + "," + (-20 + yOffset) + " L " + (1320 + xOffset) + "," + (-20 + yOffset) + " M " + (1320 + xOffset) + "," + (-22 + yOffset) + " L " + (1320 + xOffset) + "," + (-18 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (720 + xOffset) + "," + (29 + yOffset) + " L " + (720 + xOffset) + "," + (33 + yOffset) + " M " + (720 + xOffset) + "," + (31 + yOffset) + " L " + (800 + xOffset) + "," + (31 + yOffset) + " M " + (800 + xOffset) + "," + (29 + yOffset) + " L " + (800 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (840 + xOffset) + "," + (4 + yOffset) + " L " + (840 + xOffset) + "," + (8 + yOffset) + " M " + (840 + xOffset) + "," + (6 + yOffset) + " L " + (1160 + xOffset) + "," + (6 + yOffset) + " M " + (1160 + xOffset) + "," + (4 + yOffset) + " L " + (1160 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (880 + xOffset) + "," + (29 + yOffset) + " L " + (880 + xOffset) + "," + (33 + yOffset) + " M " + (880 + xOffset) + "," + (31 + yOffset) + " L " + (960 + xOffset) + "," + (31 + yOffset) + " M " + (960 + xOffset) + "," + (29 + yOffset) + " L " + (960 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (760 + xOffset) + "," + (17 + yOffset) + " L " + (760 + xOffset) + "," + (21 + yOffset) + " M " + (760 + xOffset) + "," + (19 + yOffset) + " L " + (920 + xOffset) + "," + (19 + yOffset) + " M " + (920 + xOffset) + "," + (17 + yOffset) + " L " + (920 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (1080 + xOffset) + "," + (17 + yOffset) + " L " + (1080 + xOffset) + "," + (21 + yOffset) + " M " + (1080 + xOffset) + "," + (19 + yOffset) + " L " + (1240 + xOffset) + "," + (19 + yOffset) + " M " + (1240 + xOffset) + "," + (17 + yOffset) + " L " + (1240 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                // "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                // "d=\"M "+(1000 + xOffset)+","+(-9 + yOffset)+" L "+(1000 + xOffset)+","+(-5 + yOffset)+" M "+(1000 + xOffset)+","+(-7 + yOffset)+" L "+(1320 + xOffset)+","+(-7 + yOffset)+" M "+(1320 + xOffset)+","+(-9 + yOffset)+" L "+(1320 + xOffset)+","+(-5 + yOffset)+"\"></path>"+
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (1200 + xOffset) + "," + (29 + yOffset) + " L " + (1200 + xOffset) + "," + (33 + yOffset) + " M " + (1200 + xOffset) + "," + (31 + yOffset) + " L " + (1280 + xOffset) + "," + (31 + yOffset) + " M " + (1280 + xOffset) + "," + (29 + yOffset) + " L " + (1280 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (1040 + xOffset) + "," + (29 + yOffset) + " L " + (1040 + xOffset) + "," + (33 + yOffset) + " M " + (1040 + xOffset) + "," + (31 + yOffset) + " L " + (1120 + xOffset) + "," + (31 + yOffset) + " M " + (1120 + xOffset) + "," + (29 + yOffset) + " L " + (1120 + xOffset) + "," + (33 + yOffset) + "\"></path>"
            ;


            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (505 + yOffset) + "px; left:" + (-23 + xOffset) + "px;\">" +
                "<i>A</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (265 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>B</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (85 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (285 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (405 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (605 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>D</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (145 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>C</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (545 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>C</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (275 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (155 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (95 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (295 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-34 + yOffset) + "px; left:" + (512 + xOffset) + "px;\">" +
                "<i>F</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (415 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (615 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (555 + xOffset) + "px;\">" +
                "<i>H</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (735 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (935 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (1055 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (1255 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (795 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (1195 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (1075 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-48 + yOffset) + "px; left:" + (995 + xOffset) + "px;\">" +
                "<i>E</i></div>"
            ;
            break;
        case 10:
            stringBuilder +=
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (-9 + xOffset) + "," + (360 + yOffset) + " L " + (-5 + xOffset) + "," + (360 + yOffset) + " M " + (-7 + xOffset) + "," + (360 + yOffset) + " L " + (-7 + xOffset) + "," + (1000 + yOffset) + " M " + (-9 + xOffset) + "," + (1000 + yOffset) + " L " + (-5 + xOffset) + "," + (1000 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (4 + xOffset) + "," + (200 + yOffset) + " L " + (8 + xOffset) + "," + (200 + yOffset) + " M " + (6 + xOffset) + "," + (200 + yOffset) + " L " + (6 + xOffset) + "," + (520 + yOffset) + " M " + (4 + xOffset) + "," + (520 + yOffset) + " L " + (8 + xOffset) + "," + (520 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (80 + yOffset) + " L " + (32 + xOffset) + "," + (80 + yOffset) + " M " + (30 + xOffset) + "," + (80 + yOffset) + " L " + (30 + xOffset) + "," + (160 + yOffset) + " M " + (28 + xOffset) + "," + (160 + yOffset) + " L " + (32 + xOffset) + "," + (160 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (240 + yOffset) + " L " + (32 + xOffset) + "," + (240 + yOffset) + " M " + (30 + xOffset) + "," + (240 + yOffset) + " L " + (30 + xOffset) + "," + (320 + yOffset) + " M " + (28 + xOffset) + "," + (320 + yOffset) + " L " + (32 + xOffset) + "," + (320 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (400 + yOffset) + " L " + (32 + xOffset) + "," + (400 + yOffset) + " M " + (30 + xOffset) + "," + (400 + yOffset) + " L " + (30 + xOffset) + "," + (480 + yOffset) + " M " + (28 + xOffset) + "," + (480 + yOffset) + " L " + (32 + xOffset) + "," + (480 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (560 + yOffset) + " L " + (32 + xOffset) + "," + (560 + yOffset) + " M " + (30 + xOffset) + "," + (560 + yOffset) + " L " + (30 + xOffset) + "," + (640 + yOffset) + " M " + (28 + xOffset) + "," + (640 + yOffset) + " L " + (32 + xOffset) + "," + (640 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (120 + yOffset) + " L " + (20 + xOffset) + "," + (120 + yOffset) + " M " + (18 + xOffset) + "," + (120 + yOffset) + " L " + (18 + xOffset) + "," + (280 + yOffset) + " M " + (16 + xOffset) + "," + (280 + yOffset) + " L " + (20 + xOffset) + "," + (280 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (440 + yOffset) + " L " + (20 + xOffset) + "," + (440 + yOffset) + " M " + (18 + xOffset) + "," + (440 + yOffset) + " L " + (18 + xOffset) + "," + (600 + yOffset) + " M " + (16 + xOffset) + "," + (600 + yOffset) + " L " + (20 + xOffset) + "," + (600 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (200 + xOffset) + "," + (4 + yOffset) + " L " + (200 + xOffset) + "," + (8 + yOffset) + " M " + (200 + xOffset) + "," + (6 + yOffset) + " L " + (520 + xOffset) + "," + (6 + yOffset) + " M " + (520 + xOffset) + "," + (4 + yOffset) + " L " + (520 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (80 + xOffset) + "," + (29 + yOffset) + " L " + (80 + xOffset) + "," + (33 + yOffset) + " M " + (80 + xOffset) + "," + (31 + yOffset) + " L " + (160 + xOffset) + "," + (31 + yOffset) + " M " + (160 + xOffset) + "," + (29 + yOffset) + " L " + (160 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (240 + xOffset) + "," + (29 + yOffset) + " L " + (240 + xOffset) + "," + (33 + yOffset) + " M " + (240 + xOffset) + "," + (31 + yOffset) + " L " + (320 + xOffset) + "," + (31 + yOffset) + " M " + (320 + xOffset) + "," + (29 + yOffset) + " L " + (320 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (120 + xOffset) + "," + (17 + yOffset) + " L " + (120 + xOffset) + "," + (21 + yOffset) + " M " + (120 + xOffset) + "," + (19 + yOffset) + " L " + (280 + xOffset) + "," + (19 + yOffset) + " M " + (280 + xOffset) + "," + (17 + yOffset) + " L " + (280 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                "d=\"M " + (360 + xOffset) + "," + (-9 + yOffset) + " L " + (360 + xOffset) + "," + (-5 + yOffset) + " M " + (360 + xOffset) + "," + (-7 + yOffset) + " L " + (1000 + xOffset) + "," + (-7 + yOffset) + " M " + (1000 + xOffset) + "," + (-9 + yOffset) + " L " + (1000 + xOffset) + "," + (-5 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (560 + xOffset) + "," + (29 + yOffset) + " L " + (560 + xOffset) + "," + (33 + yOffset) + " M " + (560 + xOffset) + "," + (31 + yOffset) + " L " + (640 + xOffset) + "," + (31 + yOffset) + " M " + (640 + xOffset) + "," + (29 + yOffset) + " L " + (640 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (400 + xOffset) + "," + (29 + yOffset) + " L " + (400 + xOffset) + "," + (33 + yOffset) + " M " + (400 + xOffset) + "," + (31 + yOffset) + " L " + (480 + xOffset) + "," + (31 + yOffset) + " M " + (480 + xOffset) + "," + (29 + yOffset) + " L " + (480 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F2
                "d=\"M " + (440 + xOffset) + "," + (17 + yOffset) + " L " + (440 + xOffset) + "," + (21 + yOffset) + " M " + (440 + xOffset) + "," + (19 + yOffset) + " L " + (600 + xOffset) + "," + (19 + yOffset) + " M " + (600 + xOffset) + "," + (17 + yOffset) + " L " + (600 + xOffset) + "," + (21 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                "d=\"M " + (680 + xOffset) + "," + (-22 + yOffset) + " L " + (680 + xOffset) + "," + (-18 + yOffset) + " M " + (680 + xOffset) + "," + (-20 + yOffset) + " L " + (1320 + xOffset) + "," + (-20 + yOffset) + " M " + (1320 + xOffset) + "," + (-22 + yOffset) + " L " + (1320 + xOffset) + "," + (-18 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //F
                "d=\"M " + (720 + xOffset) + "," + (29 + yOffset) + " L " + (720 + xOffset) + "," + (33 + yOffset) + " M " + (720 + xOffset) + "," + (31 + yOffset) + " L " + (800 + xOffset) + "," + (31 + yOffset) + " M " + (800 + xOffset) + "," + (29 + yOffset) + " L " + (800 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //E
                "d=\"M " + (840 + xOffset) + "," + (4 + yOffset) + " L " + (840 + xOffset) + "," + (8 + yOffset) + " M " + (840 + xOffset) + "," + (6 + yOffset) + " L " + (1160 + xOffset) + "," + (6 + yOffset) + " M " + (1160 + xOffset) + "," + (4 + yOffset) + " L " + (1160 + xOffset) + "," + (8 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G
                "d=\"M " + (880 + xOffset) + "," + (29 + yOffset) + " L " + (880 + xOffset) + "," + (33 + yOffset) + " M " + (880 + xOffset) + "," + (31 + yOffset) + " L " + (960 + xOffset) + "," + (31 + yOffset) + " M " + (960 + xOffset) + "," + (29 + yOffset) + " L " + (960 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (760 + xOffset) + "," + (17 + yOffset) + " L " + (760 + xOffset) + "," + (21 + yOffset) + " M " + (760 + xOffset) + "," + (19 + yOffset) + " L " + (920 + xOffset) + "," + (19 + yOffset) + " M " + (920 + xOffset) + "," + (17 + yOffset) + " L " + (920 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G2
                "d=\"M " + (1080 + xOffset) + "," + (17 + yOffset) + " L " + (1080 + xOffset) + "," + (21 + yOffset) + " M " + (1080 + xOffset) + "," + (19 + yOffset) + " L " + (1240 + xOffset) + "," + (19 + yOffset) + " M " + (1240 + xOffset) + "," + (17 + yOffset) + " L " + (1240 + xOffset) + "," + (21 + yOffset) + "\"></path> " +
                // "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //
                // "d=\"M "+(1000 + xOffset)+","+(-9 + yOffset)+" L "+(1000 + xOffset)+","+(-5 + yOffset)+" M "+(1000 + xOffset)+","+(-7 + yOffset)+" L "+(1320 + xOffset)+","+(-7 + yOffset)+" M "+(1320 + xOffset)+","+(-9 + yOffset)+" L "+(1320 + xOffset)+","+(-5 + yOffset)+"\"></path>"+
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G3
                "d=\"M " + (1200 + xOffset) + "," + (29 + yOffset) + " L " + (1200 + xOffset) + "," + (33 + yOffset) + " M " + (1200 + xOffset) + "," + (31 + yOffset) + " L " + (1280 + xOffset) + "," + (31 + yOffset) + " M " + (1280 + xOffset) + "," + (29 + yOffset) + " L " + (1280 + xOffset) + "," + (33 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //G4
                "d=\"M " + (1040 + xOffset) + "," + (29 + yOffset) + " L " + (1040 + xOffset) + "," + (33 + yOffset) + " M " + (1040 + xOffset) + "," + (31 + yOffset) + " L " + (1120 + xOffset) + "," + (31 + yOffset) + " M " + (1120 + xOffset) + "," + (29 + yOffset) + " L " + (1120 + xOffset) + "," + (33 + yOffset) + "\"></path>"+


                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //A
                "d=\"M " + (-21 + xOffset) + "," + (680 + yOffset) + " L " + (-17 + xOffset) + "," + (680 + yOffset) + " M " + (-19 + xOffset) + "," + (680 + yOffset) + " L " + (-19 + xOffset) + "," + (1320 + yOffset) + " M " + (-21 + xOffset) + "," + (1320 + yOffset) + " L " + (-17 + xOffset) + "," + (1320 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //B
                "d=\"M " + (4 + xOffset) + "," + (840 + yOffset) + " L " + (8 + xOffset) + "," + (840 + yOffset) + " M " + (6 + xOffset) + "," + (840 + yOffset) + " L " + (6 + xOffset) + "," + (1160 + yOffset) + " M " + (4 + xOffset) + "," + (1160 + yOffset) + " L " + (8 + xOffset) + "," + (1160 + yOffset) + "\"></path>" +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (720 + yOffset) + " L " + (32 + xOffset) + "," + (720 + yOffset) + " M " + (30 + xOffset) + "," + (720 + yOffset) + " L " + (30 + xOffset) + "," + (800 + yOffset) + " M " + (28 + xOffset) + "," + (800 + yOffset) + " L " + (32 + xOffset) + "," + (800 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (880 + yOffset) + " L " + (32 + xOffset) + "," + (880 + yOffset) + " M " + (30 + xOffset) + "," + (880 + yOffset) + " L " + (30 + xOffset) + "," + (960 + yOffset) + " M " + (28 + xOffset) + "," + (960 + yOffset) + " L " + (32 + xOffset) + "," + (960 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D
                "d=\"M " + (28 + xOffset) + "," + (1040 + yOffset) + " L " + (32 + xOffset) + "," + (1040 + yOffset) + " M " + (30 + xOffset) + "," + (1040 + yOffset) + " L " + (30 + xOffset) + "," + (1120 + yOffset) + " M " + (28 + xOffset) + "," + (1120 + yOffset) + " L " + (32 + xOffset) + "," + (1120 + yOffset) + "\"></path> " +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //D2
                "d=\"M " + (28 + xOffset) + "," + (1200 + yOffset) + " L " + (32 + xOffset) + "," + (1200 + yOffset) + " M " + (30 + xOffset) + "," + (1200 + yOffset) + " L " + (30 + xOffset) + "," + (1280 + yOffset) + " M " + (28 + xOffset) + "," + (1280 + yOffset) + " L " + (32 + xOffset) + "," + (1280 + yOffset) + "\"></path> " +

                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (760 + yOffset) + " L " + (20 + xOffset) + "," + (760 + yOffset) + " M " + (18 + xOffset) + "," + (760 + yOffset) + " L " + (18 + xOffset) + "," + (920 + yOffset) + " M " + (16 + xOffset) + "," + (920 + yOffset) + " L " + (20 + xOffset) + "," + (920 + yOffset) + "\"></path>" +
                "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +              //C
                "d=\"M " + (16 + xOffset) + "," + (1080 + yOffset) + " L " + (20 + xOffset) + "," + (1080 + yOffset) + " M " + (18 + xOffset) + "," + (1080 + yOffset) + " L " + (18 + xOffset) + "," + (1240 + yOffset) + " M " + (16 + xOffset) + "," + (1240 + yOffset) + " L " + (20 + xOffset) + "," + (1240 + yOffset) + "\"></path>"
            ;

            stringBuilderExtras =
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (505 + yOffset) + "px; left:" + (-23 + xOffset) + "px;\">" +
                "<i>B</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (265 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>C</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (85 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (285 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (405 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (605 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (145 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (545 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>D</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (275 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (155 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (95 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (295 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-34 + yOffset) + "px; left:" + (512 + xOffset) + "px;\">" +
                "<i>G</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (415 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (615 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (555 + xOffset) + "px;\">" +
                "<i>I</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (735 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (935 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (1055 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (3 + yOffset) + "px; left:" + (1255 + xOffset) + "px;\">" +
                "<i>J</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (795 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-8 + yOffset) + "px; left:" + (1195 + xOffset) + "px;\">" +
                "<i>I</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-22 + yOffset) + "px; left:" + (1075 + xOffset) + "px;\">" +
                "<i>H</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (-48 + yOffset) + "px; left:" + (995 + xOffset) + "px;\">" +
                "<i>F</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (985 + yOffset) + "px; left:" + (-35 + xOffset) + "px;\">" +
                "<i>A</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (1065 + yOffset) + "px; left:" + (-13 + xOffset) + "px;\">" +
                "<i>C</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (725 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (925 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (1045 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (1245 + yOffset) + "px; left:" + (11 + xOffset) + "px;\">" +
                "<i>E</i></div>" +

                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (785 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>D</i></div>" +
                "<div style=\"position:absolute; font-family:&quot;Times New Roman&quot;,Georgia,Serif; visibility:inherit;top:" + (1185 + yOffset) + "px; left:" + (-1 + xOffset) + "px;\">" +
                "<i>D</i></div>"
            break;
        default:
            break;
    }
    stringBuilder += "<rect x=\"" + (38 + xOffset) + "\" y=\"" + (38 + yOffset) + "\" width=\"" + (Kmap.width * 40 + 4) + "\" height=\"" + (Kmap.height * 40 + 4) + "\" rx=\"8\" fill=\"none\" stroke-width=\"3\" stroke=\"var(--tableBorder)\"/>" + "</svg>" + stringBuilderExtras
    map.innerHTML = stringBuilder;
    Kmap_UXNF = Object.assign({}, Kmap)
    Kmap_SXNF = Object.assign({}, Kmap)
    Kmap_IXNF = Object.assign({}, Kmap)
    Kmap_MXNF = Object.assign({}, Kmap)
    if(Kmap.showExtras)
        $('.map_extras').show()
}

// function drawIds() {
//     const map = document.getElementById("Kmap");
//     let stringBuilder = ""
//     for (let y = 0; y < Kmap.height; y++) {
//         for (let x = 0; x < Kmap.width; x++) {
//             // stringBuilder = "<text fill=\"var(--sliderLine)\" font-family=\"sans-serif\" font-size=\"10\" x=\"" + (2 + ((x + 1) * 40) + xOffset) + "\" y=\"" + (37 + (((y + 1) * 40)) + yOffset) + "\">" + Kmap[y][x].id + "</text>"
//             let elem = document.createElement("text")
//             elem.setAttribute("fill", "var(--sliderLine)")
//             elem.setAttribute("font-family", "sans-serif")
//             elem.setAttribute("font-size", "10")
//             elem.setAttribute("x", ""+(2 + ((x + 1) * 40) + xOffset)+"")
//             elem.setAttribute("y", ""+(37 + (((y + 1) * 40)) + yOffset)+ "")
//             elem.innerHTML = Kmap[y][x].id
//
//             // elem.innerHTML = stringBuilder
//             map.append(elem)
//         }
//     }
// }

function render(id, value) {
    id = id.slice(6)
    document.getElementById("cell" + id).innerHTML = value;
    for (let y = 0; y < Kmap.height; y++) {
        for (let x = 0; x < Kmap.width; x++) {
            if (Kmap[y][x].id === parseInt(id)) {
                Kmap[y][x].value = isNaN(parseInt(value)) ? 2 : parseInt(value);
                if (Kmap[y][x].value === 0)
                    Kmap[y][x].inGroup = -1
            }
        }
    }
    if(Kmap.variables > 5) {
        $('#loading').show()
        setTimeout(function () {
            colorKmap()
        }, 0)
        setTimeout(function () {
            $('#loading').fadeOut(0);
        }, 1)
    }
    else
        colorKmap()
}

function colorKmap() {
    document.getElementById("solver_result_1").innerHTML = ""
    document.getElementById("solver_result_2").innerHTML = ""
    document.getElementById("solver_result_3").innerHTML = ""
    document.getElementById("solver_result_4").innerHTML = ""
    document.getElementById("solver_result_5").innerHTML = ""
    document.getElementById("circuitDiv").innerHTML = ""
    $('#solver_result_4').css("background-color", "var(--outputFieldBackgroundHover)")
    $('#circuitDiv').hide()

    UXNF()
    SXNF()
    IXNF()
    MXNF()
    display_Format("MXNF")

    // console.log("Kmap: ")
    // console.log(Kmap)
}

function clearMap() {
    $('.kmap-group').remove();
    Kmap.groups = []
}

$('.srD')
    .on("focusin", function () {
        if (Kmap.length === 0 || Kmap.groups.length === 0)
            return
        let id = parseInt(this.id.slice(-1))
        $(this).css("background-color", "var(--outputFieldBackgroundHover)")
            .css("cursor", "pointer")
        if (id !== 4)
            $('#solver_result_4').css("background-color", "var(--outputFieldBackground)")
        selected = id
        let mode = ""
        if (id === 1)
            mode = "UXNF"
        else if (id === 2)
            mode = "SXNF"
        else if (id === 3)
            mode = "IXNF"
        else
            mode = "MXNF"
        if (id !== 4){
            $('#loading').show()
            setTimeout(function () {
                if(id === 3)
                    display_Format(mode, 0)
                else
                    display_Format(mode)
            }, 0)
            setTimeout(function () {
                $('#loading').fadeOut(0);
            }, 1)

        }
    })
    .on("focusout", function () {
        if (Kmap.groups.length === 0)
            return
        let id = parseInt(this.id.slice(-1))
        $(this).css("background-color", "var(--outputFieldBackground)")
            .css("cursor", "default")
        $('#solver_result_4').css("background-color", "var(--outputFieldBackgroundHover)")

        selected = 0
        if (id !== 4){
            $('#loading').show()
            setTimeout(function () {
                display_Format("MXNF")
            }, 0)
            setTimeout(function () {
                $('#loading').fadeOut(0);
            }, 1)
        }
    })


function display_Format(mode, index = 0) {
    switch (mode) {
        case "UXNF":
            Kmap = Kmap_UXNF;
            break;
        case "SXNF":
            Kmap = Kmap_SXNF;
            break;
        case "IXNF":
            Kmap = Kmap_IXNF[index];
            break;
        case "MXNF":
            Kmap = Kmap_MXNF;
            break;
    }
    $('.kmap-group').remove();

    Kmap.showMap = document.getElementById("modal_switch2").checked
    Kmap.showCircuit = document.getElementById("modal_switch3").checked
    let length = Kmap.groups.length
    colIndex = 0
    if(Kmap.showMap){
        const map = document.getElementById("Kmap");
        for (let i = 0; i < length; i++) {
            circleGroup(Kmap.groups[i])
        }
        $('.map_extras').appendTo($('#Kmap'))
    }
    xnor([], null)
}

function UXNF() {
    clearMap()
    let height = Kmap.height
    let width = Kmap.width
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            Kmap[y][x].inGroup = -1
        }
    }
    let group = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Kmap[y][x].value === Kmap.mode) {
                group.push(Kmap[y][x])
                group.default = true
                Cover(group, "solver_result_1")
                group = []
            }
        }
    }
    document.getElementById("circuitDiv").innerHTML = ""
    Kmap_UXNF = $.extend(true, [], Kmap);
}

function SXNF() {
    clearMap()
    for (let y = 0; y < Kmap.height; y++) {
        for (let x = 0; x < Kmap.width; x++) {
            Kmap[y][x].inGroup = -1
        }
    }
    let groupDim = []

    for (let y = 1, i = 0; y <= Kmap.height; y *= 2) {
        for (let x = 1; x <= Kmap.width; x *= 2, i++) {
            groupDim[i] = []
            groupDim[i].x = x
            groupDim[i].y = y
            groupDim[i].size = x * y
        }
    }
    groupDim.sort((a, b) => b.size - a.size);
    let state = false
    let length = groupDim.length
    for (let i = 0; i < length; i++) {
        state = checkGroup(groupDim[i])
        if(state)
            break;
    }
    Kmap_SXNF = $.extend(true, [], Kmap);
}

function IXNF() {
    let Kmap_backup = []
    let map_list = []
    let state
    let map
    Kmap_backup = $.extend(true, [], Kmap);
    let length = Kmap_backup.groups.length
    for(let i = 0; i < length; i++) {
        [state, map] = canBeRemoved(Kmap_backup, i)
        if (state) {
            let groups_length = map.groups.length
            while (!isDefinite(map)) {
                for (let j = 0; j < groups_length; j++) {
                    [state, map] = canBeRemoved(map, j)
                }
            }
            map_list.push(map)
        }
    }

    //hladanie ixnf aj v opacnom smere, pre najdeme uplne vsetkych moznosti
    for(let i = length; i >= 0; i--) {
        [state, map] = canBeRemoved(Kmap_backup, i)
        if (state) {
            let groups_length = map.groups.length
            while (!isDefinite(map)) {
                for (let j = groups_length; j >= 0; j--) {
                    [state, map] = canBeRemoved(map, j)
                }
            }
            map_list.push(map)
        }
    }

    map_list = removeDuplicates(map_list)

    function removeDuplicates(list) {
        let new_list = $.extend(true, [], list);
        let comparison = []
        for(let i = 0; i < list.length; i++) {
            comparison.push(translateToString(list[i]))
        }
        let toRemove = []
        comparison = comparison.filter( function (a, index){
            if(comparison.indexOf(a) === index)
                toRemove.push(index)
            return comparison.indexOf(a) === index
        })
        new_list = new_list.filter( function (a, index){
            return toRemove.includes(index)
        })
        return new_list
    }

    function translateToString(a) {
        let aString = ""
        let length = a.groups.length
        for(let i = 0; i < length; i++) {
            let group_length = a.groups[i].length
            for (let j = 0; j < group_length; j++) {
                aString += a.groups[i][j].id
            }
        }
        return aString
    }

    function canBeRemoved(map_const, index) {
        let map_temp = $.extend(true, [], map_const);
        map_temp.groups.splice(index, 1)
        if(allInGroup(map_temp))
            return [true, map_temp]
        else
            return [false, map_const]
    }

    function isDefinite(map) {
        let state1
        let map1
        let length = map.groups.length
        for(let i = 0; i < length; i++) {
            [state1, map1] = canBeRemoved(map, i)
            if (state1) {
                return false
            }
        }
        return true
    }
    if (map_list.length < 1) {
        Kmap = $.extend(true, [], Kmap_SXNF);
        xnor(Kmap.groups[0], "solver_result_3", true, 0)
    }
    else{
        for (let i = 0; i < map_list.length; i++){
            Kmap = $.extend(true, [], map_list[i]);
            xnor(Kmap.groups[0], "solver_result_3", true, i)
        }
        Kmap = $.extend(true, [], map_list[0]);
    }
    if(map_list.length <= 0)
        map_list.push(Kmap)
    Kmap_IXNF = $.extend(true, [], map_list);
    Kmap = $.extend(true, [], map_list);
}

function MXNF() {
    let maps = Kmap
    Kmap = pickBest(maps)
    let group = []
    if(Kmap.groups.length <=1)
        group = Kmap.groups[0]
    xnor(group, "solver_result_4")
    Kmap_MXNF = $.extend(true, [], Kmap);
}

function pickBest(maps) {
    let best
    let bestSum = 0
    let testSum = 0
    best = maps[0]
    let best_length = best.groups.length
    for (let j = 0; j < best_length; j++) {
        bestSum += best.groups[j].length
    }
    let maps_length = maps.length
    for (let i = 0; i < maps_length; i++){
        const map = maps[i];
        if(map.groups.length < best_length)
            best = map;
        else if(map.groups.length === best_length){
            map.groups.forEach(group => {
                testSum += group.length
            })
            if(testSum > bestSum)
                best = map
        }
    }
    return best;
}

function allInGroup(Kmap_backup) {
    for (let y = 0; y < Kmap_backup.height; y++) {
        for (let x = 0; x < Kmap_backup.width; x++) {
            if (Kmap_backup[y][x].value === Kmap.mode && !isInGroup(Kmap_backup, Kmap_backup[y][x]))
                return false
        }
    }
    return true
}

function isInGroup(Kmap_backup, item) {
    let groups_length = Kmap_backup.groups.length
    for (let i = 0; i < groups_length; i++) {
        let g_length = Kmap_backup.groups[i].length
        for (let j = 0; j < g_length; j++) {
            if (Kmap_backup.groups[i][j].id === item.id)
                return true
        }
    }
    return false
}

function checkGroup(group) {
    let w = group.x
    let h = group.y
    let width = (Kmap.width === w) ? 1 : Kmap.width;
    let height = (Kmap.height === h) ? 1 : Kmap.height;
    let toGroup
    let state = false
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rect = CreateRect(x, y, w, h);
            toGroup = TestRect(rect)
            if (toGroup !== null) {
                if (!IsCovered(toGroup)) {
                    [toGroup, state] = hasComplement(toGroup)
                    if(stillValid(toGroup)) {
                        Cover(toGroup, "solver_result_2", state);
                        if (toGroup.length === Math.pow(2, Kmap.variables))
                            return true;
                    }
                }
            }
        }
    }
    return false;
}

function hasComplement(group) {
    if (Kmap.variables < 5)
        return [group, false];
    group.default = true
    let foldsX = Math.floor(Kmap.width/Kmap.variables)+1
    let foldsY = Math.floor(Kmap.height/Kmap.variables)+1
    if(Kmap.variables > 6 && Kmap.variables < 9){
        foldsX++;
    }
    if(Kmap.variables > 7){
        foldsX++;
        foldsY++;
    }

    let mapSize = 4
    let statelist = []
    let state = false
    let direction = true

    for(let j = 0; j < foldsX; j++){ //pocet prelozeni mapy X
        [group, state] = foldMap(mapSize, group, direction)
        statelist.push(state)
        mapSize *= 2
    }
    if(Kmap.variables > 5) {
        mapSize = 4
        direction = false
        for (let j = 0; j < foldsY; j++) { //pocet prelozeni mapy Y
            [group, state] = foldMap(mapSize, group, direction)
            statelist.push(state)
            mapSize *= 2
        }
    }
    return [group, statelist.includes(true)]
}

function foldMap(size, group, direction) {
    let tempX
    let tempY
    let result = []
    let matches = 0
    let tempGroup = []
    let length = Kmap.groups.length
    loop1:
    for (let j = 0; j < length; j++){
        matches = 0
        result = []
        let groups_length = Kmap.groups[j].length
        for (let k = 0; k < groups_length; k++){
            let g_length = group.length
            for (let i = 0; i < g_length; i++) {
                if(direction) {
                    tempY = group[i].posY
                    tempX = group[i].posX + findComplementary(group[i], size, direction)
                    if (tempY === Kmap.groups[j][k].posY && tempX === Kmap.groups[j][k].posX) {
                        matches++;
                        tempGroup = Kmap.groups[j]
                        result.push(Kmap.groups[j][k])
                    }
                } else {
                    tempY = group[i].posY + findComplementary(group[i], size, direction)
                    tempX = group[i].posX
                    if (tempX === Kmap.groups[j][k].posX && tempY === Kmap.groups[j][k].posY) {
                        matches++;
                        tempGroup = Kmap.groups[j]
                        result.push(Kmap.groups[j][k])
                    }
                }
                if(matches === g_length)
                    break loop1
            }
        }
    }
    if(matches === 0){
        return [group, false]
    }
    if(matches === group.length && group.length === tempGroup.length){       //join old group
        let oldMap = $.extend(true, [], Kmap);
        let g_length = group.length

        for (let i = 0; i < g_length; i++) {
            if (!isDuplicite(tempGroup, group[i])) {
                tempGroup.push(group[i])
            }
        }
        if(!((tempGroup.length > 0) && ((tempGroup.length & (tempGroup.length - 1)) === 0)) || !stillValid(tempGroup)) {
            Kmap = oldMap
            return [group, false];
        }

        tempGroup.default = false
        // console.log("join")
        return [tempGroup, true];
    }
    else {                              //take complement from other group
        let newGroup = $.extend(true, [], group);
        let g_length = result.length

        for (let i = 0; i < g_length; i++) {
            if (!isDuplicite(group, result[i])) {
                group.push(result[i])
            }
        }
        if(!((group.length > 0) && ((group.length & (group.length - 1)) === 0)) || !stillValid(group)){
            return [newGroup, false];
        }
        group.default = false
        // console.log("take")
        return [group, false];
    }
}

function findComplementary(item, size, direction) {
    let middle = size/2
    let space
    let relativePos
    let distance
    let itemPos

    itemPos = direction ? (item.posX / 40) : (item.posY / 40);
    relativePos = (itemPos - ((itemPos <= size ? 0 : 1) * size))
    if (relativePos <= middle) {            //left/top half
        distance = middle - relativePos;
        space = 2 * distance + 1
    } else {                                   //right/bottom half
        distance = relativePos - middle;
        space = (2 * distance - 1) * -1
    }
    return space*40
}

function isDuplicite(group, item) {
    let length = group.length
    for(let i = 0; i < length; i++){
        if (group[i].id === item.id){
            return true
        }
    }
    return false
}

function CreateRect(x, y, w, h) {
    let obj = [];
    obj.x = x;
    obj.y = y;
    obj.w = w;
    obj.h = h;
    return obj;
}

//porovnava kazdy prvok v skupine s cielovou hodnotou, vrati pole prvkov na vytvorenie skupiny
//alebo null, ak sa skupina nemoze vytvorit
function TestRect(rect) {
    let toGroup = []
    // toGroup['default'] = true
    // Object.defineProperty(toGroup, 'asd', {
    //     value: true
    // })
    for (let dy = 0; dy < rect.h; dy++) {
        for (let dx = 0; dx < rect.w; dx++) {
            let test = Kmap[(rect.y + dy) % Kmap.height][(rect.x + dx) % Kmap.width];
            if ((Kmap.mode !== test.value) && (test.value !== 2)) {
                return null;
            }
            toGroup.push(test)
        }
    }
    return toGroup;
}

// function Compare(Value1, Value2) {
//     return (Value1 !== Value2) && (Value2 !== 2);
// }

//true, ak je uz prvok priradeny, ignoruje X
//false, ak ziadny prvok nie je priradeny, moze sa vytvorit skupina
function IsCovered(toGroup) {
    if (alreadyFullyCovered(toGroup))
        return true

    let length = toGroup.length
    for (let i = 0; i < length; i++) {
        if (toGroup[i].value !== 2) {
            toGroup.default = true
            return false
        }
    }
    return true
}

//zisti, ci je skupina uz kompletne obsiahnuta v inej skupine, nie je potrebne robit dalsiu
function alreadyFullyCovered(toGroup) {
    let matches = 0

    let length = Kmap.groups.length
    for (let i = 0; i < length; i++) {
        matches = 0
        let groups_length = Kmap.groups[i].length
        for (let j = 0; j < groups_length; j++) {
            let g_length = toGroup.length
            for (let k = 0; k < g_length; k++) {
                if (toGroup[k].id === Kmap.groups[i][j].id)
                    matches++;
                if (matches === g_length)
                    return true
            }
        }
    }
    return matches === toGroup.length;
}

function fullyContains() {
    Kmap.groups.sort(function (a, b) {
        return b.length - a.length;
    });
    let toRemove = []
    let length = Kmap.groups.length
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            if(i!==j && intersects(Kmap.groups[i], Kmap.groups[j]))
                toRemove.push(j)
        }
    }
    if(toRemove.length === 0)
        return
    toRemove.sort()
    Kmap.groups = Kmap.groups.filter( function (a, index){
        return !toRemove.includes(index)
    })
}

function intersects(g1, g2) {
    let matches = 0
    let len1 = g1.length
    let len2 = g2.length
    for (let j = 0; j < len1; j++) {
        for (let k = 0; k < len2; k++) {
            if (g1[j].id === g2[k].id)
                matches++;
            if (matches === len2)
                return true
        }
    }
    return matches === len2;
}

function getResult(group, absolute=false) {
    let binaryArray = []
    let result = ""
    let temp = ""
    let match = true
    let html = ""
    let g_length = group.length
    for (let i = 0; i < g_length; i++){
        binaryArray.push(toFixedBinary(group[i].id, Kmap.variables))
    }
    for (let i = 0; i < Kmap.variables; i++) {
        temp = binaryArray[0].charAt(i)
        let b_length = binaryArray.length
        for (let j = 1; j < b_length; j++) {
            if (parseInt(binaryArray[j].charAt(i)) ^ parseInt(temp)) {
                match = false
                break
            }
        }
        result += match ? Kmap.mode.toString() : Kmap.mode === 0 ? "1" : "0"
        match = true
    }
    for (let i = 0; i < Kmap.variables; i++){
        if (result[i] === Kmap.mode.toString()) {
            if (absolute && result[i] !== binaryArray[0].charAt(i)) {
                html += alphabet[i].toLowerCase()
            } else if (result[i] === Kmap.mode.toString()) {
                html += alphabet[i]
            }
        }
    }
    return html
}

function stillValid(group) {
    if(group.length === Math.pow(2, Kmap.variables) || Kmap.variables < 5){
        return true
    }
    let html = getResult(group)
    let xAxis = []
    let yAxis = []
    let g_length = group.length

    for (let i = 0; i < g_length; i++){
        const item = group[i];
        xAxis.push(item.posX/40)
        yAxis.push(item.posY/40)
    }
    let beginX = Math.min(...xAxis)
    let endX = Math.max(...xAxis)
    let beginY = Math.min(...yAxis)
    let endY = Math.max(...yAxis)
    let width = endX - beginX+1
    let height = endY - beginY+1
    // console.log(width, height)
    // console.log($.extend(true, [], group))
    if(
        (xAxis[0] === Kmap.width-1 && width > 3 && group.default === true)             //2
        || (yAxis[0] === Kmap.height-1 && height > 3 && group.default === true)
        || (xAxis[0] === Kmap.width-3 && width > 4 && group.default === true)             //2
        || (yAxis[0] === Kmap.height-3 && height > 4 && group.default === true)
    ){
        return false
    }
    return group.length >= ((Kmap.width * Kmap.height) / (Math.pow(2, html.length)));
}

function Cover(toGroup, output, alreadyCovered= false) {
    let toCircle = []
    let separatedG = []
    if(!toGroup.default) {
        let grp = $.extend(true, [], toGroup);
        grp.sort(function (a, b) {
            if (a.posY !== b.posY)
                return a.posY - b.posY;
            return a.posX - b.posX;
        });
        separatedG[0] = []
        separatedG[0].push(grp[0])
        let len = grp.length
        let sepG_len
        let ignore = false
        for (let i = 1; i < len; i++) {
            let sep_len = separatedG.length - 1
            if (separatedG[sep_len][separatedG[sep_len].length - 1].posX === grp[i].posX - 40 ||
                separatedG[sep_len][separatedG[sep_len].length - 1].posX%Kmap.width === 1 && (grp[i].posX - 40)%Kmap.width === 1) {    // pozrie sa doprava || together(separated[sep_len], grp[i].posX, true)
                separatedG[sep_len].push(grp[i])
            } else {
                let match = false
                sepG_len = separatedG.length
                loop1:
                for (let j = 0; j < sepG_len; j++) {
                    for (let k = 0; k < separatedG[j].length; k++) {
                        if ((separatedG[j][k].posY === grp[i].posY - 40 && separatedG[j][k].posX === grp[i].posX)) { //|| together(separated[j], grp[i].posY, false)
                            separatedG[j].push(grp[i])
                            match = true
                            break loop1
                        }
                    }
                }
                if (!match) {
                    separatedG[separatedG.length] = []
                    separatedG[separatedG.length - 1].push(grp[i])
                }
            }
        }
        sepG_len = separatedG.length
        for (let i = 0; i < sepG_len; i++) {
            let g_length = separatedG[i].length
            if(!((g_length > 0) && ((g_length & (g_length - 1)) === 0))){
                if(alreadyCovered){
                    Kmap.groups.splice(Kmap.groups.indexOf(toGroup), 1)
                }
                return
            }
        }
    }
    let sepG_len = separatedG.length
    if(!alreadyCovered) {
        Kmap.groups[Kmap.groups.length] = []
        let g_len = toGroup.length
        for (let i = 0; i < g_len; i++) {
            const item = toGroup[i];
            Kmap[item.posY / 40 - 1][item.posX / 40 - 1].inGroup = Kmap.groups.length - 1
            Kmap.groups[Kmap.groups.length - 1].push(Kmap[item.posY / 40 - 1][item.posX / 40 - 1])
            toCircle.push(Kmap[item.posY / 40 - 1][item.posX / 40 - 1].id)
            let index = Kmap.groups.length - 1
            Kmap.groups[index].separated = []
            for (let i = 0; i < sepG_len; i++) {
                Kmap.groups[index].separated.push(separatedG[i])
            }
            Kmap.groups[index].default = toGroup.default
        }
    }
    else{
        toGroup.separated = []
        for (let i = 0; i < sepG_len; i++) {
            toGroup.separated.push(separatedG[i])
        }
    }
    xnor(toCircle, output)
}
let colors = ["#C0392B", "#2980B9", "#27ae60", "#F39C12",
              "#9B59B6", "#997e0d"]
let colIndex = 0
let color
function circleGroup(group, sameColor=false) {
    if(group.length === 0)
        return

    const map = document.getElementById("Kmap");
    if(!sameColor) {

        if (colIndex > colors.length - 1) {
            color = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
        } else {
            color = colors[colIndex]
            colIndex++
        }
    }
    let xAxis = []
    let yAxis = []
    for (let i = 0; i < group.length; i++){
        const item = group[i];
        xAxis.push(item.posX)
        yAxis.push(item.posY)
    }
    let beginX = Math.min(...xAxis)
    let endX = Math.max(...xAxis) - beginX
    let beginY = Math.min(...yAxis)
    let endY = Math.max(...yAxis) - beginY

    let overX = false
    let overY = false

    let temp1 = []
    let temp2 = []
    let g_length = group.length
    for (let i = 0; i < g_length; i++) {
        if (group[i].posY === beginY && group[i].posX !== beginX) {
            temp1.push(group[i])
        }
        if (group[i].posX === beginX && group[i].posY !== beginY) {
            temp2.push(group[i])
        }
    }

    if (temp1.length < 2 && beginX === 40 && endX === Kmap.width * 40 - beginX && Kmap.variables > 2) {
        overX = true;
    }
    if (temp2.length < 2 && beginY === 40 && endY === Kmap.height * 40 - beginY && Kmap.variables > 3) {
        overY = true;
    }
    if(!sameColor && Kmap.variables > 4 && !group.default){

        if(group.separated !== undefined) {
            // console.log(group.separated)
            let gs_len = group.separated.length
            for (let i = 0; i < gs_len; i++) {
                circleGroup(group.separated[i], true)
            }
        }
        else
            circleGroup(group, false)
    }
    else if (overX && overY) {
        cover_overBoth(map, beginX, beginY, endY, color);
    } else if (overX) {
        cover_overX(map, beginX, beginY, endY, color)
    } else if (overY) {
        cover_overY(map, beginX, beginY, endX, color)
    }
    else
        map.innerHTML += "<rect class='kmap-group' x=\"" + (beginX + 5 + xOffset) + "\" y=\"" + (beginY + 5 + yOffset) + "\" width=\"" + (endX + 30) + "\" height=\"" + (endY + 30) + "\" rx=\"8\" fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%'/>"
}

function cover_overBoth(map, beginX, beginY, endY, color) {
    let x1 = beginX + 30 + 5 + xOffset; //dlzka, obluk doprava
    let y = (yOffset + 5 + beginY - 20); //vyska
    let y1 = y + beginX + 10; //dlzka, dolna ciara
    let x = 25 + xOffset;     //zaciatok, vystupuje dolava

    //1
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + x1 + "," + (y + 8) + " L " + x1 + "," + (y1 - 8) + " Q " + x1 + "," + y1 + " " + (x1 - 8)
        + "," + y1 + " L " + (x + 8) + "," + y1 + "'></path>";

    x1 += Kmap.width * 40 - 20
    x += Kmap.width * 40 - 20
    //2
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + x + "," + (y + 8) + " L " + x + "," + (y1 - 8) + " Q " + x + "," + y1 + " " + (x + 8)
        + "," + y1 + " L " + (x1 - 8) + "," + y1 + "'></path>";

    x1 = beginX + 30 + 5 + xOffset; //dlzka, obluk doprava
    y = (yOffset + endY) + 45; //vyska
    y1 = y + 15 + 35; //dlzka, dolna ciara
    x = beginX + xOffset + 5 - 20;     //zaciatok, vystupuje dolava

    //3
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + (x + 8) + "," + y + " L " + (x1 - 8) + "," + y + " Q " + x1 + "," + y + " " + x1 + "," + (y + 8)
        + " L " + x1 + "," + (y1 - 8) + "'></path>";

    x1 += Kmap.width * 40 - 20
    x += Kmap.width * 40 - 20
    //4
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + (x1 - 8) + "," + y + " L " + (x + 8) + "," + y + " Q " + x + "," + y + " " + x + "," + (y + 8)
        + " L " + x + "," + (y1 - 8) + "'></path>";
}

function cover_overX(map, beginX, beginY, endY, color) {
    let x1 = beginX + 30 + 5 + xOffset; //dlzka, obluk doprava
    let y = (yOffset + 5 + beginY); //vyska
    let y1 = y + endY + 30; //dlzka, dolna ciara
    let x = 25 + xOffset;     //zaciatok, vystupuje dolava

    //<<<
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + (x + 8) + "," + y + " L " + (x1 - 8) + "," + y + " Q " + x1 + "," + y + " " + x1 + "," + (y + 8)
        + " L " + x1 + "," + (y1 - 8) + " Q " + x1 + "," + y1 + " " + (x1 - 8) + "," + y1 + " L " + (x + 8) + "," + y1 + "'></path>";

    //>>>
    x1 += Kmap.width * 40 - 20
    x += Kmap.width * 40 - 20
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + (x1 - 8) + "," + y1 + " L " + (x + 8) + "," + y1 + " Q " + x + "," + y1 + " " + x + "," + (y1 - 8)
        + " L " + x + "," + (y + 8) + " Q " + x + "," + y + " " + (x + 8) + "," + y + " L " + (x1 - 8) + "," + y + "'></path>";
}

function cover_overY(map, beginX, beginY, endX, color) {
    let x1 = beginX + 30 + 5 + xOffset + endX; //dlzka, obluk doprava
    let y = (yOffset + beginY) - 15; //vyska
    let y1 = y + 15 + 35; //dlzka, dolna ciara
    let x = beginX + xOffset + 5;     //zaciatok, vystupuje dolava

    //^^^
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + x + "," + (y + 8) + " L " + x + "," + (y1 - 8) + " Q " + x + "," + y1 + " " + (x + 8)
        + "," + y1 + " L " + (x1 - 8) + "," + y1 + " Q " + x1 + "," + y1 + " " + x1 + "," + (y1 - 8) + " L " + x1
        + "," + (y + 8) + "'></path>";

    //vvv
    y1 += Kmap.height * 40 - 20
    y += Kmap.height * 40 - 20
    map.innerHTML += "<path class='kmap-group' fill=\"none\" stroke-width=\"3\" stroke=\"" + color + "\" opacity='100%' " +
        "d='" + "M " + x1 + "," + (y1 - 8) + " L " + x1 + "," + (y + 8) + " Q " + x1 + "," + y + " " + (x1 - 8)
        + "," + y + " L " + (x + 8) + "," + y + " Q " + x + "," + y + " " + x + "," + (y + 8) + " L " + x + "," +
        (y1 - 8) + "'></path>";
}

function xnor(group, output, stack=false, index) {
    if(Kmap.groups.length <=0)
        return
    let binaryArray = []
    let circuitReady = []
    let result = ""
    let temp = ""
    let match = true
    let vhdl = "y <= "
    let span = "y = "
    let row = ""
    if(stack){
        row = "r"+ (index < 10 ? "0": "") + index
        span = "y<sub>"+ (index+1) +"</sub> = "
    }
    if (output !== null && group !== undefined && group.length === Math.pow(2, Kmap.variables)) {
        document.getElementById(output).innerHTML = span + "<span class='highlight' id='highlight00"+row+"'>1</span>"
        if (output.charAt(output.length - 1) === "4")
            document.getElementById("solver_result_5").innerHTML = vhdl + 1
        return
    }

    circuitReady.cirLength = 0
    circuitReady.groups = []
    if(Kmap.variables > 6)
        handleExceptions()
    let groups_length = Kmap.groups.length
    for(let k = 0; k< groups_length; k++){
        let group = Kmap.groups[k]
        binaryArray = []
        result = ""
        temp = ""
        match = true
        span += "<span class='highlight' id='highlight" + (Kmap.groups.indexOf(group) < 10 ? "0" : "") + Kmap.groups.indexOf(group) + row +"'>"
        let g_length = group.length
        for (let j = 0; j < g_length; j++) {
            let binary = toFixedBinary(group[j].id, Kmap.variables)
            binaryArray.push(binary)
        }
        for (let i = 0; i < Kmap.variables; i++) {
            temp = binaryArray[0].charAt(i)
            for (let j = 1; j < binaryArray.length; j++) {
                if (parseInt(binaryArray[j].charAt(i)) ^ parseInt(temp)) {
                    match = false
                    break
                }
            }
            result += match ? Kmap.mode.toString() : Kmap.mode === 0 ? "1" : "0"
            match = true
        }
        let circuitTemp = ""
        let count = result.count(Kmap.mode.toString())
        span += Kmap.mode === 0 && count > 1 ? "(" : ""
        vhdl += "("

        for (let i = 0, written = 0; i < Kmap.variables; i++) {
            if (result[i] === Kmap.mode.toString()) {
                span += alphabet[i]

                if (result[i] !== binaryArray[0].charAt(i)) {
                    span += "&#773;"
                    vhdl += "not " + alphabet[i]
                    circuitTemp += alphabet[i].toLowerCase()
                } else {
                    vhdl += alphabet[i]
                    circuitTemp += alphabet[i]
                }
                written++
                span += Kmap.mode === 0 && written < count ? "+" : ""
                vhdl += Kmap.mode === 0 && written < count ? " or " : " and "
            }
        }
        circuitReady.cirLength += circuitTemp.length
        circuitReady.groups.push(circuitTemp)
        span += Kmap.mode === 0 && count > 1 ? ")" : ""
        span += "</span>"
        vhdl = vhdl.slice(0, -5) + ")"
        if (group !== Kmap.groups[Kmap.groups.length - 1]) {
            span += Kmap.mode === 1 ? " + " : " * "
            vhdl += Kmap.mode === 1 ? " or " : " and "
        }
    }
    vhdl += ";"
    if (output !== null) {
        if (output.charAt(output.length - 1) === "4") {
            $('#solver_result_4').css("background-color", "var(--outputFieldBackgroundHover)")
            document.getElementById("solver_result_4").innerHTML = span
            document.getElementById("solver_result_5").innerHTML = vhdl
        } else if(stack)
            document.getElementById(output).innerHTML += span+"<br/>"
        else
            document.getElementById(output).innerHTML = span
    }
    if (Kmap.showCircuit) {
        drawCircuit(circuitReady)
    }
}


String.prototype.count = function (c) {
    let result = 0;
    for (let i = 0; i < this.length; i++) if (this[i] === c) result++;
    return result;
};

function drawCircuit(circuitReady) {
    const circuit = document.getElementById("circuitDiv");

    if (Kmap.groups[0] === undefined)
        return
    if (Kmap.groups.length === 1 && Kmap.groups[0].length === Math.pow(2, Kmap.variables)) {
        circuit.innerHTML = ""
        circuit.style.display = "none"
        return;
    }

    circuit.style.display = "block"
    let stringBuilder = ""
    let stringBuilderExtras = ""
    let length = 32 + circuitReady.cirLength * 20 + circuitReady.groups.length * 20
    let letters = ""
    for (let i = 0; i < Kmap.variables; i++) {
        letters += alphabet[i] + alphabet[i]
    }

    stringBuilder += "<svg width=\"" + (Kmap.variables * 165) + "\" height=\"" + (length) + "\" id=\"circuit\">";

    let step = 0
    for (let i = 0; i < Kmap.variables * 2; i++) {
        stringBuilder +=
            "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
            "d=\"M " + (step + 22) + ",30 L " + (step + 36) + ",30 M " + (step + 29) + ",30 L " + (step + 29) + "," + length + " \"></path>"

        stringBuilderExtras +=
            "<div style=\"position:absolute; font-family:Arial,Georgia,serif;" +
            "visibility:inherit;top:0; left:" + (step + 23) + "px;\"><i>" + letters[i] + "" + (i % 2 !== 0 ? "&#773;" : "") + "</i></div>";
        step += 20
    }

    let negated = 0
    let skipped = 0
    let height = 51
    let centers = []
    let hLines = []

    let firstNegative
    let orientation
    let orStep
    let xStep
    let spacer
    let finalPosY
    let middle

    let firstPos
    let secondPos
    let fixLength = 0
    let counter = 0
    let groups_length = circuitReady.groups.length
    for (let i = 0; i < groups_length; i++) {
        let g_length = circuitReady.groups[i].length
        firstPos = 82 + (g_length * 2)
        secondPos = firstPos + 60 + (groups_length * 2)
        for (let x = 0; x < g_length; x++) {
            if (circuitReady.groups[i].charAt(x).toUpperCase() !== alphabet[x]) {
                let y = 0
                while (circuitReady.groups[i].charAt(x).toUpperCase() !== alphabet[x + y]) {
                    skipped += 40
                    y++
                }
            }
            if (circuitReady.groups[i].charAt(x) === circuitReady.groups[i].charAt(x).toLowerCase()) {
                negated = 20
            }
            let shift = 0
            if (Kmap.variables <= 2 && Kmap.groups.length === 2) {
                shift = 40
            }
            stringBuilder = stringBuilder.add_horLine((x * 40 + negated + skipped) + 29, height, step - (x * 40 + negated + skipped) - 5 + shift) //step-(x*40+negated + skipped)+29
            hLines.push(height)
            height += 20
            negated = 0
            skipped = 0
        }
        centers.push(height - 19 - ((g_length * 20) / 2 - 35))
        if (g_length > 1)
            stringBuilder = Kmap.mode === 1 ? stringBuilder.add_AND(firstPos + step - 15, height - 19 - ((g_length * 20) / 2 - 35)) : stringBuilder.add_OR(firstPos + step - 15 - 35, height - 19 - ((g_length * 20) / 2 - 35) - 52)
        height += 20
        firstNegative = false
        orientation = 1
        orStep = Math.round(52 / (hLines.length + 1))
        xStep = (firstPos - 62)
        spacer = (52 - (orStep * hLines.length))
        finalPosY = 0

        middle = centers.length
        let fix = 0
        let h_length = hLines.length
        for (let t = 0; t < h_length; t++) {
            if (hLines[t] > (centers[i] - 26)) {
                if (orientation !== -1)
                    firstNegative = true
                orientation = -1
            } else if (hLines[t] === (centers[i] - 26)) {
                orientation = 0
            }

            if (!firstNegative) {
                xStep += orientation < 0 ? orStep : orStep * -1
            } else
                firstNegative = false

            if (orientation === 0) {
                xStep += orStep
            }

            fix = Math.floor(Kmap.variables % hLines.length)
            let isEmpty = true
            for (let k = 0; k < groups_length; k++) {
                if (circuitReady.groups[k].length > 1) {
                    isEmpty = false
                }
            }
            if (!isEmpty && h_length === 1 || (h_length <= 2 && !isEmpty)) {
                stringBuilder +=
                    "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
                    "d=\"m " + (step + 15) + " " + (hLines[t]) + " h 72\"></path>" +
                    "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
                    "d=\"m " + (step + 15 + 62) + " " + (centers[i] - 26) + " h " + (45) + "\"></path>"
            } else if (hLines.length > 2) {
                stringBuilder +=
                    "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
                    "d=\"m " + (step + 15) + " " + (hLines[t]) + " h " + (xStep) + " v " + ((orientation === 0) ? 0 : ((centers[i] - 52) + spacer + orStep * t) - hLines[t] - fix) + " h " + (firstPos - 55) + "\"></path>" +
                    "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
                    "d=\"m " + (step + 15 + 62) + " " + (centers[i] - 26) + " h " + (45) + "\"></path>"
            }
        }
        if (h_length === 1)
            counter++
        hLines = []
    }
    finalPosY = 0
    orientation = 1
    orStep = Math.round(52 / (centers.length + 1))
    xStep = (secondPos - 62)
    spacer = (52 - (orStep * centers.length))
    firstNegative = false

    if (Kmap.groups.length <= 1) {
        let line
        let letter
        let length
        if (circuitReady.groups[0].length <= 1) {
            line = step + 10
            letter = line + 75
            length = 70
        } else {
            line = step + firstPos
            letter = line + 55
            length = 50
        }
        stringBuilder +=
            "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
            "d=\"m " + (line) + " " + (centers[0] - 26) + " h " + (length) + "\"></path>"
        stringBuilderExtras +=
            "<div style=\"position:absolute; font-family:Arial,Georgia,serif;" +
            "visibility:inherit;top:" + (centers[0] - 41) + "px; left:" + (letter) + "px;\"><i>Y</i></div>";

        circuit.innerHTML = stringBuilder + " </svg>" + stringBuilderExtras;
        document.getElementById("circuit").style.width = (letter + 15) + "px"
        return
    }
    middle = centers.length
    if (middle % 2 !== 0)
        finalPosY = centers[Math.round((centers.length - 1) / 2)] - 52
    else
        finalPosY = (height - 39) / 2 - 1

    let all_centers = counter === centers.length
    if (all_centers && Kmap.variables < 4)
        fixLength = step - (Kmap.variables * 10 + negated + skipped)
    else if(all_centers && Kmap.variables === 4)
        fixLength = step - (Kmap.variables * 15 + negated + skipped)
    else if(all_centers && Kmap.variables > 4 && Kmap.variables < 7)
        fixLength = step - (Kmap.variables * 24 + negated + skipped)
    else if(all_centers && Kmap.variables > 6 && Kmap.variables < 9)
        fixLength = step - (Kmap.variables * 28 + negated + skipped)
    else if(all_centers && Kmap.variables > 8)
        fixLength = step - (Kmap.variables * 30 + negated + skipped)

    if(Kmap.variables === 1)
        fixLength+=25
    stringBuilder = Kmap.mode === 1 ? stringBuilder.add_OR(secondPos + step + 10 - (fixLength), finalPosY) : stringBuilder.add_AND(secondPos + step - fixLength + 35, finalPosY + 52)

    let fix = 0
    let c_length = centers.length
    for (let i = 0; i < c_length; i++) {
        if (centers[i] > (finalPosY + 26 + 26)) {
            if (orientation !== -1)
                firstNegative = true
            orientation = -1
        } else if (centers[i] === (finalPosY + 26 + 26))
            orientation = 0

        if (!firstNegative) {
            xStep += orientation < 0 ? (orStep) : (orStep) * -1
        } else
            firstNegative = false

        if (orientation === 0) {
            xStep += orStep
        }
        stringBuilder +=
            "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
            "d=\"m " + (firstPos + step - fixLength + 20) + " " + (centers[i] - 26) + " h " + (xStep + orStep - 40 - 20) + " v " + ((orientation === 0) ? 0 : Math.ceil((finalPosY + spacer + orStep * i) - (centers[i]) + 26 - fix)) + " h " + (secondPos - xStep - (fixLength / step) - 20) + "\"></path>"
    }
    stringBuilder +=
        "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"none\" " +
        "d=\"m " + (secondPos + step + 30 - (fixLength)) + " " + (finalPosY + 26) + " h " + (70) + "\"></path>"
    stringBuilderExtras +=
        "<div style=\"position:absolute; font-family:Arial,Georgia,serif;" +
        "visibility:inherit;top:" + (finalPosY + 11) + "px; left:" + (secondPos + step + 105 - (fixLength)) + "px;\"><i>Y</i></div>";

    circuit.innerHTML = stringBuilder + " </svg>" + stringBuilderExtras;
    document.getElementById("circuit").style.width = (secondPos + step + 120 - (fixLength)) + "px"
}

function handleExceptions() {
    let g_length = Kmap.groups.length
    let result
    let gr1 = null
    let gr2 = null
    let firstLetterX
    let secondLetterX
    let firstLetterY = null
    let secondLetterY = null
    let common = ""
    let common1 = ""
    if(Kmap.variables === 7) {
        firstLetterX = "f"
        secondLetterX = Kmap.mode === 0? "G" : "g"
        // firstLetterY = "f"
        // secondLetterY = Kmap.mode === 0? "G" : "g"
    }
    else if (Kmap.variables === 8){
        firstLetterX = "g"
        secondLetterX = Kmap.mode === 0? "H" : "h"
        firstLetterY = "c"
        secondLetterY = Kmap.mode === 0? "D" : "d"
    }
    else if (Kmap.variables === 9){
        firstLetterX = "h"
        secondLetterX = Kmap.mode === 0? "I" : "i"
        firstLetterY = "c"
        secondLetterY = Kmap.mode === 0? "D" : "d"
    }
    else if (Kmap.variables === 10){
        firstLetterX = "i"
        secondLetterX = Kmap.mode === 0? "J" : "j"
        firstLetterY = "d"
        secondLetterY = Kmap.mode === 0? "E" : "e"
    }
    for (let i = 0; i < g_length; i++) {
        result = getResult(Kmap.groups[i], true)
        if(result.length === Kmap.variables) {
            break;
        }
        if (gr1 === null && ((result.includes(firstLetterX.toUpperCase()) || result.includes(firstLetterX)) && result.includes(secondLetterX))) {
            gr1 = Kmap.groups[i]
            common = result.slice(0, -2)
        } else if (gr1 !== null && common === result.slice(0, -2) && ((result.includes(firstLetterX.toUpperCase()) || result.includes(firstLetterX)) && result.includes(secondLetterX))) {
            let gl = Kmap.groups[i].length
            for (let k = 0; k < gl; k++) {
                gr1.push(Kmap.groups[i][k])
            }
            gl = Kmap.groups[i].separated.length
            for (let k = 0; k < gl; k++) {
                gr1.separated.push(Kmap.groups[i].separated[k])
            }
            // break;
        }
        if (firstLetterY !== null && gr2 === null && ((result.includes(firstLetterY.toUpperCase())
            || result.includes(firstLetterY)) && result.includes(secondLetterY))) {
            gr2 = Kmap.groups[i]
            common1 = result.replace(firstLetterY, "").replace(secondLetterY, "")
        } else if (firstLetterY !== null && gr2 !== null
            && ((result.includes(firstLetterY.toUpperCase()) || result.includes(firstLetterY))
                && result.includes(secondLetterY))) {
            if(common1 === result.replace(firstLetterY, "").replace(secondLetterY, "") ||
                common1 === result.replace(firstLetterY.toUpperCase(), "").replace(secondLetterY, "")){
                let gl = Kmap.groups[i].length
                for (let k = 0; k < gl; k++) {
                    gr2.push(Kmap.groups[i][k])
                }
                gl = Kmap.groups[i].separated.length
                for (let k = 0; k < gl; k++) {
                    gr2.separated.push(Kmap.groups[i].separated[k])
                }
                // break;
            }
        }
    }
    fullyContains()
}

String.prototype.add_OR = function (row, col) {
    return this +
        "<path fill=\"var(--circuit)\" " +
        "d=\"m " + row + " " + col + " c 26 13 26 39 0 52 m 0 0 c 26 0 52 0 65 -26 c -13 -26 -39 -26 -65 -26\"></path>";
}

String.prototype.add_AND = function (row, col) {
    return this +
        "<path fill=\"var(--circuit)\" " +
        "d=\"m " + row + " " + col + " c 44 0 44 -52 0 -52 l -32 0 l 0 52 z\"></path>";
}

String.prototype.add_horLine = function (row, col, length) {
    return this +
        //dot
        "<path stroke-width=\"0\" stroke=\"var(--circuit)\" fill=\"var(--circuit)\" " +
        "d=\"m " + row + " " + col + " l 5 0 a 1 1 0 0 0 -10 0 a 1 1 0 0 0 10 0\"></path>" +

        //horLine
        "<path stroke-width=\"2\" stroke=\"var(--circuit)\" fill=\"var(--circuit)\" " +
        "d=\"m " + row + "," + col + " l " + length + "," + 0 + "\"></path>";
}

$("#kmapReset").on("click", function () {
    document.getElementById("solver_result_1").innerHTML = ""
    document.getElementById("solver_result_2").innerHTML = ""
    document.getElementById("solver_result_3").innerHTML = ""
    document.getElementById("solver_result_4").innerHTML = ""
    document.getElementById("solver_result_5").innerHTML = ""
    document.getElementById("circuitDiv").innerHTML = ""
    $('.srD').css("height", "80px")
    $('#modal_modeSwitch').prop("checked", true)
    $('#solver_result_4').css("background-color", "var(--outputFieldBackground)")
    $('#loading').show()
    setTimeout(function () {
        generateTable()
        generateMap()
    }, 0)
    setTimeout(function () {
        $('#loading').fadeOut(0);
    }, 1)
    $('#circuitDiv').hide()
})
