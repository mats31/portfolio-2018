import States from 'core/States';
import * as pages from 'core/pages';
import projectList from 'config/project-list';
import { createDOM } from 'utils/dom';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import ProjectDescription from './ProjectDescription';
import Title from './Title';
import List from './List';
import Menu from './Menu';
import MobileAbout from './MobileAbout';
import Networks from './Networks';
import Scroll from './Scroll';
import template from './ui_home.tpl.html';
import './ui_home.scss';


@visible()
export default class MobileUIHome {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    // this._setupProjectDescription();
    this._setupTitle();
    this._setupList();
    this._setupMenu();
    this._setupAbout();
    // this._setupNetworks();
    this._setupScroll();

    this._setupEvents();
  }

  _setupProjectDescription() {
    this._projectDescription = new ProjectDescription({
      parent: this._el,
    });

    this._projectDescription.updateProject(projectList.projects[0]);
  }

  _setupTitle() {
    this._title = new Title({
      parent: this._el,
    });
  }

  _setupList() {
    this._list = new List({
      parent: this._el,
    });
  }

  _setupMenu() {
    this._menu = new Menu({
      parent: this._el,
    });
  }

  _setupAbout() {
    this._about = new MobileAbout({
      parent: this._el,
    });
  }

  _setupNetworks() {
    this._networks = new Networks({
      parent: this._el,
    });
  }

  _setupScroll() {
    this._scroll = new Scroll({
      parent: this._el,
    });
  }

  _setupEvents() {
    Signals.onResize.add(this._onResize);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this._el.style.display = 'none';
  }

  updateState(page) {
    switch (page) {
      case pages.PROJECT:
        this._title.hide();
        this._menu.hide();
        this._list.hide();
        this._scroll.hide();
        this._about.hide();
        break;
      case pages.ABOUT:
        this._about.show();
        this._title.hide();
        this._menu.hide();
        this._list.hide();
        this._scroll.hide();
        break;
      default:
        this._menu.show();
        this._list.show();
        this._title.show();
        this._scroll.show();
        this._about.hide();
    }

    this._menu.updateState(page);
  }

  removeScrollMessage() {
    this._scroll.onTouchmove();
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onResize(vw, vh) {
    this.resize(vw, vh);

    this._menu.resize();
    this._scroll.resize();
  }

  resize(vw, vh) {
    console.log('width: ', vw);
    console.log('height: ', vh);
  }

  // Update --------------------------------------------------------------------
  update() {
    // const index = Math.floor( ( States.global.progress + (1 / projectList.projects.length) * 2 ) % projectList.projects.length );
    // this._projectDescription.updateProject(projectList.projects[index]);
  }

}
