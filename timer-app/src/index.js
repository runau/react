import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const INTERVAL_TIME = 90
const COMMENT_LAG_TIME = 15
const MOVE_LAG_TIME = 15
const TAP_LAG_TIME = 5
const BOX_TIME = 420
const FAST = '開封速度重視⇒カウントダウンを止めないようにコメントを続ける'
const EASY = '手数重視⇒カウントダウンが止まったら次のコメントをする'

class StartButton extends React.Component {

  render() {
    return (
      <div>
        <p>ただいまの設定： {this.props.type}</p>
        <button onClick={() => this.props.setting('type', FAST)}>
          開封速度重視
        </button>
        <button onClick={() => this.props.setting('type', EASY)}>
          手数重視
        </button>
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
        <p>この設定で1配信にかかる時間　{convert(this.props.total_time)}</p>
        <p>この設定での時給コイン　{Math.floor(3600 / this.props.total_time * 2)}～{Math.floor(3600 / this.props.total_time * 10)}コイン(期待値{Math.floor(3600 / this.props.total_time * 6)}コイン)</p>
        <button onClick={() => this.props.onClick(0)}>
          リセット
        </button>
        <button onClick={() => this.props.onClick(-1)}>
          一時停止
        </button>
        <h2>調整用</h2>
        <p>boxのタイマーと表示がずれてしまった時は、コメント後、下記ボタンを押して調整してください。</p>
        <button onClick={() => this.props.onClick(-5)}>
          +5秒
        </button>
        <button onClick={() => this.props.onClick(-15)}>
          +15秒
        </button>
        <button onClick={() => this.props.onClick(-30)}>
          +30秒
        </button>
        <button onClick={() => this.props.onClick(-60)}>
          +1分
        </button>
        <button onClick={() => this.props.onClick(5)}>
          -5秒
        </button>
        <button onClick={() => this.props.onClick(15)}>
          -15秒
        </button>
        <button onClick={() => this.props.onClick(30)}>
          -30秒
        </button>
        <button onClick={() => this.props.onClick(60)}>
          -1分
        </button>
        <h2>設定</h2>
        <p>コメント入力にかかる時間  {this.props.comment_lag_time}秒</p>
        <button onClick={() => this.props.setting('comment_lag_time', 5)}>
          5秒
        </button>
        <button onClick={() => this.props.setting('comment_lag_time', 10)}>
          10秒
        </button>
        <button onClick={() => this.props.setting('comment_lag_time', 15)}>
          15秒
        </button>
        <p>配信の移動にかかる時間  {this.props.move_lag_time}秒</p>
        <button onClick={() => this.props.setting('move_lag_time', 10)}>
          10秒
        </button>
        <button onClick={() => this.props.setting('move_lag_time', 15)}>
          15秒
        </button>
        <button onClick={() => this.props.setting('move_lag_time', 20)}>
          20秒
        </button>
        <p>ボックスのタップにかかる時間  {this.props.tap_lag_time}秒</p>
        <button onClick={() => this.props.setting('tap_lag_time', 5)}>
          5秒
        </button>
        <button onClick={() => this.props.setting('tap_lag_time', 10)}>
          10秒
        </button>
        <button onClick={() => this.props.setting('tap_lag_time', 15)}>
          15秒
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    var initState = this.initParam(BOX_TIME , INTERVAL_TIME - MOVE_LAG_TIME)
    initState.total_time = BOX_TIME
    initState.move_lag_time = MOVE_LAG_TIME
    initState.comment_lag_time = COMMENT_LAG_TIME
    initState.tap_lag_time = TAP_LAG_TIME
    initState.type = FAST
    this.state = initState;
    this.adjustment(BOX_TIME)
  }
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.countDown(1);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  initParam(total_time, interval_time) {
    return {
      total_time: total_time,
      total_count: total_time,
      interval_time: interval_time,
      interval_count: interval_time,
      lag_count: 0,
      timer_count: BOX_TIME,
      lag: false,
      box_count: 2,
      stop: false
    }
  }

  countDown(count) {
    if (this.state.stop) {
      return
    }

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
          interval_count: this.state.interval_time
          , lag: false
        });
      }
    } else {
      if (interval_alarm(this.state.interval_count, alarm)) {
        if (this.state.type === FAST) {
          this.setState({
            interval_count: this.state.interval_time
            , lag_count: 0
          });
        } else {
          this.setState({
            lag: true
            , lag_count: this.state.comment_lag_time
          });
        }
      }
    }
    if (total_alarm(this.state.total_count, alarm)) {
      var box = this.state.box_count;
      this.setState(this.initParam(this.state.total_time, this.state.interval_time));
      if (box === 2) {
        this.setState({
          lag: true
          , lag_count: this.state.tap_lag_time
          , total_count: this.state.total_count + this.state.tap_lag_time
          , box_count: 1
        });
      } else {
        this.setState({
          lag: true
          , lag_count: this.state.move_lag_time
          , total_count: this.state.total_count + this.state.move_lag_time
          , box_count: 2
        });
      }
    }
  }
  adjustment(count) {
    if (this.state.type === FAST) {
      this.setState({
        total_count: count,
        interval_count: this.state.interval_time - (this.state.total_time - count) % this.state.interval_time,
        lag_count: 0,
        timer_count: count,
        lag: false
      });
    } else {
      var tmpTime = count % (this.state.interval_time + this.state.comment_lag_time);
      var lag_count = 0
      var interval_count = 0
      var lag = false
      if (tmpTime > this.state.comment_lag_time) {
        interval_count = tmpTime - this.state.comment_lag_time
      }else{
        lag_count = tmpTime
        lag = true
      }
      this.setState({
        total_count: count + Math.floor(count / this.state.interval_time) * this.state.comment_lag_time,
        interval_count: interval_count ,
        lag_count: lag_count,
        timer_count: count,
        lag: lag
      });
    }
  }
  setting(item, value) {
    if (item === 'box_count') {
      this.setState({
        box_count: value
      });
    } else if (item === 'type') {
      var interval_time;
      var total_time;
      if (value === FAST) {
        interval_time = INTERVAL_TIME - this.state.comment_lag_time
        total_time = BOX_TIME
      } else {
        interval_time = INTERVAL_TIME
        total_time = BOX_TIME + this.state.comment_lag_time * Math.floor(BOX_TIME / this.state.interval_time)
      }
      this.setState({
        type: value
        , interval_time: interval_time
        , total_time: total_time
      });
      this.setState(this.initParam(total_time, interval_time));
    } else if (item === 'move_lag_time') {
      this.setState({
        move_lag_time: value
      });
    } else if (item === 'comment_lag_time') {
      if (this.state.type === FAST) {
        this.setState({
          comment_lag_time: value
          ,interval_time: INTERVAL_TIME - value
        });
      }else{
        this.setState({
          comment_lag_time: value
          ,interval_time: INTERVAL_TIME
        });
      }

    } else if (item === 'tap_lag_time') {
      this.setState({
        tap_lag_time: value
      });
    }
    this.adjustment(this.state.timer_count);
  }
  handleClick(count) {
    if (count === 0) {
      this.setState(this.initParam(this.state.total_time, this.state.interval_time));
    } else if (count === -1) {
      if (this.state.stop) {
        this.setState({ stop: false });
      } else {
        this.setState({ stop: true });
      }
    } else {
      this.adjustment(this.state.timer_count - count)
    }
  }
  render() {
    return (
      <StartButton TimerFast
        total_time={this.state.total_time}
        total_count={this.state.total_count}
        box_count={this.state.box_count}
        interval_count={this.state.interval_count}
        timer_count={this.state.timer_count}
        lag_count={this.state.lag_count}
        lag={this.state.lag}
        type={this.state.type}
        comment_lag_time={this.state.comment_lag_time}
        move_lag_time={this.state.move_lag_time}
        tap_lag_time={this.state.tap_lag_time}
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
        <Timer />
      </div>
    );
  }
}

class GoogleAdsense extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }

  render() {
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
