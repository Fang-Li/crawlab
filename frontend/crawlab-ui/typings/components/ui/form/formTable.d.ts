import { Store } from 'vuex';
import { Ref } from 'vue';
export declare const useFormTable: <T extends BaseModel>(ns: ListStoreNamespace, store: Store<RootStoreState>, data: FormComponentData<T>) => {
    onAdd: (index: number) => void;
    onClone: (index: number) => void;
    onDelete: (index: number) => void;
    onFieldChange: (rowIndex: number, prop: string, value: any) => void;
    onFieldRegister: (rowIndex: number, prop: string, formRef: Ref) => void;
};
export default useFormTable;
