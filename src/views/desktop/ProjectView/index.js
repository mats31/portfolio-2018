import States from 'core/States';
import * as pages from 'core/pages';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { map, randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, active } from 'core/decorators';
import CloseButton from 'views/common/CloseButton';
import template from './project_view.tpl.html';
import './project_view.scss';


@visible()
@active()
export default class DesktopProjectView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      mediaContainer: this._el.querySelector('.js-project__medias'),
      title: this._el.querySelector('.js-project__viewTitle'),
      description: this._el.querySelector('.js-project__viewDescription'),
      date: this._el.querySelector('.js-project__date'),
      link: this._el.querySelector('.js-project__link'),
      close: this._el.querySelector('.js-project__close'),
      medias: [],
    };

    this._closeButton = new CloseButton({
      parent: this._ui.close,
      clickCallback: this._onCloseClick,
    });

    this._rotations = [];

    this._deltaY = 0;
    this._deltaTargetY = 0;
    this._easing = 0.2;

    this._needsUpdate = false;

    this._setupEvents();
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';
    TweenLite.to(
      this._el,
      0.6,
      {
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    this._deltaY = 0;
    this._deltaTargetY = 0;

    this._closeButton.show();
  }

  hide({ delay = 0 } = {}) {
    TweenLite.to(
      this._el,
      0.6,
      {
        // delay: 0.4,
        opacity: 0,
        ease: 'Power2.easeOut',
        onComplete: () => {
          this._el.style.display = 'none';
        },
      },
    );

    this._closeButton.hide();

    this.deactivate();
  }

  updateProject() {
    const project = projectList.getProject(States.router.getLastRouteResolved().params.id);

    this._ui.title.innerHTML = project.title;
    this._ui.description.innerHTML = project.description;
    this._ui.date.innerHTML = project.date;
    this._ui.link.innerHTML = `<a href="${project.url}">${project.link}</a>`;

    while (this._ui.mediaContainer.firstChild) {
      this._ui.mediaContainer.removeChild(this._ui.mediaContainer.firstChild);
    }

    this._rotations = [];

    for (let i = 0; i < project.medias.length; i++) {
      const media = project.medias[i];

      if (media.type === 'image') {
        const img = new Image();
        img.classList.add('js-project__viewImg');
        img.classList.add('js-project__viewMedia');
        img.classList.add('project__viewImg');
        img.onload = this.activate.bind(this);

        img.src = media.url;

        this._ui.mediaContainer.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.loop = true;
        video.classList.add('js-project__viewVideo');
        video.classList.add('js-project__viewMedia');
        video.classList.add('project__viewVideo');
        video.src = media.url;

        this._ui.mediaContainer.appendChild(video);
      }

      this._rotations.push({ x: randomFloat(-1, 1), y: randomFloat(-1, 1) });
    }

    this._ui.medias = this._ui.mediaContainer.querySelectorAll('.js-project__viewMedia');
  }

  activate() {
    this._ui.mediaContainer.style.display = 'block';
    TweenLite.fromTo(
      this._ui.mediaContainer,
      0.6,
      {
        y: 200,
        opacity: 0,
      },
      {
        delay: 0,
        y: 0,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );
  }

  deactivate() {
    TweenLite.to(
      this._ui.mediaContainer,
      0.6,
      {
        delay: 0,
        y: 200,
        opacity: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          while (this._ui.mediaContainer.firstChild) {
            this._ui.mediaContainer.removeChild(this._ui.mediaContainer.firstChild);
          }

          this._deltaY = 0;
          this._deltaTargetY = 0;

          this._ui.mediaContainer.style.display = 'none';
        },
      },
    );
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  @autobind
  _onCloseClick() {
    States.router.navigateTo(pages.HOME);
  }

  resize(vw, vh) {
    this._vh = vh;
    this._deltaTargetY = 0;
    this._deltaY = 0;
    this._needsUpdate = true;
  }

  @autobind
  _onScrollWheel(event) {
    if (this._ui.medias.length > 0) {
      const lastMediaHeight = this._ui.medias[this._ui.medias.length - 1].offsetHeight;
      const mediaContainerRect = this._ui.mediaContainer.getBoundingClientRect();
      const height = mediaContainerRect.height;
      const max = height + ( this._el.offsetHeight - height ) - window.innerHeight * 0.5 - lastMediaHeight * 0.5;

      this._deltaTargetY -= event.deltaMode === 1 ? event.deltaY * 20 : event.deltaY * 0.5;
      this._deltaTargetY = Math.max( -max, Math.min( 0, this._deltaTargetY ) );

      this._easing = event.deltaMode === 1 ? 0.05 : 0.2;


      this._needsUpdate = true;
    }
  }

  // Update --------------------------------------------------------------------
  update() {

    if (this._needsUpdate) {
      this._updateMediaContainer();
      this._updateMedias();
    }
  }

  _updateMediaContainer() {
    this._deltaY += (this._deltaTargetY - this._deltaY) * this._easing;
    if (Math.abs(this._deltaTargetY - this._deltaY) < 0.1) {
      this._deltaY = this._deltaTargetY;
      this._needsUpdate = false;
    }

    this._ui.mediaContainer.style.transform = `translate3d(0,${this._deltaY}px,0)`;
  }

  _updateMedias() {
    for (let i = 0; i < this._ui.medias.length; i++) {
      this._ui.medias[i].style.transform = 'perspective(500px) translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg)';
      const mediaRect = this._ui.medias[i].getBoundingClientRect();
      const minValue = -600;
      const maxValue = -200;
      const opacity = i === this._ui.medias.length - 1 ? 1 : Math.abs( map( Math.max( minValue, Math.min( maxValue, mediaRect.top ) ), minValue, maxValue, 0, 1) );
      const translate = i === this._ui.medias.length - 1 ? 0 : Math.abs( opacity - 1 ) * -300;
      const rotation = i === this._ui.medias.length - 1 ? 0 : Math.abs( opacity - 1 ) * 60;

      if (this._ui.medias[i].paused !== undefined && mediaRect.top > -mediaRect.height && mediaRect.top <= this._vh) {
        this._ui.medias[i].play();
      } else if (this._ui.medias[i].paused !== undefined) {
        this._ui.medias[i].pause();
      }

      this._ui.medias[i].style.opacity = opacity;
      this._ui.medias[i].style.transform = `perspective(500px) translate3d(0, 0, ${translate}px) rotate3d(${this._rotations[i].x}, ${this._rotations[i].y}, 0, ${rotation}deg)`;
    }
  }

}
