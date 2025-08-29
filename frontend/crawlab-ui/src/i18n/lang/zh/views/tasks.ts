const tasks: LViewsTasks = {
  table: {
    columns: {
      node: '节点',
      spider: '爬虫',
      schedule: '定时任务',
      priority: '优先级',
      status: '状态',
      testResult: '测试结果',
      testDetail: '测试详情',
      cmd: '执行命令',
      stat: {
        create_ts: '创建时间',
        started_at: '开始时间',
        ended_at: '结束时间',
        wait_duration: '等待时间',
        runtime_duration: '运行时间',
        total_duration: '总时间',
        results: '结果数',
      },
    },
  },
  navActions: {
    new: {
      label: '新建任务',
      tooltip: '创建一个新任务',
    },
    filter: {
      search: {
        placeholder: '搜索任务',
      },
    },
  },
  navActionsExtra: {
    filter: {
      select: {
        node: {
          label: '节点',
        },
        spider: {
          label: '爬虫',
        },
        schedule: {
          label: '定时任务',
        },
        priority: {
          label: '优先级',
        },
        status: {
          label: '状态',
        },
      },
      search: {
        cmd: {
          placeholder: '搜索执行命令',
        },
      },
    },
  },
};

export default tasks;
