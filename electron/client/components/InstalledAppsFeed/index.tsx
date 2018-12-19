import AppCard from '../AppsFeed/AppCard';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { DApp, FeedItem } from '../../redux/model';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../../redux/reducers/state';
import * as TrayActions from '../../redux/actions/tray';

import './InstalledAppsFeed.sass';

interface IProps {
  navigateToMarket: () => void;
  switchDapp: (dappName: string) => void;
  feedItems: FeedItem[];
}

class InstalledAppsFeed extends React.Component<IProps> {
  renderAppCardsList() {
    if (!this.props.feedItems || !this.props.feedItems.length) {
      return (
        <div className="empty-list">
          Apps list is empty...
        </div>
      );
    }

    return this.props.feedItems.map((item): JSX.Element => (
      <AppCard key={item.appName} dapp={item} switchDapp={() => this.props.switchDapp(item.appName)}/>
    ));
  }

  render() {
    return (
      <div>
        <div className="header">
          <div className="title">
            Your apps
          </div>
          <div onClick={this.props.navigateToMarket} className="action action-navigation">
            Go to market
          </div>
        </div>
        <div className="list">
          {this.renderAppCardsList()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<IState>) => bindActionCreators({
  switchDapp: TrayActions.switchDapp,
}, dispatch);

const mapStateToProps = (state: IState) => ({
  feedItems: state.feed.items,
});

export default connect(mapStateToProps, mapDispatchToProps)(InstalledAppsFeed);
