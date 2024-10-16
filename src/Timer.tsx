import * as React from 'react';
import MotionNumber from 'motion-number'
import { Button } from 'antd-mobile'

const format: React.ComponentProps<typeof MotionNumber>["format"] = {
    minimumIntegerDigits: 2,
};

interface TimerState {
    minutes: number;
    seconds: number;
    isRunning: boolean;
}

class Timer extends React.Component<{}, TimerState> {
    private intervalId: number | null = null;

    constructor(props: {}) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: 0,
            isRunning: false,
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
            <div className='flex flex-col h-screen'>
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
                    <Button color='success' size='large' block onClick={this.startTimer}>{buttonText}</Button>
                    <Button color='primary' size='large' block onClick={this.resetTimer}>reset</Button>
                </div>
            </div>
        );
    }
}

export default Timer;