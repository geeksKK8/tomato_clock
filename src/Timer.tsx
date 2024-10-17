import * as React from 'react';
import MotionNumber from 'motion-number'
import { Picker, Button } from 'antd-mobile'
import { basicColumns } from './columns-data';
import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification';
// when using `"withGlobalTauri": true`, you may use
// const { isPermissionGranted, requestPermission, sendNotification, } = window.__TAURI__.notification;

// assets/index-!~{001}~.js
(async () => {
    // Do you have permission to send a notification?
    let permissionGranted = await isPermissionGranted();

    // If not we need to request it
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
})();

const format: React.ComponentProps<typeof MotionNumber>["format"] = {
    minimumIntegerDigits: 2,
};

interface TimerState {
    minutes: number;
    seconds: number;
    isRunning: boolean;
    notify_minutes: number;
    visible: boolean;
}


class Timer extends React.Component<{}, TimerState> {
    private intervalId: number | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: 0,
            isRunning: false,
            notify_minutes: 0,
            visible: false,
        };
    }

    startTimer = () => {
        if (!this.state.isRunning) {
            this.setState({ isRunning: true });
            this.intervalId = window.setInterval(() => {
                if (this.state.seconds === 59) {
                    this.setState((prevState) => ({
                        minutes: prevState.minutes + 1,
                        seconds: 0,
                    }));
                }
                if (this.state.minutes === this.state.notify_minutes) {
                    sendNotification({
                        title: 'Time\'s up!',
                        body: 'Your timer has finished!',
                    });
                    this.resetTimer();
                    return;
                }
                this.setState((prevState) => ({
                    seconds: prevState.seconds + 1,
                }));
            }, 1000);
        } else {
            clearInterval(this.intervalId!);
            this.setState({ isRunning: false });
        }
    };

    resetTimer = () => {
        clearInterval(this.intervalId!);
        this.setState({ minutes: 0, seconds: 0, isRunning: false });
    };

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    render() {
        const { minutes, seconds, isRunning } = this.state;
        const buttonText = isRunning ? 'pause' : 'start';

        return (
            <div className='flex flex-col h-screen gap-32'>
                <div className='flex-grow pt-48'>
                    <div className='flex justify-center font-mono text-3xl text-gray-300'>
                        <MotionNumber
                            value={minutes} format={format}
                        />
                        <div>:</div>
                        <MotionNumber
                            value={seconds} format={format}
                        />
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Button onClick={() => { this.setState({ visible: true }); }}>set notify</Button>
                    <Picker
                        columns={basicColumns}
                        visible={this.state.visible}
                        onClose={() => {
                            this.setState({ visible: false });
                        }}
                        value={[this.state.notify_minutes]}
                        onConfirm={v => {
                            const covertedValue = v.map((item) => item as number)
                            this.setState({ notify_minutes: covertedValue[0] });
                        }}
                    />
                </div>
                <div className='flex justify-center'>
                    <Button color='success' size='large' block onClick={this.startTimer}>{buttonText}</Button>
                    <Button color='primary' size='large' block onClick={this.resetTimer}>reset</Button>
                </div>
            </div >
        );
    }
}

export default Timer;