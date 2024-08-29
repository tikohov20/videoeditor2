import { number } from "mathjs";
import { KeyFrames } from "@/lib/shared/types.ts";

const fields = ['width', 'height', 'x', 'y', 'opacity', 'rotation'];

function animationFunction(delta: number, value: number) {
    return delta * value;
}

export function handleKeyframes(timestamp: number, keyframes: KeyFrames) {
    const keyFrameTimestamps = Object.keys(keyframes)
        .map(time => +time)
        .sort((a, b) => a - b);

    const firstGreaterIndex = keyFrameTimestamps.findIndex(number => number > timestamp);

    // validation here
    if(!firstGreaterIndex) return;

    const t1 = keyFrameTimestamps[firstGreaterIndex - 1];
    const t2 =  keyFrameTimestamps[firstGreaterIndex];
    const lower = keyframes[t1];
    let upper = keyframes[t2];

    if(!upper || !lower) {
        return keyframes[Math.max(...Object.keys(keyframes).map(key => number(key)))];
    }

    const delta = timestamp - keyFrameTimestamps[firstGreaterIndex - 1];

    return fields.reduce<{ [key: string]: number }>((previousValue, currentValue) => {
        let slope = (upper[currentValue as keyof {}] - lower[currentValue as keyof {}]) / (t2 - t1);

        previousValue[currentValue] = lower[currentValue as keyof {}] + animationFunction(delta, slope);
        return previousValue;
    }, {});
}
