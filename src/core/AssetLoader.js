import States from 'core/States';
import OBJLoader from 'helpers/OBJLoader';
import resources from 'config/resources';

class AssetLoader {

  constructor() {
    this.assetsToLoad = 0;
    this.assetsLoaded = 0;

    if (typeof resources.images !== 'undefined' && resources.images.length > 0) {
      this.assetsToLoad += resources.images.length;
      this.loadImages();
    }

    if (typeof resources.textures !== 'undefined' && resources.textures.length > 0) {
      this.assetsToLoad += resources.textures.length;
      this.loadTextures();
    }
    if (typeof resources.videos !== 'undefined' && resources.videos.length > 0) {
      this.assetsToLoad += resources.videos.length;
      this.loadVideos();
    }

    if (typeof resources.models !== 'undefined' && resources.models.length > 0) {
      this.assetsToLoad += resources.models.length;
      this.loadModels();
    }

    if (this.assetsToLoad === 0) Signals.onAssetsLoaded.dispatch(100);
  }

  loadImages() {
    const images = resources.images;

    for ( let i = 0; i < images.length; i += 1 ) {

      this.loadImage( images[i] ).then( (image) => {

        States.resources.images.push( image );
        this.assetsLoaded += 1;

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100;
        Signals.onAssetLoaded.dispatch(percent);
        console.log(percent);
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent);
      }, (err) => {
        console.log(err);
      });

    }
  }

  loadImage(media) {
    return new Promise( ( resolve, reject ) => {
      const image = new Image();
      image.alt = media.description;

      image.onload = () => {
        resolve( { id: media.id, media: image } );
      };

      image.onerror = () => {
        reject(`Erreur lors du chargement de l'image : ${image.src}`);
      };

      image.src = media.url;
    });
  }

  loadTextures() {
    const textures = resources.textures;

    for ( let i = 0; i < textures.length; i += 1 ) {

      this.loadTexture( textures[i] ).then( (texture) => {
        States.resources.textures.push( texture );
        this.assetsLoaded += 1;

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100;
        Signals.onAssetLoaded.dispatch(percent);
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent);
      }, (err) => {
        console.log(err);
      });

    }
  }

  loadTexture(media) {
    return new Promise( ( resolve, reject ) => {
      new THREE.TextureLoader().load(
        media.url,
        ( texture ) => {
          resolve( { id: media.id, media: texture } );
        },
        ( xhr ) => {
          console.log( `${( ( xhr.loaded / xhr.total ) * 100)} % loaded` );
        },
        ( xhr ) => {
          reject( `Une erreur est survenue lors du chargement de la texture : ${xhr}` );
        },
      );
    });
  }

  loadVideos() {
    const videos = resources.videos;

    for ( let i = 0; i < videos.length; i += 1 ) {

      this.loadVideo( videos[i] ).then( (video) => {
        States.resources.videos.push( video );
        this.assetsLoaded += 1;
        const percent = (this.assetsLoaded / this.assetsToLoad) * 100;
        Signals.onAssetLoaded.dispatch(percent);
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent);
      }, (err) => {
        console.log(err);
      });

    }
  }

  loadVideo(media) {
    return new Promise( ( resolve, reject ) => {
      const video = document.createElement('video');

      video.oncanplaythrough = () => {
        resolve( { id: media.id, media: video } );
      };

      video.oncanplay = () => {
        resolve( { id: media.id, media: video } );
      };

      video.onloadedmetadata = () => {
        resolve( { id: media.id, media: video } );
      };

      video.onloadeddata = () => {
        resolve( { id: media.id, media: video } );
      };

      const interval = setInterval( () => {
        if ( video.readyState === 4 ) {
          clearInterval(interval);
          resolve( { id: media.id, media: video } );
        }
      }, 100);

      video.onerror = () => {
        reject(`Une erreur est survenue lors du chargement de la video : ${video}`);
      };

      video.src = media.url;

    });
  }

  loadModels() {

    const models = resources.models;

    for ( let i = 0; i < models.length; i += 1 ) {

      this.loadModel( models[i] ).then( (model) => {

        States.resources.models.push( model );
        this.assetsLoaded += 1;

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100;
        Signals.onAssetLoaded.dispatch(percent);
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent);
      }, (err) => {
        console.error(err);
      });

    }
  }

  loadModel(model) {

    return new Promise( ( resolve, reject ) => {

      const ext = model.url.split('.').pop();


      switch (ext) {

        case 'obj': {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            ( object ) => {

              resolve( { id: model.id, media: object, type: 'obj' } );
            },

            () => {},
            () => {
              reject('An error happened with the model import.');
            },
          );
          break;
        }

        default: {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            ( object ) => {
              resolve( { id: model.id, media: object, type: 'obj' } );
            },

            () => {},
            () => {
              reject('An error happened with the model import.');
            },
          );
        }
      }

    });
  }
}

export default new AssetLoader();
