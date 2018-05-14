import States from 'core/States';
import * as pages from 'core/pages';
import projectList from 'config/project-list';
import experimentList from 'config/experiment-list';
import { createDOM } from 'utils/dom';
import { visible, opened } from 'core/decorators';
import { autobind } from 'core-decorators';
import Toggle from './toggle';
import template from './list.tpl.html';
import './list.scss';


@visible()
@opened()
export default class MobileListView {
  constructor(options) {
    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      toggle: this._el.querySelector('.js-list__toggle'),
      listContainer: this._el.querySelector('.js-list__container'),
      listItems: this._el.querySelector('.js-list__containerItems'),
    };

    this._toggle = new Toggle({
      el: this._ui.toggle,
      callback: this._onToggleClick,
    });

    this._items = [];

    this._setupItems();
  }

  _setupItems() {
    for (let i = 0; i < projectList.projects.length; i++) {
      const project = projectList.projects[i];

      const index = document.createElement('div');
      index.classList.add('list__containerIndex');
      const label = document.createElement('div');
      label.classList.add('list__containerLabel');
      const item = document.createElement('div');

      const j = i + 1 < 10 ? `0${i + 1}` : i + 1;
      index.innerHTML = `_${j}.`;

      label.innerHTML = project.title;

      item.appendChild(index);
      item.appendChild(label);

      item.addEventListener('click', () => {
        States.router.navigateTo(pages.PROJECT, { id: project.id });

        this.close();
        this.hide();
      });

      this._items.push(item);

      this._ui.listItems.appendChild(item);
    }

    for (let k = 0; k < experimentList.experiments.length; k++) {
      const experiment = experimentList.experiments[k];

      const index = document.createElement('div');
      index.classList.add('list__containerIndex');
      const label = document.createElement('div');
      label.classList.add('list__containerLabel');
      const item = document.createElement('div');
      const l = projectList.projects.length + k + 1 < 10 ? `0${projectList.projects.length + k + 1}` : projectList.projects.length + k + 1;
      index.innerHTML = `_${l}.`;

      label.innerHTML = experiment.title;

      item.appendChild(index);
      item.appendChild(label);

      item.addEventListener('click', () => {
        window.open(experiment.url, '_blank');

        this.close();
        this.hide();
      });

      this._items.push(item);

      this._ui.listItems.appendChild(item);
    }
  }

  // State ---------------------------------------------------------------------

  show() {
    this._el.style.display = 'block';
  }

  hide() {
    this._el.style.display = 'none';
  }

  open() {
    this._toggle.open();

    this._ui.listContainer.style.pointerEvents = 'auto';
    this._ui.listContainer.style.display = 'block';
    TweenLite.killTweensOf(this._ui.listContainer);
    TweenLite.fromTo(
      this._ui.listContainer,
      1.2,
      {
        x: window.innerWidth,
      },
      {
        x: 0,
        // opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenMax.killTweensOf(this._items);
    TweenMax.staggerFromTo(
      this._items,
      1,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'Power2.easeOut',
      },
      0.1,
    );
  }

  close() {
    this._toggle.close();

    this._ui.listContainer.style.pointerEvents = 'none';
    TweenLite.killTweensOf(this._ui.listContainer);
    TweenLite.to(
      this._ui.listContainer,
      0.8,
      {
        x: window.innerWidth,
        // opacity: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._ui.listContainer.style.display = 'none';
        },
      },
    );

    TweenMax.killTweensOf(this._items);
    TweenMax.staggerTo(
      this._items,
      0.6,
      {
        opacity: 0,
        ease: 'Power2.easeOut',
      },
    );
  }

  // Events ------------------------------------

  @autobind
  _onToggleClick() {
    if (this.opened()) {
      this.close();
    } else {
      this.open();
    }
  }
}
