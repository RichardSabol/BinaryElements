function copyText(index) {
    let copyText = document.getElementById(index);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    //copyText.value = "copied"
    /*copyText.onmouseout =  function (){
        copyText.value = "done"
    }*/
}

function converter_reset() {
    document.getElementById('converter_input').value = ""
    document.getElementById('converter_output_1').value = ""
    document.getElementById('converter_output_2').value = ""
    document.getElementById('converter_output_3').value = ""
}

function calculator_reset() {
    document.getElementById('calculator_first_number').value = ""
    document.getElementById('calculator_second_number').value = ""
    document.getElementById('calculator_output_1').value = ""
    document.getElementById('calculator_output_2').value = ""
    document.getElementById('calculator_output_3').value = ""
    document.getElementById('calculator_output_4').value = ""
}
