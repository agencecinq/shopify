import { default as TabPanel } from './TabPanel';
import { default as Tab } from './Tab';
export declare class Tabs extends HTMLElement {
    $tabList: HTMLElement | null;
    current: number;
    tabPanels: TabPanel[];
    tabs: Tab[];
    href: string;
    hash: boolean;
    delay: number;
    private setActiveTab;
    /** Call after preventing `tab-before-activate` to complete activation (e.g. after async work). */
    activateTab(index: number): void;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    initEvents(): void;
    private get isRtl();
    handleKeydown: (event: KeyboardEvent) => boolean | void;
    deactivateTabs: () => void;
    deactivateTabPanels: () => void;
    delete({ target }: KeyboardEvent): boolean;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map