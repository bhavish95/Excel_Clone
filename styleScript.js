let allAlignmentOptions = document.querySelectorAll(".align-cell-content span");

let menuBarOptions = document.querySelectorAll(".menu-bar-section div");

let fileOptions = menuBarOptions[0];


let body = document.querySelector("body");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];

leftAlign.addEventListener("click", function() {
    if(lastCell){
        lastCell.style.textAlign = "left";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "left";
    }
});
rightAlign.addEventListener("click", function() {
    if(lastCell){
        lastCell.style.textAlign = "right";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "right";
    }
    
    
}); 
centerAlign.addEventListener("click", function() {
    if(lastCell){
        lastCell.style.textAlign = "center";
        let address = lastCell.getAttribute("data-address");
        dataObj[address].align = "center";
    }
});

// BIU bold italic underline
let BIU = document.querySelectorAll(".bold-italics-underline span");

let bold = BIU[0];
let italic = BIU[1];
let underline = BIU[2];


bold.addEventListener("click", function(){
    if(lastCell){
        lastCell.style.fontWeight="bold";
    }
})

italic.addEventListener("click", function(){
    if(lastCell){
        lastCell.style.fontStyle="italic";
    }
})

underline.addEventListener("click", function(){
    if(lastCell){
        lastCell.style.textDecoration="underline";
    }
})


// bg color

let allColorOptions = document.querySelectorAll(".cell-color-options span");


let bgColorPicker = allColorOptions[0];
let fontColorPicker = allColorOptions[1];

bgColorPicker.addEventListener("click", function(){
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input", function(e){
        if(lastCell){
            lastCell.style.backgroundColor = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");
            dataObj[address].bgColor = e.currentTarget.value;
        }
    });

});

fontColorPicker.addEventListener("click", function(){
    let colorPickerElement = document.createElement("input");
    colorPickerElement.type = "color";
    body.append(colorPickerElement);
    colorPickerElement.click();

    colorPickerElement.addEventListener("input", function(e){
        if(lastCell){
            lastCell.style.color = e.currentTarget.value;
            let address = lastCell.getAttribute("data-address");
            dataObj[address].color = e.currentTarget.value;
        }
    });

});

fileOptions.addEventListener("click", function(){
    let isOpen = fileOptions.getAttribute("data-open");
    if(isOpen == "true"){
        fileOptions.setAttribute("data-open", "false");
        document.querySelector(".file-drop-down").remove();
    }
    else{
        fileOptions.setAttribute("data-open", "true");

        let dropDown = document.createElement("div");
        dropDown.innerHTML = "<p>Save</p><p>Clear</p>";

        let allOptions = dropDown.querySelectorAll("p");
        allOptions[0].addEventListener("click", function(){
            localStorage.setItem("sheet", JSON.stringify(dataObj));
        })

        // let allOptions = dropDown.querySelectorAll("p");
        allOptions[1].addEventListener("click", function(){
            localStorage.setItem("sheet", "");
        })

        dropDown.classList.add("file-drop-down");
        fileOptions.append(dropDown);
    }
});