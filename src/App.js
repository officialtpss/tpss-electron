import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
const clipboard = window.require('electron-clipboard-extended')
const app = window.require('electron');


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mClipBoardData: '',
            upDateInfo: '',
            progressObj: null,
        }
        this.startWatchingClipBoardData();
    }

    checkforUpdate=()=>{
        app.ipcRenderer.on('message',(event,upDateInfo,progressObj)=>{
            this.setState({upDateInfo,progressObj})
        })
    }
    componentDidMount() {
        this.checkforUpdate()
    }

    componentWillUnmount() {
        this.stopWatchingClipBoardData();
    }

    stopWatchingClipBoardData = () => {
        clipboard.off('text-changed');
        clipboard.stopWatching();
    }

    startWatchingClipBoardData = () => {
        clipboard
            .on('text-changed', () => {
                this.setState({mClipBoardData: clipboard.readText()})
            })
            .startWatching();

    }


    minimize = () => {
      app.remote.getCurrentWindow().minimize()
    }

    close = (e) => {
            app.remote.getCurrentWindow().close()
    }

     formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    onDownloadProgress=()=>{
        let {progressObj}=this.state
        if(progressObj!==null && progressObj!==undefined){
            return(
                <div>
                    <b>Download speed:  {this.formatBytes(progressObj.bytesPerSecond)} /sec </b><br/>
                    <b>Downloaded :  {Math.round(progressObj.percent)} %</b><br/>
                    <b>Transferred :  {this.formatBytes(progressObj.transferred)} </b><br/>
                    <b>Total :  {this.formatBytes(progressObj.total)} </b><br/>

                </div>

            )
        }

    }


    render() {
        let {mClipBoardData,upDateInfo} = this.state

        return (
            <div className="App">
                <div className={'header'}>
                    <div className={'headerTitle'}>Tpss-electron</div>
                    <button className={'regbtn topBtn'} onClick={this.minimize}>-</button>
                    <button className={'greenbtn topBtn'} onClick={this.close}>x</button>

                </div>
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>React + Electron = <span role="img" aria-label="love">😍</span></h2>
                </div>
                <p className="App-intro">
                    <b> Second Version </b><br/>
                    <b> Copy Any Data </b><br/>
                    <b> 😍 </b><br/>
                    <b> {mClipBoardData} </b><br/>
                    <b> {upDateInfo} </b><br/><br/><br/>

                    {this.onDownloadProgress()}
                </p>
            </div>
        );
    }
}

export default App;
