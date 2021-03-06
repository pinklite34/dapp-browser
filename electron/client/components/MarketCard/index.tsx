import { MoonLoader } from 'react-spinners';
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as cn from 'classnames';
import { IState } from '../../redux/reducers/state';
import * as TrayActions from '../../redux/actions/tray';
import { component as AppsManager, actions as AppsManagerActions } from '../../modules/AppsManager';

// import './InstalledAppsFeed.sass';
import * as MarketActions from '../../redux/actions/market';

interface AppCardProps {
  dapp?: any;
  updateAllDapps: () => void;
}

interface AppCardConnectProps {
  switchDapp?: (dappName: string) => void;
  installDapp?: (dappName: string, hash: string) => void;
  downloadDapp?: (ipfsHash: string) => void;
  openDapp?: (dappName: string) => void;
}

interface AppCardState {
  status: string;
  isInstalling: boolean;
  installSuccess: any;
  installFailure: any;
}

export class MarketCard extends React.Component<AppCardProps & AppCardConnectProps, AppCardState> {
  constructor(props: AppCardProps & AppCardConnectProps) {
    super(props);
    this.getCategories = this.getCategories.bind(this);
    this.actionHandle = this.actionHandle.bind(this);

    this.state = {
      status: '',
      isInstalling: false,
      installSuccess: null,
      installFailure: null,
    };
  }

  private getCategories(): JSX.Element {
    const { dapp } = this.props;
    const items = dapp.categories && dapp.categories.map((item: any, index: number): JSX.Element => (
      <div key={`tag-${index}`} className="tag">
        <span>{item}</span>
      </div>
    ));
    return (
      <div className="tags">
        {items}
      </div>
    );
  }

  private async actionHandle(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    // @TODO: add functionaly cb wrapper here\
    this.setState({
      status: 'install',
    });
  }

  getBadge() {
    const { dapp } = this.props;
    const { isInstalling, installSuccess } = this.state;

    if (isInstalling) {
      return (
        <div className="loading">
          <MoonLoader color="#508dff" size={13}/>
        </div>
      );
    }

    if (installSuccess) {
      return 'Open';
    }

    return dapp.installed ? 'Open' : 'Install';
  }

  private getAction(): JSX.Element {
    const { dapp } = this.props;
    const { installSuccess } = this.state;

    return (
      <div className={cn('action', { action_installed: dapp.installed || installSuccess })}>
        {this.getBadge()}
      </div>
    );
  }

  async installDapp() {
    const { dapp } = this.props;

    this.setState({
      isInstalling: true,
    });

    try {
      await AppsManager.installDapp(dapp.appName, dapp.hash);
      this.setState({ installSuccess: true, isInstalling: false });
    } catch (e) {
      this.setState({ installFailure: e, isInstalling: false });
    }
  }

  onClickAppCard() {
    const { dapp, openDapp } = this.props;
    const { isInstalling, installSuccess } = this.state;

    if (isInstalling) {
      return null;
    }

    if (dapp.installed || installSuccess) {
      return openDapp(dapp.appName);
    }

    return this.installDapp();
  }

  public render() {
    const { dapp } = this.props;
    return (
      <div className="app-card" onClick={this.onClickAppCard.bind(this)}>
        <div className="header" style={{ backgroundImage: `url('${dapp.preview || ''}')` }}>
        </div>
        <div className="content">
          <div className="title">{dapp.appName}</div>
          <div className="footer">
            {this.getCategories()}
            {this.getAction()}
          </div>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch: Dispatch<IState>): AppCardConnectProps => bindActionCreators({
  switchDapp: TrayActions.switchDapp,
  downloadDapp: MarketActions.downloadDapp,
  openDapp: AppsManagerActions.openDapp,
}, dispatch);

export default connect<AppCardProps, {}>(null, mapDispatchToProps)(MarketCard);
