/*

        Resize a passed 2d canvas context

        ---

        @author Christian de Wit
        @author Kelly Milligan
        @version 1.0.0

        ---

        ctx      context2D     Canvas context to resize
        w        num           new width of the canvas
        h        num           new height of the canvas

        useDpi      bool          optional - whether to scale to device DPI (default true)
        dpiMax      num           optional - maximium DPI to scale to

    */

export default function (ctx, w, h, useDpi, dpiMax) {

  if (useDpi === undefined) {
    useDpi = true;
  }

  let pixelRatio = ( window.devicePixelRatio ) ? window.devicePixelRatio : 1;
  pixelRatio = Math.max( pixelRatio, 1 );

  ctx.canvas.width = w;
  ctx.canvas.height = h;

  ctx.canvas.style.width = `${w}px`;
  ctx.canvas.style.height = `${h}px`;

  if ( useDpi ) {

    if ( dpiMax ) {
      pixelRatio = Math.min( pixelRatio, dpiMax );
    }

    ctx.canvas.width = w * pixelRatio;
    ctx.canvas.height = h * pixelRatio;

    ctx.scale( pixelRatio, pixelRatio );
  }
}
