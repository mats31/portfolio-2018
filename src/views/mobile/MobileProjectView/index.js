import States from 'core/States';
import * as pages from 'core/pages';
import projectList from 'config/project-list';
import CloseButton from 'views/common/CloseButton';
import { createDOM } from 'utils/dom';
import { map, randomFloat } from 'utils/math';
import { autobind } from 'core-decorators';
import { visible, active } from 'core/decorators';
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
      columns: this._el.querySelector('.js-project__viewColumns'),
      mediaContainer: this._el.querySelector('.js-project__medias'),
      title: this._el.querySelector('.js-project__viewTitle'),
      description: this._el.querySelector('.js-project__viewDescription'),
      date: this._el.querySelector('.js-project__date'),
      link: this._el.querySelector('.js-project__link'),
      close: this._el.querySelector('.js-project__close'),
      loading: this._el.querySelector('.js-project__loading'),
      // back: this._el.querySelector('.js-project__back'),
      medias: [],
    };

    this._closeButton = new CloseButton({
      parent: this._ui.close,
      clickCallback: this._onCloseClick,
    });

    this._rotations = [];

    this._deltaY = 0;
    this._deltaTargetY = 0;

    this._needsUpdate = true;

    this._setupEvents();
  }

  _setupEvents() {
    // this._ui.back.addEventListener('click', this._onBackClick);
    Signals.onResize.add(this._onResize);
    Signals.onScroll.add(this._onScroll);
    // Signals.onScrollWheel.add(this._onScrollWheel);
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

    this._ui.loading.style.transform = 'scaleX(0)';
    TweenLite.set(this._ui.loading, { opacity: 1 });
    this._loadingNeedsUpdate = true;
    this._toLoad = 0;
    this._loaded = 0;
    this._targetLoad = 0;
    this._currentLoad = 0;

    this._ui.title.innerHTML = project.title;
    this._ui.description.innerHTML = project.description;
    this._ui.date.innerHTML = project.date;
    if (project.url) {
      this._ui.link.innerHTML = `<a href="${project.url}" target="_blank">${project.link}</a>`;
    } else {
      this._ui.link.innerHTML = `${project.link}`;
    }

    while (this._ui.columns.firstChild) {
      this._ui.columns.removeChild(this._ui.columns.firstChild);
    }

    if (project.role) {
      const role = document.createElement('div');
      role.classList.add('project__viewColumn');
      role.innerHTML = `<div class="project__ViewColumnHead">Role:</div>${project.role}`;
      this._ui.columns.appendChild(role);
    }

    if (project.technologies) {
      const technologies = document.createElement('div');
      technologies.classList.add('project__viewColumn');
      technologies.innerHTML = `<div class="project__ViewColumnHead">Technologies:</div>${project.technologies}`;
      this._ui.columns.appendChild(technologies);
    }

    if (project.clients) {
      const clients = document.createElement('div');
      clients.classList.add('project__viewColumn');
      clients.innerHTML = `<div class="project__ViewColumnHead">Clients:</div>${project.clients}`;
      this._ui.columns.appendChild(clients);
    }

    if (project.awards) {
      const awards = document.createElement('div');
      awards.classList.add('project__viewColumn');
      awards.innerHTML = `<div class="project__ViewColumnHead">Awards:</div>${project.awards}`;
      this._ui.columns.appendChild(awards);
    }

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
        // img.onload = this.activate.bind(this);
        img.onload = this._onImgLoad;

        img.src = media.url;

        this._ui.mediaContainer.appendChild(img);

        this._toLoad++;
      } else {
        const video = document.createElement('video');
        video.loop = true;
        video.muted = true;
        video.setAttribute('playsinline', true);
        video.classList.add('js-project__viewVideo');
        video.classList.add('js-project__viewMedia');
        video.classList.add('project__viewVideo');
        video.src = media.url;

        this._ui.mediaContainer.appendChild(video);
      }

      this._rotations.push({ x: randomFloat(-1.5, 1.5), y: randomFloat(-1.5, 1.5) });
    }

    this._ui.medias = this._ui.mediaContainer.querySelectorAll('.js-project__viewMedia');
  }

  @autobind
  _onImgLoad() {
    this._loaded++;

    this._targetLoad = this._loaded / this._toLoad;

    if (this._loaded === this._toLoad) {
      this.activate();
    }
  }

  activate() {

    TweenLite.killTweensOf(this._ui.loading);
    this._ui.loading.style.display = 'block';
    TweenLite.to(
      this._ui.loading,
      0.5,
      {
        opacity: 0,
        ease: 'Power2.easeOut',
      },
    );

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
        onComplete: () => {
          this._loadingNeedsUpdate = false;
          this._ui.loading.style.display = 'none';
        },
      },
    );
  }

  deactivate() {
    TweenLite.killTweensOf(this._ui.loading);
    this._ui.loading.style.display = 'block';

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

  // @autobind
  // _onBackClick() {
  //   States.router.navigateTo(pages.HOME);
  // }

  @autobind
  _onCloseClick() {
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);
  }

  resize(vw, vh) {
    this._vh = vh;
  }

  @autobind
  _onScroll() {
    this._needsUpdate = true;
  }

  // Update --------------------------------------------------------------------
  update() {
    // if (this._needsUpdate) {
    // this._updateMediaContainer();
    if (this._loadingNeedsUpdate) this._updateLoading();
    this._updateMedias();
    // }
  }

  _updateLoading() {
    this._currentLoad += (this._targetLoad - this._currentLoad) * 0.1;

    this._ui.loading.style.transform = `scaleX(${this._currentLoad})`;
  }

  _updateMediaContainer() {
    this._deltaY += (this._deltaTargetY - this._deltaY) * 0.2;
    if (Math.abs(this._deltaTargetY - this._deltaY) < 0.1) {
      this._deltaY = this._deltaTargetY;
      this._needsUpdate = false;
    }

    this._ui.mediaContainer.style.transform = `translate3d(0,${this._deltaY}px,0)`;
  }

  _updateMedias() {
    for (let i = 0; i < this._ui.medias.length; i++) {
      this._ui.medias[i].style.transform = 'perspective(500px) translate3d(0, 0, 0)';
      const mediaRect = this._ui.medias[i].getBoundingClientRect();
      const minValue = -200;
      const maxValue = 0;
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
