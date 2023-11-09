class RRTSolver {
    constructor(start,goal,borders,threshold,stepsize,clp){
        const canvas=document.getElementById("canvas");
        this.w = canvas.width;
        this.h = canvas.height;
        this.start=start;
        this.goal=goal;
        this.borders=borders;
        this.points = [start,goal];
        this.paths = [];
        this.steps = 100;
        this.threshold = threshold;
        this.clp = clp;
        this.borders = borders.borders;
        this.found = false;
        this.stepsize = stepsize;
    }

    step(){
        //Sample a random point
        let x = Math.random()*this.w;
        let y = Math.random()*this.h;
        let A = {x:x,y:y}
        
        //find nearest 5 points in network
        
        let clPts = [];
        let reachable =  false;
        // console.log(this.points.length)
        for(let i=0;i<this.points.length;i++){
            // console.log(i);
            // let intersect = false;
            // console.log(A);
            // // console.log(this.borders)
            // for(let j=0;j<this.borders.length;j++){
            //     let C = this.borders[j][0];
            //     let D = this.borders[j][1];
            //     let B = this.points[i];
            //     // console.log(A,B,C,D);
            //     let touch = getIntersection(A, B, C, D);
            //     // console.log(touch, j)
            //     if(touch){
            //         // console.log(intersect)
            //         intersect=true;
            //         break
            //     }
            // }
            // // console.log(intersect)
            // console.log(intersect)
            // if(intersect==true){
            //     continue
            // }
            
            // console.log('helloooo')
            
            
            let dist = ((x-this.points[i].x)**2 + (y-this.points[i].y)**2)**0.5;
            // if(dist<this.threshold){
            //     continue;
            // }
            reachable=true;
            if(clPts.length<this.clp){
                
                // console.log({index:i, dist:dist})
                // console.log(this.clp)
                // console.log(clPts.length)
                clPts.push({index:i, dist:dist});
                
                // console.log(clPts.length)
                clPts.sort((a, b) => a.dist - b.dist);
            }
            
            else{
                if(dist<clPts[this.clp-1].dist){
                    clPts[this.clp-1] = {index:i, dist:dist}
                    clPts.sort((a, b) => a.dist - b.dist);
                }
                }
            }
            if(!reachable){
                return;
            }
            let leastDist = 10000;
            let index = -1;      
            // console.log(clPts); 
        
            // console.log(reachable);
        let extended = false;
        
        for(let i=0;i<clPts.length;i++){
            
            let totdist = this.points[clPts[i].index].dist + clPts[i].dist;
            if(totdist<leastDist){
                // console.log(this.points.length);
                let success = true;
                // console.log(A);
                // console.log(this.borders)
                let B = this.points[clPts[i].index];
                let Am = {x:B.x + (A.x-B.x)*this.stepsize/clPts[i].dist,y:B.y + (A.y-B.y)*this.stepsize/clPts[i].dist}
                for(let j=0;j<this.borders.length;j++){
                    let C = this.borders[j][0];
                    let D = this.borders[j][1];
                    
                    // console.log(A,B,C,D);
                    let touch = getIntersection(Am, B, C, D);
                    // console.log(touch, Am,B,C,D);
                    // console.log(touch, j)
                    if(touch){
                        // console.log(intersect)
                        success=false;
                    }
                }
                if(success==true){
                    leastDist=totdist;
                    index = clPts[i].index;
                    x = Am.x;
                    y = Am.y;
                    extended=true;
                }
                // console.log(intersect)
                // console.log(intersect)
                // console.log(clPts,' closest is ', index, ' with dist ', leastDist)
            }
            
        }
        // console.log(extended)
        if(extended==false){
            return this.found
        }
        let point = {x:x,y:y,dist:this.points[index].dist+this.stepsize,parent:index,root:this.points[index].root};
        // console.log(point)
        this.points.push(point);
        this.paths.push([this.points[index],point]);
        // console.log(clPts);
        let other = null
        for(let i=0;i<clPts.length;i++){
            if((point.root) != this.points[clPts[i].index].root){
                let success=true;
                for(let j=0;j<this.borders.length;j++){
                    let C = this.borders[j][0];
                    let D = this.borders[j][1];
                    let touch = getIntersection(point, this.points[clPts[i].index], C, D);
                    if(touch){
                        success=false;
                    }
                }
                if(success){
                    other = this.points[clPts[i].index]
                    this.paths.push([other, point,1])
                    this.found = true;
                    // console.log(clPts);
                    // console.log(this.found)
                    break;
                }
                
            }
        }

        if(this.found){
            // console.log(this.paths);
            // let pr = point.root
            // let or = other.root
            while(true){
                if(!point.parent){
                    // this.paths.push([point,this.points[point.parent],1]);
                    break;
                }
                this.paths.push([point,this.points[point.parent],1]);
                point = this.points[point.parent];
                
            }
            // this.paths.push([point,this.points[point.parent],1]);
            while(true){
                if(!other.parent){
                    // this.paths.push([other,this.points[other.parent],1]);
                    break;
                }
                this.paths.push([other,this.points[other.parent],1]);
                other = this.points[other.parent];
            }
            // this.paths.push([other,this.points[other.parent],1]);s

        return this.found
        }
        
        
        }
    

    draw(ctx){
        for(let i=0;i<this.points.length;i++){
            // console.log(this.points);
            ctx.beginPath();
            ctx.arc(this.points[i].x, this.points[i].y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#333333';
            ctx.fill();
        };

        // console.log(this.paths)
        if(this.paths.length>0){
            for(let i=0;i<this.paths.length;i++){
                ctx.beginPath();
                ctx.moveTo(this.paths[i][0].x,this.paths[i][0].y);
                ctx.lineTo(this.paths[i][1].x,this.paths[i][1].y);
                ctx.strokeStyle = '#aaaa33';
                if(this.paths[i][2]==1){
                    ctx.strokeStyle = '#33ff33';
                    ctx.lineWidth=3;
                }
                ctx.stroke();
            }
        }
    }

    solve(ctx){
        for(let i=0;i<this.steps;i++){
            this.step();
            this.draw(ctx);
        }

    
    }
}