export default class MeshLineGeometry extends THREE.BufferGeometry {
  constructor(geometry, widthCallback = null) {
    super();

    this.positions = new Float32Array(geometry.length * 2);
    const previous = [];
    const next = [];
    const side = [];
    const width = [];
    const indicesArray = [];
    const uvs = [];

    if ( geometry instanceof Float32Array || geometry instanceof Array ) {
      for ( let j = 0; j < geometry.length; j += 3 ) {
        this.positions[j * 2] = this.positions[j * 2 + 3] = geometry[j];
        this.positions[j * 2 + 1] = this.positions[j * 2 + 4] = geometry[j + 1];
        this.positions[j * 2 + 2] = this.positions[j * 2 + 5] = geometry[j + 2];
      }
    }

    const l = this.positions.length / 6;
    for ( let j = 0; j < l; j++ ) {
      side.push( 1 );
      side.push( -1 );
    }

    let w;
    for ( let j = 0; j < l; j++ ) {
      w = widthCallback ? widthCallback( j / ( l - 1 ) ) : 1;
      width.push( w, w );
    }

    for ( let j = 0; j < l; j++ ) {
      uvs.push( j / ( l - 1 ), 0 );
      uvs.push( j / ( l - 1 ), 1 );
    }

    let v = this.compareV3( 0, l - 1 ) ? this.copyV3( l - 2 ) : this.copyV3( 0 );
    previous.push( v[0], v[1], v[2] );
    previous.push( v[0], v[1], v[2] );
    for ( let j = 0; j < l - 1; j++ ) {
      v = this.copyV3( j );
      previous.push( v[0], v[1], v[2] );
      previous.push( v[0], v[1], v[2] );
    }

    for ( let j = 1; j < l; j++ ) {
      v = this.copyV3( j );
      next.push( v[0], v[1], v[2] );
      next.push( v[0], v[1], v[2] );
    }

    v = this.copyV3( this.compareV3( l - 1, 0 ) ? 1 : ( l - 1 ) );
    next.push( v[0], v[1], v[2] );
    next.push( v[0], v[1], v[2] );

    for ( let j = 0; j < l - 1; j++ ) {
      const n = j * 2;
      indicesArray.push( n, n + 1, n + 2 );
      indicesArray.push( n + 2, n + 1, n + 3 );
    }

    const attributes = {
      position: new THREE.BufferAttribute( this.positions, 3 ),
      previous: new THREE.BufferAttribute( new Float32Array( previous ), 3 ),
      next: new THREE.BufferAttribute( new Float32Array( next ), 3 ),
      side: new THREE.BufferAttribute( new Float32Array( side ), 1 ),
      width: new THREE.BufferAttribute( new Float32Array( width ), 1 ),
      uv: new THREE.BufferAttribute( new Float32Array( uvs ), 2 ),
      index: new THREE.BufferAttribute( new Uint16Array( indicesArray ), 1 ),
    };

    this.addAttribute( 'position', attributes.position );
    this.addAttribute( 'previous', attributes.previous );
    this.addAttribute( 'next', attributes.next );
    this.addAttribute( 'side', attributes.side );
    this.addAttribute( 'width', attributes.width );
    this.addAttribute( 'uv', attributes.uv );
    this.setIndex( attributes.index );
  }

  compareV3( a, b ) {
    const aa = a * 6;
    const ab = b * 6;

    return ( this.positions[aa] === this.positions[ab] ) && (this.positions[aa + 1] === this.positions[ab + 1] ) && (this.positions[aa + 2] === this.positions[ab + 2] );
  }

  copyV3( a ) {
    const aa = a * 6;
    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
  }
}
