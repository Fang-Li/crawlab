export declare global {
  interface AutoProbe extends BaseModel {
    name?: string;
    url?: string;
    query?: string;
    last_task_id?: string;
    last_task?: AutoProbeTask;
    default_task_id?: string;
    run_on_create?: boolean;
    page_pattern?: PagePattern;
    page_data?: PageData;
    viewport?: PageViewPort;
  }

  type AutoProbeTaskStatus =
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled';

  type SelectorType = 'css' | 'xpath' | 'regex';
  type ExtractType = 'text' | 'attribute' | 'html';

  interface BaseSelector {
    name: string;
    selector_type: SelectorType;
    selector: string;
  }

  interface FieldRule extends BaseSelector {
    extraction_type: ExtractType;
    attribute_name?: string;
    default_value?: string;
  }

  interface ItemPattern {
    fields?: FieldRule[];
    lists?: ListRule[];
  }

  interface ListRule {
    name: string;
    list_selector_type: SelectorType;
    list_selector: string;
    item_selector_type: SelectorType;
    item_selector: string;
    item_pattern: ItemPattern;
  }

  type PaginationRule = BaseSelector;

  interface PagePattern {
    name: string;
    fields?: FieldRule[];
    lists?: ListRule[];
    pagination?: PaginationRule;
  }

  type PageData = Record<string, string | number | boolean | PageData[]>;

  interface AutoProbeTask extends BaseModel {
    autoprobe_id: string;
    url?: string;
    query?: string;
    status: AutoProbeTaskStatus;
    error?: string;
    html?: string;
    page_pattern?: PagePattern;
    page_data?: PageData;
    page_elements?: PageElement[];
    provider_id?: string;
    model?: string;
    usage?: LLMResponseUsage;
  }

  interface AutoProbeTaskResult {
    html?: string;
    screenshot_base64?: string;
    page_pattern?: PagePattern;
    page_data?: PageData;
    page_elements?: PageElement[];
  }

  type AutoProbeItemType = 'page_pattern' | 'list' | 'field' | 'pagination';

  interface AutoProbeNavItem<T = any> extends NavItem<T> {
    name?: string;
    type?: AutoProbeItemType;
    rule?: ListRule | FieldRule | PaginationRule;
    children?: AutoProbeNavItem[];
    parent?: AutoProbeNavItem;
    fieldCount?: number;
  }

  interface AutoProbeResults {
    data?: PageData | PageData[];
    fields?: AutoProbeNavItem[];
    activeField?: AutoProbeNavItem;
  }

  interface PageViewPort {
    width: number;
    height: number;
  }

  interface ElementCoordinates {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  type PageElementType = 'list' | 'list-item' | 'field' | 'pagination';

  interface PageElement {
    name: string;
    type: PageElementType;
    coordinates: ElementCoordinates;
  }

  interface PagePreviewResult {
    screenshot_base64: string;
    page_elements: PageElement[];
  }

  type ViewPortValue = 'pc-normal' | 'pc-wide' | 'pc-small';

  interface ViewPortSelectOption extends SelectOption<ViewPortValue> {
    viewport: PageViewPort;
  }
}
