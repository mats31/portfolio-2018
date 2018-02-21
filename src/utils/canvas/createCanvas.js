/*

    Create a canvas element and set it's initial size.

    ---

    @author Christian de Wit
    @author Kelly Milligan
    @version 1.0.0

    ---

    w           num           width of the canvas
    h           num           height of the canvas

    useDpi      bool          optional - whether to scale to device DPI (default true)
    dpiMax      num           optional - maximium DPI to scale to

    ---

    Returns     context2D     canvas' 2D context

*/

export default function (w, h, useDpi, dpiMax) {

  useDpi = useDpi !== false;
  // useDpi = useDpi === false ? false : true; // By default scale to DPI

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let pixelRatio = ( window.devicePixelRatio ) ? window.devicePixelRatio : 1;
  pixelRatio = Math.max( pixelRatio, 1 );

  canvas.width = w;
  canvas.height = h;

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  if ( useDpi ) {

    if ( dpiMax ) {
      pixelRatio = Math.min( pixelRatio, dpiMax );
    }

    canvas.width = w * pixelRatio;
    canvas.height = h * pixelRatio;

    ctx.scale( pixelRatio, pixelRatio );
  }

  return ctx;
}
