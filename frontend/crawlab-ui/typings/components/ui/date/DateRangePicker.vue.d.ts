import { Dayjs } from 'dayjs';
interface DateRange {
    start: Dayjs;
    end: Dayjs;
}
interface RangeItem {
    key: RangeItemKey;
    value?: DateRange;
}
interface RangeItemOption extends SelectOption {
    value?: RangeItem;
}
type RangeItemKey = 'custom' | string;
type RangePickerType = 'daterange' | 'datetimerange';
interface RangePickerProps {
    className?: string;
    type?: RangePickerType;
    modelValue?: RangeItem;
    options?: RangeItemOption[];
}
declare const _default: import("vue").DefineComponent<RangePickerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value?: RangeItem | undefined) => any;
}, string, import("vue").PublicProps, Readonly<RangePickerProps> & Readonly<{
    onChange?: ((value?: RangeItem | undefined) => any) | undefined;
}>, {
    type: RangePickerType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
