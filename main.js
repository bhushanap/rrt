const canvas = document.getElementById('canvas');
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
const ctx = canvas.getContext('2d');
const executeButton = document.getElementById('executeButton');
const pauseButton = document.getElementById('pauseButton');
const borders = new Borders();
let isDragging1 = false;
let isDragging2 = false;
let circle1 = { x: canvas.width*0.1, y: canvas.height*0.1, radius: 20, color: 'blue' };
let circle2 = { x: canvas.width*0.9, y: canvas.height*0.6, radius: 20, color: 'red' };
let simSpeed = 10;
rrtSolver = new RRTSolver({x:circle1.x,y:circle1.y,dist:0,root:0},{x:circle2.x,y:circle2.y,dist:0,root:1},borders,20,50,3);
let run = false;

const clpSlider = document.getElementById('clpSlider');
const thresholdSlider = document.getElementById('thresholdSlider');
const clpValue = document.getElementById('clpValue');
const thresholdValue = document.getElementById('thresholdValue');
const stepSizeValue = document.getElementById('stepSizeValue');
const simSpeedValue = document.getElementById('simSpeedValue');
const solverSelector = document.getElementById('solverSelector');

solverSelector.addEventListener('change', function () {
  if (solverSelector.value === 'Djikstra') {
    // Use the first solver
    rrtSolver = new DjikstraSolver({x:circle1.x,y:circle1.y,dist:0,root:0},{x:circle2.x,y:circle2.y,dist:0,root:1},borders,rrtSolver.threshold,rrtSolver.stepsize,rrtSolver.clp);
    console.log('djikstra')
  } else if (solverSelector.value === 'RRT') {
    // Use the second solver
    rrtSolver = new RRTSolver({x:circle1.x,y:circle1.y,dist:0,root:0},{x:circle2.x,y:circle2.y,dist:0,root:1},borders,rrtSolver.threshold,rrtSolver.stepsize,rrtSolver.clp);
    console.log('RRT')
  }
});

clpSlider.addEventListener('input', function () {
  rrtSolver.clp = parseInt(clpSlider.value);
  clpValue.textContent = clpSlider.value;
});

thresholdSlider.addEventListener('input', function () {
  rrtSolver.threshold = parseInt(thresholdSlider.value);
  thresholdValue.textContent = thresholdSlider.value;
});

stepSizeSlider.addEventListener('input', function () {
  rrtSolver.stepsize = parseInt(stepSizeSlider.value);
  stepSizeValue.textContent = stepSizeSlider.value;
});

simSpeedSlider.addEventListener('input', function () {
  simSpeed = parseInt(simSpeedSlider.value);
  simSpeedValue.textContent = simSpeedSlider.value;
});

function draw(){
    drawCircle(circle1);
    drawCircle(circle2);
    borders.draw(ctx);
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.color;
  ctx.fill();
  ctx.closePath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkIfInsideCircle(x, y, circle) {
  return Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) < circle.radius;
}

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  if (checkIfInsideCircle(mouseX, mouseY, circle1)) {
    isDragging1 = true;
  } else if (checkIfInsideCircle(mouseX, mouseY, circle2)) {
    isDragging2 = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging1) {
    circle1.x = e.clientX - canvas.getBoundingClientRect().left;
    circle1.y = e.clientY - canvas.getBoundingClientRect().top;
    clearCanvas();
    draw();
  } else if (isDragging2) {
    circle2.x = e.clientX - canvas.getBoundingClientRect().left;
    circle2.y = e.clientY - canvas.getBoundingClientRect().top;
    clearCanvas();
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging1 = false;
  isDragging2 = false;
  rrtSolver.start = {x:circle1.x,y:circle1.y,dist:0,root:0};
  rrtSolver.goal = {x:circle2.x,y:circle2.y,dist:0,root:1};
  rrtSolver.points = [rrtSolver.start,rrtSolver.goal];
});

executeButton.addEventListener('click', () => {
  // console.log('Circle 1 position:', { x: circle1.x, y: circle1.y });
  // console.log('Circle 2 position:', { x: circle2.x, y: circle2.y });
  // You can perform your custom logic here based on the circle positions
  if(!run){
    run = true;
    executeButton.textContent = 'Clear';
    pauseButton.textContent = 'Pause';
    isAnimating=true;
    animate();
  }
  else{
    run = false;
    const borders = new Borders();
    rrtSolver = new RRTSolver({x:circle1.x,y:circle1.y,dist:0,root:0},{x:circle2.x,y:circle2.y,dist:0,root:1},borders,20,50,3);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    isAnimating=false;
    pauseButton.textContent = 'Pause';
    draw();
    executeButton.textContent = 'Run'
  }
  
  animate();
});

pauseButton.addEventListener('click', () => {
  // console.log('Circle 1 position:', { x: circle1.x, y: circle1.y });
  // console.log('Circle 2 position:', { x: circle2.x, y: circle2.y });

  // You can perform your custom logic here based on the circle positions
  if(isAnimating){
    if(run){
      isAnimating=false;
      pauseButton.textContent = 'Resume';
    }

  }
  else{
    if(pauseButton.textContent!='Pause'){
      pauseButton.textContent = 'Pause';
      isAnimating=true;
      animate();
    }
  }
});



// Initial drawing
draw();

isAnimating = true;


// animate();
function animate(){
  if (!isAnimating) {
    return; // Stop animation if isAnimating is false
  }
  let found = rrtSolver.step();
 
  rrtSolver.draw(ctx);
  if(found){
    isAnimating=false;
  }
  draw();
  // console.log(rrtSolver.points);
  setTimeout(function() {
    requestAnimationFrame(animate);
  }, simSpeed);
  // requestAnimationFrame(animate);
}


