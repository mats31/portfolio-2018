const projectList = {
  projects: [
    {
      id: 'resn-little-helper',
      title: 'Resn\'s Little Helper',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'Resn Little Helper\'s description',
      medias: [
        { type: 'image', url: 'images/projects/resn-little-helper-media-1.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-2.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-3.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-4.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-5.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-6.jpg' },
      ],
    },
    {
      id: 'speedfactory',
      title: 'Adidas Speedfactory',
      subtitle: 'Adidas Speedfactory\'s subtitle',
      description: 'Adidas Speedfactory\'s description',
      medias: [
        { type: 'image', url: 'images/projects/resn-little-helper-media-1.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-2.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-3.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-4.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-5.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-6.jpg' },
      ],
    },
    {
      id: 'nmd',
      title: 'Adidas NMD',
      subtitle: 'Adidas NMD\'s subtitle',
      description: 'Adidas NMD\'s description',
      medias: [
        { type: 'image', url: 'images/projects/resn-little-helper-media-1.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-2.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-3.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-4.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-5.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-6.jpg' },
      ],
    },
    {
      id: 'hp',
      title: 'HP Sound in Color',
      subtitle: 'HP Sound in Color\'s subtitle',
      description: 'HP Sound in Color\'s description',
      medias: [
        { type: 'image', url: 'images/projects/resn-little-helper-media-1.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-2.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-3.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-4.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-5.jpg' },
        { type: 'image', url: 'images/projects/resn-little-helper-media-6.jpg' },
      ],
    },
  ],

  getProject(id) {
    return projectList.projects.find( project => project.id === id );
  },

};

module.exports = projectList;
