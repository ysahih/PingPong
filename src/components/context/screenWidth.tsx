import React, { SetStateAction } from 'react';

export class screenWidth {
    large: boolean = true;
    setLarge: React.Dispatch<SetStateAction<boolean>> = () => {};
}

const ScreenWidth = React.createContext<screenWidth | null>(null);

export default ScreenWidth;