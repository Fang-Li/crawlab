const gits: LViewGits = {
  table: {
    columns: {
      name: '名称',
      status: '状态',
      spiders: '中心任务',
    },
    actions: {
      tooltip: {
        deleteNotAllowed: '无法删除带有中心任务的 Git 仓库',
      },
    },
  },
  navActions: {
    new: {
      label: '新建 Git 仓库',
      tooltip: '添加一个新 Git 仓库',
    },
    filter: {
      search: {
        placeholder: '搜索 Git 仓库',
      },
    },
  },
};

export default gits;
