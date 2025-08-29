interface LViewsTasks {
  table: {
    columns: {
      node: string;
      spider: string;
      schedule: string;
      priority: string;
      status: string;
      testResult: string,
      testDetail: string,
      cmd: string;
      stat: {
        create_ts: string;
        started_at: string;
        ended_at: string;
        wait_duration: string;
        runtime_duration: string;
        total_duration: string;
        results: string;
      };
    };
  };
  navActions: LNavActions;
  navActionsExtra: {
    filter: {
      select: {
        node: {
          label: string;
        };
        spider: {
          label: string;
        };
        schedule: {
          label: string;
        };
        priority: {
          label: string;
        };
        status: {
          label: string;
        };
      };
      search: {
        cmd: {
          placeholder: string;
        };
      };
    };
  };
}
