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
        }
        this.startWatchingClipBoardData();
    }

    checkforUpdate=()=>{
        app.ipcRenderer.on('message',(upDateInfo)=>{
            this.setState({upDateInfo})
        })
    }

    componentWillUnmount() {
        this.stopWatchingClipBoardData();
        this.checkforUpdate();
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
                    <b> Copy Any Data </b><br/>
                    <b> 😍 </b><br/>
                    <b> {mClipBoardData} </b><br/>
                    <b>Update info {upDateInfo} </b><br/>
                </p>
            </div>
        );
    }
}

export default App;
