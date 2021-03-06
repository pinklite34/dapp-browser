import * as React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { bindActionCreators, Dispatch } from 'redux';
import CircularProgressbar from 'react-circular-progressbar';
import { Props as MenuProps, slide as Menu, State } from 'react-burger-menu';
import { IoIosDocument, IoMdFolderOpen, IoMdCloudUpload, IoMdMenu } from 'react-icons/io';
import * as filesize from 'filesize';

import {
  component as IpfsStorage,
  models as IpfsStorageModels,
  selectors as IpfsStorageSelectors,
} from '../../modules/IpfsStorage';

import './LoaderPanelStyles.sass';
import { IState } from '../../redux/reducers/state';
import * as LoaderActions from '../../redux/actions/loader';
import * as constants from '../../redux/constants';

interface LoaderPanelState {
  activeTab: string;
}

interface DispatchProps {
  togglePanel(): void;

  setLoaderTab(tab: string): void;
}

interface StateProps {
  uploads: IpfsStorageModels.UploadsFileEntry[];
  uploaded: IpfsStorageModels.UploadedFileEntry[];
  downloads: IpfsStorageModels.DownloadFileEntry[];
  downloaded: IpfsStorageModels.DownloadedFileEntry[];
  isOpen: boolean;
  activeTab: string;
  uploadedUnreadCounter: number;
  downloadedUnreadCounter: number;
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): DispatchProps => bindActionCreators({
  togglePanel: LoaderActions.toggle,
  setLoaderTab: LoaderActions.setLoaderTab,
}, dispatch);

const mapStateToProps = (state: IState): StateProps => ({
  uploads: state.ipfsStorage.uploads,
  uploaded: state.ipfsStorage.uploaded,
  downloads: state.ipfsStorage.downloads,
  downloaded: state.ipfsStorage.downloaded,
  uploadedUnreadCounter: IpfsStorageSelectors.getUnshownUploadedFilesCounter(state),
  downloadedUnreadCounter: IpfsStorageSelectors.getUnshownDownloadedFilesCounter(state),
  activeTab: state.loader.activeTab,
  isOpen: state.isOpen.loader,
});

class LoaderPanel extends React.Component<StateProps & DispatchProps, LoaderPanelState> {
  constructor(props: StateProps & DispatchProps) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.switchTab = this.switchTab.bind(this);
    if (!props.activeTab) {
      this.props.setLoaderTab(constants.LOADER_TAB_UPLOAD);
    }
  }

  private onDrop(uploads: File[]): void {
    uploads.forEach(async (file) => {
      try {
        await IpfsStorage.uploadFile(file.path);
      } catch (err) {
        console.log('Upload file error:', err);
      }
    });
  }

  private switchTab(tabName: string): void {
    this.props.setLoaderTab(tabName);
  }

  renderDownloadingItem(entry: IpfsStorageModels.DownloadFileEntry, i: number) {
    return (
      <li key={i} className="row align-items-center complete no-bg nowrap">
        <div className="col">
          <div className="icon">
            <IoIosDocument fontSize="35px" color="#A8B2BD"/>
          </div>
        </div>

        <div className="col introtext">
          <strong>{entry.hash}</strong>
          <small>Loading...</small>
        </div>
      </li>
    );
  }

  renderDownloadedItem(entry: IpfsStorageModels.DownloadedFileEntry, i: number) {
    return (
      <li key={i} className="row align-items-center complete no-bg nowrap">
        <div className="col">
          <div className="icon">
            <IoIosDocument fontSize="35px" color="#A8B2BD"/>
          </div>
        </div>

        <div className="col introtext">
          <strong>{entry.file.name}</strong>
          <small>{filesize(entry.file.size)}</small>
        </div>
      </li>
    );
  }

  renderDownloadsPanel() {
    const { downloaded, downloads } = this.props;

    return (
      <React.Fragment>
        <ul>
          {
            downloads.map(this.renderDownloadingItem.bind(this))
          }
        </ul>

        <div className="uploaded-name">
          <span>Downloaded files</span>
        </div>

        <ul>
          {
            downloaded.map(this.renderDownloadedItem.bind(this))
          }
        </ul>
      </React.Fragment>
    );
  }

  renderUploadsPanel() {
    return (
      <React.Fragment>
        <Dropzone className="dragzone" activeClassName="dragover" onDrop={this.onDrop}>
          <div className="message">
            <IoMdCloudUpload/>
            <strong>Drag & drop</strong>
            <span>Files Here to Upload</span>
          </div>
        </Dropzone>

        <ul>
          {
            this.props.uploads.map((f, i) => (
                <li className="row align-items-center complete no-bg nowrap" key={i}>
                  <div className="col">
                    <div className="icon">
                      <CircularProgressbar
                        percentage={f.progress}
                        styles={{
                          path: { stroke: `rgba(70, 134, 255, ${f.progress / 100})` },
                        }}
                      />
                      <small className="total">{Math.round(f.progress) || 0}%</small>
                    </div>
                  </div>
                  <div className="col introtext">
                    <strong>{f.file.name}</strong>
                    <small>{filesize(f.file.size)}</small>
                  </div>
                </li>
              ),
            )
          }
        </ul>

        <div className="uploaded-name">
          <span>Uploaded files</span>
        </div>

        <ul>
          {
            this.props.uploaded.map((f, i) => (
              <li className="row align-items-center complete nowrap" key={i}>
                <div className="col">
                  <div className="icon">
                    <IoIosDocument fontSize="35px" color="#A8B2BD"/>
                  </div>
                </div>
                <div className="col introtext">
                  <strong>{f.file.name}</strong>
                  <small>{filesize(f.file.size)}</small>
                </div>
              </li>
            ))
          }
        </ul>
      </React.Fragment>
    );
  }

  render() {
    const { isOpen, togglePanel, uploadedUnreadCounter, downloadedUnreadCounter } = this.props;

    console.log('loaderpanel', downloadedUnreadCounter && `${downloadedUnreadCounter}`, downloadedUnreadCounter )
    const activeClass = 'active show';

    let downloadClass = null;
    let uploadClass = null;
    if (this.props.activeTab === constants.LOADER_TAB_DOWNLOAD) {
      downloadClass = activeClass;
    } else {
      uploadClass = activeClass;
    }

    const menuProps: MenuProps = {
      isOpen,
      outerContainerId: 'root-container',
      pageWrapId: 'content-wrap',
      customBurgerIcon: false,
      customCrossIcon: false,
      right: true,
      width: 300,
      onStateChange: (value) => {
        if (isOpen !== value.isOpen) {
          togglePanel();
        }
      },
    };

    return (
      <Menu {...menuProps}>
        <div className="loader-popup">
          <ul className="nav nav-tabs nav-justified">
            <li className="nav-item">
              <a
                href="#downloads"
                className={`nav-link ${downloadClass}`}
                data-toggle="tab"
                onClick={() => this.switchTab(constants.LOADER_TAB_DOWNLOAD)}>
                Downloads
                {downloadedUnreadCounter && ` (${downloadedUnreadCounter})` || null}
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#uploads"
                className={`nav-link ${uploadClass}`}
                data-toggle="tab"
                onClick={() => this.switchTab(constants.LOADER_TAB_UPLOAD)}>
                Uploads
                {uploadedUnreadCounter && ` (${uploadedUnreadCounter})` || null}
                </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className={`tab-pane ${downloadClass}`} id="downloads">
              {this.renderDownloadsPanel()}
            </div>

            <div className={`tab-pane ${uploadClass}`} id="uploads">
              {this.renderUploadsPanel()}
            </div>
          </div>
        </div>
      </Menu>
    );
  }
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(LoaderPanel);
