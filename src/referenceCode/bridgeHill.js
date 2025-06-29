import * as THREE from 'three'

// Procedural Marin Headlands hill adjacent to the bridge
export function createBridgeHill() {
    const CENTER_X = 900, CENTER_Z = -250
    const APEX_HEIGHT = 150
    const R_MAJOR = 500, R_MINOR = 350
    const CLIFF_DROP = 35
    const THETA_STEP_DEG = 5, RADIAL_STEPS = 60

    const positions=[], colors=[], indices=[]
    const rock = new THREE.Color('#73624c'), grass=new THREE.Color('#5a7342')
    const radialCount = RADIAL_STEPS+1, thetaSteps = Math.round(360/THETA_STEP_DEG)
    const idx=(r,t)=>r+t*radialCount

    for(let t=0;t<=thetaSteps;t++){
        const theta=THREE.MathUtils.degToRad(t*THETA_STEP_DEG)
        const cos=Math.cos(theta), sin=Math.sin(theta)
        const R=(R_MAJOR*R_MINOR)/Math.sqrt((R_MINOR*cos)**2+(R_MAJOR*sin)**2)
        for(let r=0;r<=RADIAL_STEPS;r++){
            const frac=r/RADIAL_STEPS, radius=R*frac
            let h=APEX_HEIGHT*(1-Math.pow(frac,1.8))
            const waterDir=0
            const delta=Math.abs(THREE.MathUtils.euclideanModulo(theta-waterDir+Math.PI,2*Math.PI)-Math.PI)
            const tSlope=THREE.MathUtils.clamp(delta/(Math.PI/2),0,1)
            const slopeFactor=0.4+0.6*tSlope
            h*=slopeFactor
            if(frac>0.9&&tSlope<0.2) h=Math.max(h-CLIFF_DROP,0)
            const x=CENTER_X+radius*cos, z=CENTER_Z+radius*sin, y=h
            positions.push(x,y,z)
            const steep=1-slopeFactor
            const c=grass.clone().lerp(rock,steep)
            colors.push(c.r,c.g,c.b)
        }
    }
    for(let t=0;t<thetaSteps;t++){
        for(let r=0;r<RADIAL_STEPS;r++){
            const a=idx(r,t),b=idx(r+1,t),c=idx(r,t+1),d=idx(r+1,t+1)
            indices.push(a,b,d,a,d,c)
        }
    }
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
    geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    const mat=new THREE.MeshStandardMaterial({vertexColors:true})
    const mesh=new THREE.Mesh(geo,mat)
    mesh.castShadow=mesh.receiveShadow=true
    return mesh
} 