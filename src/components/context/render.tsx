import React, { SetStateAction } from 'react';

export class renderContext {
    render: string = 'Home';
    setRender: React.Dispatch<SetStateAction<string>> = () => {};
}

const RenderContext = React.createContext<renderContext | null>(null);

export default RenderContext;