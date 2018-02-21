export default function getPerspectiveSize(camera, distance) {

  const vFOV = camera.fov * Math.PI / 180;
  const height = 2 * Math.tan( vFOV / 2 ) * Math.abs(distance);
  const aspect = camera.aspect;
  const width = height * aspect;

  return { width, height };
}
