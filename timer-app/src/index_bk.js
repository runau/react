import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const INTERVAL_TIME = 90
const COMMENT_LAG_TIME = 10
const MOVE_LAG_TIME = 15
const TAP_LAG_TIME = 5
const BOX_TIME = 420
const TOTAL_TIME = BOX_TIME + COMMENT_LAG_TIME * 4

class StartButton extends React.Component {

  render() {
    return (
      <div>
        <h2>boxオープンのカウント表示  {convert(this.props.timer_count)}</h2>
        <p>残りbox数  {this.props.box_count}個</p>
        <button onClick={() => this.props.setting('box_count', 1)}>
          1個
        </button>
        <button onClick={() => this.props.setting('box_count', 2)}>
          2個
        </button>
        <p>boxオーブンまでのトータル時間  {convert(this.props.total_count)}</p>
        <p>次のコメントまで {convert(this.props.interval_count)}</p>
        <p>この設定での時給コイン{Math.floor(3600 / TOTAL_TIME * 2)}～{Math.floor(3600 / TOTAL_TIME * 10)}コイン(期待値{Math.floor(3600 / TOTAL_TIME * 6)}コイン)</p>
        <button onClick={() => this.props.onClick(0)}>
          reset
        </button>
        <button onClick={() => this.props.onClick(-1)}>
          stop
        </button>
        <h2>調整用</h2>
        <p>boxのタイマーと表示がずれてしまった時は、コメント後、下記ボタンを押して調整してください。</p>
        <button onClick={() => this.props.adjustment(330)}>5:30</button>
        <button onClick={() => this.props.adjustment(240)}>4:00</button>
        <button onClick={() => this.props.adjustment(150)}>2:30</button>
        <button onClick={() => this.props.adjustment(60)}>
          1:00
        </button>
        <br />
        <p>微調整は、下記ボタンで対応ください。</p>
        <button onClick={() => this.props.onClick(-5)}>
          +5sec
        </button>
        <button onClick={() => this.props.onClick(-15)}>
          +15sec
        </button>
        <button onClick={() => this.props.onClick(5)}>
          -5sec
        </button>
        <button onClick={() => this.props.onClick(15)}>
          -15sec
        </button>
        <h2>設定</h2>
        <p>コメント入力にかかる時間  {COMMENT_LAG_TIME}秒</p>
        <button onClick={() => this.props.setting('comment_lag_time', 5)}>
          5sec
        </button>
        <button onClick={() => this.props.setting('comment_lag_time', 10)}>
          10sec
        </button>
        <button onClick={() => this.props.setting('comment_lag_time', 15)}>
          15sec
        </button>
        <p>配信の移動にかかる時間  {MOVE_LAG_TIME}秒</p>
        <button onClick={() => this.props.setting('move_lag_time', 10)}>
          5sec
        </button>
        <button onClick={() => this.props.setting('move_lag_time', 15)}>
          10sec
        </button>
        <button onClick={() => this.props.setting('move_lag_time', 20)}>
          15sec
        </button>
        <p>ボックスのタップにかかる時間  {TAP_LAG_TIME}秒</p>
        <button onClick={() => this.props.setting('tap_lag_time', 5)}>
          5sec
        </button>
        <button onClick={() => this.props.setting('tap_lag_time', 10)}>
          10sec
        </button>
        <button onClick={() => this.props.setting('tap_lag_time', 15)}>
          15sec
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    var initState = this.initParam()
    initState.move_lag_time = MOVE_LAG_TIME
    initState.comment_lag_time = COMMENT_LAG_TIME
    initState.tap_lag_time = TAP_LAG_TIME    
    this.state = initState;
  }
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.countDown(1);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  initParam() {
    return {
      total_count: TOTAL_TIME,
      interval_count: INTERVAL_TIME,
      lag_count: 0,
      timer_count: BOX_TIME,
      lag: false,
      box_count: 2
    }
  }

  countDown(count) {

    if (this.state.lag) {
      this.setState({
        total_count: this.state.total_count - count
        , lag_count: this.state.lag_count - count
      });
    } else {
      this.setState({
        total_count: this.state.total_count - count
        , interval_count: this.state.interval_count - count
        , timer_count: this.state.timer_count - count
      });
    }
    if (count === 1) {
      this.alartCheck(true);
    } else {
      this.alartCheck(false);
    }
  }
  alartCheck(alarm) {
    if (this.state.lag) {
      if (lag_alarm(this.state.lag_count)) {
        this.setState({
          interval_count: INTERVAL_TIME
          , lag: false
        });
      }
    } else {
      if (interval_alarm(this.state.interval_count, alarm)) {
        this.setState({
          lag: true
          , lag_count: COMMENT_LAG_TIME
        });
      }
    }
    if (total_alarm(this.state.total_count, alarm)) {
      var box = this.state.box_count;
      this.setState(this.initParam());
      if (box === 2) {
        this.setState({
          lag: true
          , lag_count: TAP_LAG_TIME
          , total_count: this.state.total_count + TAP_LAG_TIME
          , box_count: 1
        });
      } else {
        this.setState({
          lag: true
          , lag_count: MOVE_LAG_TIME
          , total_count: this.state.total_count + MOVE_LAG_TIME
          , box_count: 2
        });
      }
    }
  }
  adjustment(count) {
    this.setState({
      total_count: count + Math.floor(count / INTERVAL_TIME) * COMMENT_LAG_TIME,
      interval_count: INTERVAL_TIME,
      lag_count: 0,
      timer_count: count,
      lag: false
    });
  }
  setting(item, value) {
    if (item === 'box_count') {
      this.setState({
        box_count: value
      });
    }
  }
  handleClick(count) {
    if (count === 0) {
      this.setState(this.initParam());
    } else if (count === 1) {
      this.setState(this.initParam());
    } else {
      while (count !== 0) {
        var tmpCount
        if (this.state.lag) {
          if (this.state.lag_count >= count) {
            tmpCount = count
          } else {
            tmpCount = this.state.lag_count
          }
        } else {
          if (this.state.interval_count >= count) {
            tmpCount = count
          } else {
            tmpCount = this.state.interval_count
          }
        }
        this.countDown(tmpCount)
        count = count - tmpCount
      }
    }
  }
  render() {
    return (
      <StartButton
        total_count={this.state.total_count}
        box_count={this.state.box_count}
        interval_count={this.state.interval_count}
        timer_count={this.state.timer_count}
        lag_count={this.state.lag_count}
        lag={this.state.lag}
        onClick={(count) => this.handleClick(count)}
        adjustment={(count) => this.adjustment(count)}
        setting={(item, value) => this.setting(item, value)}
      />
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <GoogleAdsense />
      </div>
    );
  }
}

class GoogleAdsense extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }

  render(){
      return (
        <ins class="adsbygoogle" data-ad-client="ca-pub-4725631118760510" data-ad-slot="7925462339"
        data-ad-format="auto" data-full-width-responsive="true"></ins>
    );
  }
}

function interval_alarm(count, alarm) {

  if (count <= 0) {
    if (alarm) {
      new Audio("./interval.mp3").play();
    }
    return true;
  }
  return false;
}

function total_alarm(count, alarm) {

  if (count <= 0) {
    if (alarm) {
      new Audio("./box_open.mp3").play();
    }
    return true;
  }
  return false;
}

function lag_alarm(count) {

  if (count <= 0) {
    return true;
  }
  return false;
}

function convert(count) {
  return Math.floor(count / 60) + '分' + count % 60 + '秒'
}
// ========================================


ReactDOM.render(
  <Game />
  ,
  document.getElementById('root')
);
