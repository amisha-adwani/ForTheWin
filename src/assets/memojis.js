import { genConfig } from 'react-nice-avatar';

export const memojis = [
    {
        id: 1,
        config: genConfig({
            sex: "man",
            faceColor: "#F9C9B6",
            earSize: "small",
            eyeStyle: "circle",
            noseStyle: "short",
            mouthStyle: "smile",
            shirtStyle: "hoody",
            glassesStyle: "none",
            hairColor: "#000",
            hairStyle: "normal",
            hatStyle: "none",
            hatColor: "#000",
            shirtColor: "#F4D150"
        }),
        alt: 'Happy Avatar',
        label: 'Happy\nAvatar'
    },
    {
        id: 2,
        config: genConfig({
            sex: "man",
            faceColor: "#AC6651",
            earSize: "small",
            eyeStyle: "oval",
            noseStyle: "round",
            mouthStyle: "peace",
            shirtStyle: "short",
            glassesStyle: "sunglasses",
            hairColor: "#000",
            hairStyle: "mohawk",
            hatStyle: "none",
            shirtColor: "#262E33"
        }),
        alt: 'Chill Avatar',
        label: 'Chill\nAvatar'
    },
    {
        id: 3,
        config: genConfig({
            sex: "woman",
            faceColor: "#F9C9B6",
            earSize: "small",
            eyeStyle: "smile",
            noseStyle: "short",
            mouthStyle: "smile",
            shirtStyle: "hoody",
            glassesStyle: "round",
            hairColor: "#D2EFF3",
            hairStyle: "womanShort",
            hatStyle: "beanie",
            hatColor: "#262E33",
            shirtColor: "#65C9FF"
        }),
        alt: 'Confident Avatar',
        label: 'Confident\nAvatar'
    }
]; 