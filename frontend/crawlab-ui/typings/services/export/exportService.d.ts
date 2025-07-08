declare const useExportService: () => {
    postExport: (type: ExportType, target: string, conditions?: FilterConditionData[], dbId?: string) => Promise<ResponseWithData<string>>;
    getExport: (type: ExportType, id: string, dbId?: string) => Promise<ResponseWithData<any>>;
    getExportDownload: (type: ExportType, id: string, dbId?: string) => Promise<string>;
};
export default useExportService;
