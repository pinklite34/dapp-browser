import { MoonLoader } from 'react-spinners';
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as cn from 'classnames';
import { DApp } from '../../redux/model';
// import { MoonLoader } from "react-spinners";
import { IState } from '../../redux/reducers/state';
import * as TrayActions from '../../redux/actions/tray';
import { actions as NotificationActions } from '../../modules/Notification';
import { component as AppsManager } from '../../modules/AppsManager';

import './AppCard.sass';

interface AppCardProps {
  dapp?: any;
  switchDapp: (dappName: string) => void;
  installDapp?: (dappName: string, hash: string) => void;
}

interface AppCardState {
  status: string;
}

export class AppCard extends React.Component<AppCardProps, AppCardState> {
  constructor(props: AppCardProps) {
    super(props);
    this.getCategories = this.getCategories.bind(this);
    this.actionHandle = this.actionHandle.bind(this);
    this.state = {
      status: '',
    };
  }

  private getCategories(): JSX.Element {
    const { dapp } = this.props;
    console.log('getCategories', dapp);
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

  private getAction(): JSX.Element {
    const { dapp } = this.props;
    const { status } = this.state;

    // @TODO: next add spinner type by status
    // e.g for updated or install indicator is progress
    const spinner = (
      <div className="loading">
        <MoonLoader color="#508dff" size={13}/>
      </div>
    );

    // const content = status ? spinner : label;

    return (
      <div className={cn('action', { action_installed: dapp.installed })} onClick={this.actionHandle}>
        {dapp.installed ? 'Open' : 'Install'}
      </div>
    );
  }

  onClickAppCard() {
    const { dapp, switchDapp } = this.props;

    console.log('appCARD', this.props, AppsManager);
    if (dapp.installed) {
      return switchDapp(dapp.appName);
    }

    return AppsManager.installDapp(dapp.appName, dapp.hash);
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

const mapDispatchToProps = (dispatch: Dispatch<IState>) => bindActionCreators({
  switchDapp: TrayActions.switchDapp,
}, dispatch);

export default connect<AppCardProps, {}>(null, mapDispatchToProps)(AppCard);
