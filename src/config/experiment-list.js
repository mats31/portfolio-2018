const experimentList = {
  experiments: [
    {
      id: 'devx-experiment-2018',
      title: 'Devx Experiment 2018',
      subtitle: 'Devx Experiment 2018\'s subtitle',
      description: 'Devx Experiment 2018\'s description',
      url: 'http://devx.ddd.it/en/experiment/10',
    },
    {
      id: 'christmas-experiment-2017',
      title: 'Christmas Experiment 2017',
      subtitle: 'Christmas Experiment 2017\'s subtitle',
      description: 'Christmas Experiment 2017\'s description',
      url: 'http://christmasexperiments.com/2017/14/paper-plane-journey/',
    },
    {
      id: 'devx-experiment-2017',
      title: 'Devx Experiment 2017',
      subtitle: 'Devx Experiment 2017\'s subtitle',
      description: 'Devx Experiement 2017\'s description',
      url: 'http://devx.ddd.it/en/experiment/23',
    },
    {
      id: 'christmas-experiment-2016',
      title: 'Christmas Experiment 2016',
      subtitle: 'Christmas Experiment 2016\'s subtitle',
      description: 'Christmas Experiment 2016\'s description',
      url: 'http://christmasexperiments.com/2016/17/the-gift-chase/',
    },
    {
      id: 'rasengan',
      title: 'Rasengan',
      subtitle: 'Rasengan\'s subtitle',
      description: 'Rasengan\'s description',
      url: 'http://mathis-biabiany.fr/lab/rasengan/',
    },
  ],

  getProject(id) {
    return experimentList.experiments.find( project => project.id === id );
  },

};

module.exports = experimentList;
