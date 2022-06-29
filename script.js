let rowNumberSection = document.querySelector(".row-number-section");

let columnTagsSection = document.querySelector(".column-tag-section");

let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let formulaInput = document.querySelector(".formula-input-section");

let cellSection = document.querySelector(".cell-section");

let lastCell;

let dataObj = {};

formulaInput.addEventListener("keydown", function(e){
    if(e.key=="Enter"){
        console.log("now evaluating formula");

        let typedFormula = e.currentTarget.value;
        console.log(typedFormula);

        if(!lastCell) return;
        
        console.log("not returned");
        
        let selectedCellAdd = lastCell.getAttribute("data-address");
        let cellObj = dataObj[selectedCellAdd];
        
        cellObj.formula = typedFormula;
        
        let upstream = cellObj.upstream;
        
        
        for(let k = 0; k<upstream.length; k++){
            // removeFromDownstream(parent, child);
            
            removeFromDownstream(upstream, selectedCellAdd);             
        }
        
        cellObj.upstream = [];

        let formulaArr = typedFormula.split(" ");
        let cellsInFormula = [];

        for(let i=0; i<formulaArr.length; i++){
            if(formulaArr[i] != '+' 
            && formulaArr[i] != '-'
            && formulaArr[i] != '*'
            && formulaArr[i] != '/'
            && isNaN(formulaArr[i])){
                cellsInFormula.push(formulaArr[i]);
            }
        }

        for(let i=0; i<cellsInFormula.length; i++){
            addToDownstream(cellsInFormula[i], selectedCellAdd);
        }
        cellObj.upstream = cellsInFormula;
        
        // update value
        
        let valObj = {};

        for(let i=0; i<cellsInFormula.length; i++){
            let cellValue = dataObj[cellsInFormula[i]].value;
    
            valObj[cellsInFormula[i]] = cellValue;
        }
    
        // a1 + b1
        for(let key in valObj){
            typedFormula = typedFormula.replace(key, valObj[key]);
        }
    
        // 20 + 10
        let newVal = eval(typedFormula);

        lastCell.innerText = newVal;
    
        cellObj.value = newVal;

        let downstream = cellObj.downstream;

        for(let i=0; i<downstream.length; i++){
            updateCell(downstream[i]);
        }
        
        dataObj[selectedCellAdd] = cellObj;

    }
});


cellSection.addEventListener("scroll", function(e){
    console.log(e.currentTarget.scrollTop);

    rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`

    columnTagsSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;

});


for(let i=1; i<=100; i++){
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number");
    rowNumberSection.append(div);
}



for(let i=0; i<26; i++){
    let asciiCode = 65+i;
    
    let reqAlphabet = String.fromCharCode(asciiCode);
    
    let div = document.createElement("div");
    div.innerText = reqAlphabet;
    
    div.classList.add("column-tag");
    columnTagsSection.append(div);
}



for(let i=1; i<=100; i++){
    
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    
    for(let j=0; j<26; j++){
        // A to Z
        let asciiCode = 65+j;
        
        let reqAlphabet = String.fromCharCode(asciiCode);
        let cellAddress = reqAlphabet+i; // for i=1 => A1 --- Z1
        
        dataObj[cellAddress] = {
            value : undefined,
            formula : undefined,
            downstream : [],
            upstream : [],
            align: "left",
            color: "black",
            bgColor: "white",
        };
        
        let cellDiv = document.createElement("div");
        
        cellDiv.addEventListener("input", function(e){
            // jis cell par type kra uske attribute se uska cell address fetch kra
            let currCellAddress = e.currentTarget.getAttribute("data-address");
            
            // kyuki sare cell objects dataObj mein store ho rkhe hain using their cell address as key
            // maine jis cell pr click krke type kra uska hi address fetch and uska hi object chahiye
            // to wo address as key use krke dataObj se fetch krlia req cellObj ko  
            let currCellObj = dataObj[currCellAddress];
            
            console.log(currCellObj);
            console.log(e.currentTarget.innerText);
            
            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;
            
            // 1-> loop on upstream 
            // 2-> for each cell go to its downstream and remove ourself
            // 3-> apni upstream ko empty array kro
            
            let currUpstream = currCellObj.upstream;
            
            for(let k = 0; k<currUpstream.length; k++){
                // removeFromDownstream(parent, child);
                
                removeFromDownstream(currUpstream, currCellAddress);                
            }
            
            currUpstream = [];
            
            
            let currDownstream = currCellObj.downstream;

            // C1=20 ,E1 depends on C1 , E1 formula => (2*C1) = 40
            
            for(let k=0; k<currDownstream.length; k++){
                updateCell(currDownstream[k]);
            }
            
            dataObj[currCellAddress] = currCellObj;
            
            console.log(currCellObj);
        });
        
        
        cellDiv.contentEditable = true;
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("data-address", cellAddress);
        
        cellDiv.addEventListener("click", function(e) {
            if(lastCell){
                lastCell.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");
            
            lastCell = e.currentTarget;
            
            let currCellAddress = e.currentTarget.getAttribute("data-address");

            formulaBarSelectedCellArea.innerText = currCellAddress;
        });

        rowDiv.append(cellDiv);
    }
    cellSection.append(rowDiv); 
}

if(localStorage.getItem("sheet")){
    dataObj = JSON.parse(localStorage.getItem("sheet"));
    for(let x in dataObj){
        let cell = document.querySelector(`[data-address='${x}']`);
        if(dataObj[x].value)
            cell.innerText = dataObj[x].value;
        // dataObj[x];
    }
}

// dataObj["A1"].value = 20; 
// dataObj["A1"].downstream = ["B1"]; 

// dataObj["B1"].formula = "2 * A1"; 
// dataObj["B1"].upstream = ["A1"]; 

// dataObj["B1"].value = 40;

// let a1cell = document.querySelector("[data-address='A1']");
// let b1cell = document.querySelector("[data-address='B1']");

// a1cell.innerText = 20;
// b1cell.innerText = 40;

//C1 = Formula(2*A1)
//A1 = parent
//C1 = child

// is function ko kisi ki upstream se mtlb nhi hai
// bs itna kaam hai parent ki downstream se child ko hata dunga connection khtm krne k liye kiyuki formula changes to dv
function removeFromDownstream(parentCell, childCell){
    //1- fetch parentCell's downStream
    
    let parentDownstream = dataObj[parentCell].downstream;
    
    //2- filter kro childCell ko parent ki upstream se
    let filteredDownstream = []; // A1
    
    for(let i=0; i<parentDownstream.length; i++){
        
        if(parentDownstream[i]!=childCell){
            filteredDownstream.push(parentDownstream[i]);
        }
    }
    
    //3- filtered upstream ko wapis save krvao dataObj m req cell mein
    dataObj[parentCell].downstream = filteredDownstream;
}

function updateCell(cell){
    let cellObj = dataObj[cell];
    let upstream = cellObj.upstream;
    let formula = cellObj.formula;
     
    //upstream mein jo bhi cells hain unke objects mein jaunga vha se unki values leke aaunga
    // vo saari values mai ek object mein key value pair form mein store krunga where key being

    // {
    //     A1 : 20,
    //     B1 : 10
    // }
    let valObj = {};

    for(let i=0; i<upstream.length; i++){
        let cellValue = dataObj[upstream[i]].value;

        valObj[upstream[i]] = cellValue;
    }

    // a1 + b1
    for(let key in valObj){
        formula = formula.replace(key, valObj[key]);
    }

    // 20 + 10
    let newVal = eval(formula);

    cellOnUi = document.querySelector(`[data-address='${cell}']`);
    cellOnUi.innerText = newVal;

    dataObj[cell].value = newVal;

    let downstream = cellObj.downstream;

    for(let i=0; i<downstream.length; i++){
        updateCell(downstream[i]);
    }

}

function addToDownstream(parent, child){

    dataObj[parent].downstream.push(child);

}