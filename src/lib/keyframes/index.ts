interface Keyframes {
    [key: number]: {
        width?: number,
        height?: number
    }
}

const fields = ['width', 'height', 'x'];

function animationFunction(delta: number, value: number) {
    return delta * value;
}

export function handleKeyframes(timestamp: number, keyframes: Keyframes) {
    const keyFrameTimestamps = Object.keys(keyframes)
        .map(time => +time)
        .sort((a, b) => a - b);

    const firstGreaterIndex = keyFrameTimestamps.findIndex(number => number > timestamp);

    //validation here
    if(!firstGreaterIndex) return;

    const t1 = keyFrameTimestamps[firstGreaterIndex - 1];
    const t2 =  keyFrameTimestamps[firstGreaterIndex];
    const lower = keyframes[t1];
    const upper = keyframes[t2];

    if(!upper || !lower) return;
    const delta = timestamp - keyFrameTimestamps[firstGreaterIndex - 1];

    return fields.reduce<{ [key: string]: number }>((previousValue, currentValue) => {
        let slope = (upper[currentValue as keyof {}] - lower[currentValue as keyof {}]) / (t2 - t1);

        previousValue[currentValue] = lower[currentValue as keyof {}] + animationFunction(delta, slope);
        return previousValue;
    }, {});
}