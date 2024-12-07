let container=document.getElementById("container")
let conwidth=container.offsetWidth;
let conhight=container.offsetHeight;
let wallmode=false;
let rows=Math.floor(conhight/20);
let colmns=Math.floor(conwidth/20);
let m=[]
let preva=null
let prevb=null
let start=null
let end=null

for(let i=0;i<rows;i++){
    let r=[]
    for(let j=0;j<colmns;j++){

        r.push(0)

        let square=document.createElement("div");
        square.classList.add("square")
        square.setAttribute("id",`r${i}c${j}`)
        container.appendChild(square)
    }
    m.push(r)
}
console.log(m)
let a=document.getElementById("a")
let b=document.getElementById("b")
let wall=document.getElementById("walls")


function point(p) {
    // Click event handler for the container
    const containerClickHandler = (e) => {
        let x = Math.floor((e.clientX / 20))  // Adjust to 20px square size
        let y = Math.floor((e.clientY - 100) / 20)  // Subtract header height
        let j = x  // Calculate column index
        let i = y  // Calculate row index

        // Log the selected square's indices
        console.log(`Row: ${i}, Column: ${j}`);
      
        if (p=="a" ){
            if(preva!=null){
                let square =document.getElementById(`r${preva[0]}c${preva[1]}`)
                square.style.backgroundColor="white" 
                m[preva[0]][preva[1]]=0
                
            }
            let square =document.getElementById(`r${i}c${j}`)
            m[i][j]=1
            preva=[i,j]
            square.style.backgroundColor="rgb(7, 77, 73)" 
            start=[i,j]
        }
        else if(p=="b"){
            if( prevb!=null){
                let square =document.getElementById(`r${prevb[0]}c${prevb[1]}`)
                square.style.backgroundColor="white" 
                m[prevb[0]][prevb[1]]=0
                
            }
            let square =document.getElementById(`r${i}c${j}`)
            
            m[i][j]=2
            prevb=[i,j]
            
            square.style.backgroundColor="cadetblue"
            end = [i, j]; // Update end
            
        }
       
        // Remove the click event listener after the first click
        container.removeEventListener("click", containerClickHandler);
    };

    // Add the click event listener to the container
    container.addEventListener("click", containerClickHandler);
}

// Attach click event to Point A
a.addEventListener("click",()=> point("a"));
b.addEventListener("click",()=>point("b"))


//walll mode
wall.addEventListener("click",()=>{
    if (wallmode){
        wallmode=false
    }
    else{
        wallmode=true
    }
})
function addwall(e){
    if(!wallmode){
        return false

    }
    let x = Math.floor((e.clientX / 20))  // Adjust to 20px square size
    let y = Math.floor((e.clientY - 100) / 20)  // Subtract header height
    let j = x  // Calculate column index
    let i = y  // Calculate row index

    // Log the selected square's indices
    console.log(`Row: ${i}, Column: ${j}`);
    if (m[i][j]!=1 && m[i][j]!=2){
        let square = document.getElementById(`r${i}c${j}`);
        m[i][j] = 3; // Mark as wall
        square.style.backgroundColor = "black"; // Set wall color
    }
}
container.addEventListener("mousedown",(e)=>{
    const mouseMove=(e)=>{
        addwall(e)

    }
    container.addEventListener("mousemove",mouseMove)
    container.addEventListener("mouseup",(e)=>{
        container.removeEventListener("mousemove",mouseMove)
    })
})





//BFS ALGO:


const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function BFS(start,end){
    const queue=[start];
    let [sr,sc]=start;
    let [er,ec]=end
    const parent = Array.from({ length: rows }, () => Array(colmns).fill(null));  // array of that gives u the prev cell of a cell x , parent[0,1]=start=A=[0,0]
    const visited = Array.from({ length: rows }, () => Array(colmns).fill(false));// array of bools gives wheather the cell has been visited or not , visited[0,1]=false 
    visited[sr][sc]=true;
    let delay=0
    while(queue.length>0){
        const [r,c]=queue.shift()
        setTimeout(()=>{graycol(r,c)},delay)
        delay+=5
        if(r===er && c===ec){
            const finalpath=reconstructPath(parent,start,end);
            setTimeout(()=>{
                updategrid(finalpath)
            },delay)
            return finalpath 
        }
        for (const [dr,dc] of directions){
            const nr=r+dr
            const nc=c+dc
            if(nr>=0 && nr<rows && nc>=0 && nc<colmns && !visited[nr][nc] && m[nr][nc]!=3){
                visited[nr][nc]=true;
                queue.push([nr,nc]);
                parent[nr][nc]=[r,c];
                setTimeout(()=>{yellow(nr,nc)},delay)
                delay+=5
            } 
        }

    }
    console.log("No path found");
    setTimeout(()=>{alert("No Path Found")},delay+500)
    
    return []


}

function reconstructPath(parent, start, end) {
    const path = [];
    let [er, ec] = end;
    let [sr, sc] = start;

    while (er !== sr || ec !== sc) {
        path.push([er, ec]);
        [er, ec] = parent[er][ec];
    }

    path.push(start);
    return path.reverse();
}
function updategrid(path){
    const n=path.length;
    let delay=0
    
    for(let i=1;i<n-1;i++){

        setTimeout(()=>{
            const [r,c]=path[i]
            let id=`r${r}c${c}`
            const box=document.getElementById(id)
            box.style.backgroundColor="rgb(255, 0, 0)";
            
        },delay)
        delay+=50
    }
}



const startbutton = document.getElementById("buttonstart");
startbutton.addEventListener("click", () => {
    const chosealgo=document.getElementById("chosealgo").value
    if (start && end && chosealgo=="BFS"){
        const fianalpath=BFS(start, end)
        console.log(fianalpath)
        
    }
    else if(!(start&&end)){
        alert("place A and B")
    }
    else{
        alert("select an algo")
    }

});

let clearb=document.getElementById("clear")
clearb.addEventListener("click",()=>{
    start=null
    end=null
    for(let i=0;i<rows;i++){
        for(let j=0;j<colmns;j++){
    
            m[i][j]=0
    
            let box=document.getElementById(`r${i}c${j}`)
            box.style.backgroundColor="white"
        }
        
    }
})


function graycol(r,c){
    if(m[r][c]!=1 && m[r][c]!=2 && m[r][c]!=3 ){
        let box=document.getElementById(`r${r}c${c}`)
        box.style.backgroundColor="rgb(133, 158, 187)"
        
    }


}
function yellow(r,c){
    if(m[r][c]!=1 && m[r][c]!=2 && m[r][c]!=3 ){
        let box=document.getElementById(`r${r}c${c}`)
        box.style.backgroundColor="yellow"
        
    }
}
