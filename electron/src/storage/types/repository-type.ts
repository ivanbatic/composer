import {RecentAppTab} from "./recent-app-tab";
import {AppMeta} from "./app-meta";
import {TabData} from "../../../../src/app/core/workbox/tab-data.interface";

export class RepositoryType {
    activeTab: { tabID: string; activationTime: number; };

    expandedNodes: string[] = [];

    openTabs: TabData<any>[] = [];

    recentApps: RecentAppTab[] = [];

    appMeta: AppMeta = {};

}
