import React from 'react';

interface SNBProps {
    selected: number;
    tabs: string[];
    setTab: (id: number) => void;
    background?: string;
    position?: 'end' | 'start';
}

const SubNavBar: React.FC<SNBProps> = (props: SNBProps) => {
    const background = `${props.background ? `bg-${props.background}` : 'bg-blue-200'} `;
    const position = `${props.position ? `justify-${props.position} ` : 'justify-center '}`;
    const button = 'text-blue-100 cursor-pointer flex mx-4 ';
    const selected = 'border-b-4 border-blue-100 font-bold';
    return (
        <div className={`h-screen/3 w-full flex ${background} ${position}`}>
            <div className={'h-full flex flex-row'}>
                {props.tabs.map((tab, index) => {
                    return (
                        <div
                            onClick={() => props.setTab(index)}
                            key={`sub-nav-${index}`}
                            className={button + (props.selected === index ? selected : '')}
                        >
                            <a className="m-auto">{tab}</a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubNavBar;
