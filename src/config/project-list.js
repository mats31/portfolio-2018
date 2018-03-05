const projectList = {
  projects: [
    {
      id: 'resn-little-helper',
      title: 'Resn\'s Little Helper',
      subtitle: 'Resn Little Helper\'s subtitle',
      description: 'Resn Little Helper\'s description',
    },
    {
      id: 'speedfactory',
      title: 'Adidas Speedfactory',
      subtitle: 'Adidas Speedfactory\'s subtitle',
      description: 'Adidas Speedfactory\'s description',
    },
    {
      id: 'nmd',
      title: 'Adidas NMD',
      subtitle: 'Adidas NMD\'s subtitle',
      description: 'Adidas NMD\'s description',
    },
    {
      id: 'hp',
      title: 'HP Sound in Color',
      subtitle: 'HP Sound in Color\'s subtitle',
      description: 'HP Sound in Color\'s description',
    },
  ],

  getProject(id) {
    return projectList.projects.find( project => project.id === id );
  },

};

module.exports = projectList;
