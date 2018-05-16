const projectList = {
  projects: [
    {
      id: 'resn-little-helper',
      title: 'Resn\'s Little Helper',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'Resn Little Helper\'s description',
      date: 'Resn 2017',
      link: 'View website',
      url: 'http://littlehelper.resn.global/',
      medias: [
        { type: 'image', url: 'images/projects/resn-little-helper/1.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper/2.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper/3.jpg' },
        { type: 'video', url: 'videos/projects/resn-little-helper/1.mp4' },
      ],
    },
    {
      id: 'hp',
      title: 'HP Sound in Color',
      subtitle: 'HP Sound in Color\'s subtitle',
      description: 'Capture any piece of audio on your Android handheld or desktop and transform it into a lush, abstract piece of art',
      date: 'Resn 2016',
      link: 'View website',
      url: 'https://www.hpsoundincolor.com/',
      medias: [
        { type: 'image', url: 'images/projects/hp/1.jpg' },
        { type: 'image', url: 'images/projects/hp/2.jpg' },
        { type: 'image', url: 'images/projects/hp/3.jpg' },
        { type: 'image', url: 'images/projects/hp/4.jpg' },
        { type: 'video', url: 'videos/projects/hp/1.mp4' },
      ],
    },
    {
      id: 'tsuki8',
      title: 'Tsuki 8',
      subtitle: 'Tsuki 8\'s subtitle',
      description: 'Tsuki 8\'s description',
      date: 'Makio&Floz 2016',
      link: 'View website',
      url: 'http://tsuki8.makioandfloz.com/',
      medias: [
        { type: 'image', url: 'images/projects/tsuki8/1.jpg' },
        { type: 'image', url: 'images/projects/tsuki8/2.jpg' },
        { type: 'video', url: 'videos/projects/tsuki8/1.mp4' },
        { type: 'video', url: 'videos/projects/tsuki8/2.mp4' },
      ],
    },
    {
      id: 'speedfactory',
      title: 'Adidas Speedfactory',
      subtitle: 'Adidas Speedfactory\'s subtitle',
      description: 'Adidas Speedfactory\'s description',
      date: 'Resn 2017',
      link: 'View website',
      url: 'https://www.adidas.co.uk/speedfactory',
      medias: [
        { type: 'image', url: 'images/projects/speedfactory/1.jpg' },
        { type: 'image', url: 'images/projects/speedfactory/2.jpg' },
        { type: 'image', url: 'images/projects/speedfactory/3.jpg' },
        { type: 'video', url: 'videos/projects/speedfactory/1.mp4' },

      ],
    },
    {
      id: 'nmd',
      title: 'Adidas NMD',
      subtitle: 'Adidas NMD\'s subtitle',
      description: 'Adidas NMD\'s description',
      date: 'Resn 2017',
      link: '',
      url: '',
      medias: [
        { type: 'image', url: 'images/projects/nmd/1.jpg' },
        { type: 'image', url: 'images/projects/nmd/2.jpg' },
        { type: 'image', url: 'images/projects/nmd/3.jpg' },
        { type: 'video', url: 'videos/projects/nmd/1.mp4' },
      ],
    },
  ],

  getProject(id) {
    return projectList.projects.find( project => project.id === id );
  },

};

module.exports = projectList;
