import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import * as NotificationActions from '../redux/actions/notification';
import * as LoaderActions from '../redux/actions/loader';
import * as TrayActions from '../redux/actions/tray';
import * as StatusBarActions from '../redux/actions/status-bar';
import * as AppsFeedActions from "../redux/actions/appsFeed";
import * as SearchActions from "../redux/actions/search";
import * as SettingsActions  from "../redux/actions/settings";

import { AppItem, NotifyItem, StatusBarItem, FeedItem, SearchItem } from '../redux/model';
import { HeaderBar } from './HeaderBar'
import { NotificationPanel } from "./NotificationPanel"
import { LoaderPanel } from './LoaderPanel'
import { SettingsPanel } from './SettingsPanel'
import { StatusBar } from "./StatusBar"
import { Tray } from './Tray';
import { AppsFeed } from './AppsFeed';
import { IState } from '../redux/reducers/state';

interface AppProps {
  openNotificationPanel: boolean,
  openLoaderPanel: boolean,
  openStatusBarPanel: boolean,
  openPeersBarPanel: boolean,
  openSettingsPanel: boolean,
  openSearchPanel: boolean,

  trayItems: AppItem[],
  feedItems: FeedItem[],
  notifyItems: NotifyItem[],
  searchItems: { [index: string]: SearchItem[] },
  statusBarItems?: { [index: string]: StatusBarItem },
  statusBarToggle: () => void,
  peersBarToggle: () => void,
  onToggleSettingsPanel: (openStatus?: boolean) => any,
  onTogglePanel: (openStatus?: boolean) => any,
  onToggleHome: (openStatus?: boolean) => any,
  onToggleLoaderPanel: (openStatus?: boolean) => any,
  onToggleSearch: (openStatus?: boolean) => any,
  clearNotification: (id?: number) => void,
  clearAllNotifications: () => void,
  onAddAppItem: (appItem?: AppItem) => any,
  onSwitchDapp: (targetDappName?: string) => any,
  onToggleAppHome: (dappName: string) => any,
  onResizeAppsFeed: (width: number, height: number) => any,
  isProduction: boolean
}

class App extends React.Component<AppProps> {

  constructor(props: AppProps) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  render() {
    const {
      onTogglePanel, openNotificationPanel, openStatusBarPanel, openPeersBarPanel, openSettingsPanel, openSearchPanel, clearNotification, clearAllNotifications,
      onAddAppItem, onSwitchDapp, onToggleHome, statusBarToggle, peersBarToggle, onToggleAppHome, onToggleSearch, searchItems,
      trayItems, feedItems, notifyItems, statusBarItems, onToggleLoaderPanel, openLoaderPanel, onToggleSettingsPanel
    } = this.props;

    return (
      <div>
        <NotificationPanel
          clearAllNotifications={() => clearAllNotifications()}
          clearNotification={(id: number) => clearNotification(id)}
          items={notifyItems}
          isOpen={openNotificationPanel}
          togglePanel={(openStatus) => onTogglePanel(openStatus)}
          isLoaderPanelOpen={openLoaderPanel}
          toggleLoaderPanel={(openStatus) => onToggleLoaderPanel(openStatus)}
          key="root-notifications" />
        <LoaderPanel
          isOpen={openLoaderPanel}
          togglePanel={(openStatus) => onToggleLoaderPanel(openStatus)}
          isNotificationPanelOpen={openNotificationPanel}
          toggleNotificationPanel={(openStatus) => onTogglePanel(openStatus)}
          key="root-loader" />
        <HeaderBar
          isOpen={openNotificationPanel}
          togglePanel={() => onTogglePanel()}
          toggleLoaderPanel={onToggleLoaderPanel}
          toggleHome={() => onToggleHome(true)}
          searchItems={searchItems}
          isSearchPanelOpen={openSearchPanel}
          toggleSearchPanel={onToggleSearch}
          isSettingsPanelOpen={openSettingsPanel}
          toggleSettingsPanel={onToggleSettingsPanel}
          isStatusBarOpen={openStatusBarPanel}
          toggleStatusBar={statusBarToggle}
          isPeersBarOpen={openPeersBarPanel}
          togglePeersBar={peersBarToggle}
          key="root-headerbar" />
        <div className="content-zone" key="root-content" id="root-container">

          <Tray items={trayItems} toggleSwitch={onSwitchDapp} togglePeersBar={peersBarToggle} peersBarIsOpen={openPeersBarPanel} />

          {/* switch between  AppsFeed and SettingsPanel components  */}
          <AppsFeed items={feedItems} toggleAppHome={onToggleAppHome} settingsPanelIsOpen={openSettingsPanel}/>
          <SettingsPanel isOpen={openSettingsPanel} />
        </div>
        <StatusBar isOpen={openStatusBarPanel} items={statusBarItems} toggleStatusBar={statusBarToggle} peersBarIsOpen={openPeersBarPanel} />
      </div>
    )
  }

  private resize() {
    this.props.onResizeAppsFeed(window.innerWidth, window.innerHeight);
  }

  componentDidMount() {
    if (!this.props.isProduction) {
      this.resize();
      window.addEventListener('resize', this.resize)
    }
  }

  componentWillUnmount() {
    if (!this.props.isProduction) {
      window.removeEventListener('resize', this.resize)
    }
  }
}

const mapStateToProps = (state: IState) => ({
  notifyItems: state.notification.items,
  openNotificationPanel: state.notification.isOpen,
  openLoaderPanel: state.loader.isOpen,
  openStatusBarPanel: state.statusBar.isOpen,
  openPeersBarPanel: state.statusBar.isPeersOpen,
  openSettingsPanel: state.settings.isOpen,
  openSearchPanel: state.search.isOpen,
  statusBarItems: state.statusBar.items,
  trayItems: state.tray.items,
  feedItems: state.feed.items,
  searchItems: state.search.items
});

const mapDispatchToProps = (dispatch: Dispatch<IState>) => bindActionCreators({
  onToggleSettingsPanel: SettingsActions.toggle,
  onTogglePanel: NotificationActions.toggle,
  clearNotification: NotificationActions.clearNotification,
  clearAllNotifications: NotificationActions.clearAllNotifications,
  onToggleLoaderPanel: LoaderActions.toggle,
  statusBarToggle: StatusBarActions.toggle,
  peersBarToggle: StatusBarActions.togglePeers,
  onAddAppItem: TrayActions.addAppItem,
  onSwitchDapp: TrayActions.switchDapp,
  onToggleHome: TrayActions.toggleHome,
  onToggleAppHome: TrayActions.toggleAppHome,
  onResizeAppsFeed: AppsFeedActions.resize,
  onToggleSearch: SearchActions.toggle
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
