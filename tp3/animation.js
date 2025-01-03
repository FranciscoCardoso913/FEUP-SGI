import * as THREE from 'three';

function cubicInterpolation(keyframes, t) {
    // Find the two keyframes surrounding the current time
    let prevKeyframe = null;
    let nextKeyframe = null;

    for (let i = 0; i < keyframes.length - 1; i++) {
        if (t >= keyframes[i].time && t <= keyframes[i + 1].time) {
            prevKeyframe = keyframes[i];
            nextKeyframe = keyframes[i + 1];
            break;
        }
    }

    if (prevKeyframe && nextKeyframe) {
         // Alpha value for linear interpolation
         const alpha = (t - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);

         // Interpolated position
         
         const interpolatedPosition = prevKeyframe.position.clone().lerp(nextKeyframe.position, alpha);
 

        // Interpolating rotation using quaternions
        const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(...prevKeyframe.rotation.toArray()));
        const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(...nextKeyframe.rotation.toArray()));
        const interpolatedQuaternion = new THREE.Quaternion().slerpQuaternions(q0, q1, alpha);

        // Convert back to Euler for consistency (if required)
        const interpolatedRotation = new THREE.Euler().setFromQuaternion(interpolatedQuaternion);



        return { position: interpolatedPosition, rotation: interpolatedRotation };
    }

    return { position: null, rotation: null }; // No interpolation if keyframes not found
}

  
  
  function catmullRom(p0, p1, p2, p3, t) {
    // Correct Catmull-Rom spline interpolation
    const t2 = t * t;
    const t3 = t2 * t;
   
  
    const v0 = p1.clone().multiplyScalar(2);
    
    const v1 = p2.clone().sub(p0).multiplyScalar(t);
    const v2 = p0.clone().multiplyScalar(-1).add(p1.clone().multiplyScalar(2)).sub(p2).add(p3).multiplyScalar(t2);
    const v3 = p3.clone().sub(p1).multiplyScalar(t3);
    
    return v0.add(v1).add(v2).add(v3).multiplyScalar(0.5);
  }
  
  
  
  




function animate(element,keyframes, startTime, animationDuration) {

    let currentTime = (Date.now() - startTime) / 1000;
  
    if (currentTime > animationDuration) {
        element.position.copy(keyframes[-1].position)
        element.rotation.copy(keyframes[-1].rotation)
        return
    }
  
    // Get the interpolated values
    const { position, rotation } = cubicInterpolation(keyframes, currentTime);
  
    if (position && rotation) {
        element.position.copy(position);
        element.rotation.copy(rotation);
    }
  
    requestAnimationFrame((time) => animate(element, keyframes, startTime, animationDuration));

}

export default animate
  