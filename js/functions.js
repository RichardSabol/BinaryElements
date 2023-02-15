function copyText(icon, index, no_spaces=false) {
    let icon_el = $("#"+icon.id)
    if(no_spaces) {
        if(document.getElementById(index).innerHTML === "")
            return
        icon_el.tooltip('show')

        let copyText = document.createRange();
        copyText.selectNode(document.getElementById(index));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(copyText);
    }
    else {
        if(document.getElementById(index).value === "")
            return
        icon_el.tooltip('show')
        let copyText = document.getElementById(index)
        if(!index.includes("solver")){
            copyText.value = copyText.value.replace(/\s/g, '');
        }
        window.getSelection().removeAllRanges();
        copyText.setSelectionRange(0, 99999);
        copyText.select();
    }
    document.execCommand('copy');
    icon.classList.add("bi-check2")
    icon.classList.remove("bi-files")
    window.setTimeout(function (){
        icon.classList.add("bi-files")
        icon.classList.remove("bi-check2")
        icon_el.tooltip('hide')
    }, 2000);
}


function converter_reset(full, message, button=false) {
    if(full){
        document.getElementById('converter_input').value = ""
        if(button){
            document.getElementById('converter_unit_1').value = $.i18n("decimal")
            document.getElementById('converter_input_symbol').innerHTML = 10
            document.getElementById('converter_bits').value = 8
        }
    }
    message = $.i18n(message)
    document.getElementById('converter_output_1').value = message
    document.getElementById('converter_output_2').value = message
    document.getElementById('converter_output_3').value = message
    document.getElementById('converter_output_ex').value = message
    document.getElementById('converter_output_4').value = message
    document.getElementById('converter_output_5').value = message
    document.getElementById('converter_output_6').value = message
    document.getElementById('converter_output_7').value = message
}

function calculator_reset(full, message, button=false) {
    if(full){
        document.getElementById('calculator_first_number').value = ""
        document.getElementById('calculator_second_number').value = ""
        document.getElementById('calculator_first_op').value = "2"
        document.getElementById('calculator_second_op').value = "2"
        if(button)
            document.getElementById('calculator_bits').value = 8
        document.getElementById('calculator_op').value = $.i18n("add")
    }
    message = $.i18n(message)
    document.getElementById('calculator_output_1').value = message
    document.getElementById('calculator_output_2').value = message
    document.getElementById('calculator_output_3').value = message
    document.getElementById('calculator_output_4').value = message
    document.getElementById('calculator_output_5').value = message
    document.getElementById('calculator_output_6').value = message
    document.getElementById('calculator_output_7').value = message
    document.getElementById('calculator_output_8').value = message
}

