import { FC, PropsWithChildren, useEffect, useState } from "react";

import Box from "@mui/system/Box";

import './Terminal.css';

interface Log {
    type: 'log' | 'warn' | 'error'
    text: string
}

function getColor(type: Log['type']) {
    if(type === 'log') {
        return '#fff';
    }

    if(type === 'error') {
        return '#ef5350';
    }

    if(type === 'warn') {
        return '#D1D100';
    }
}

const TerminalLogItem: FC<{ log: Log }> = ({ log: { type, text } }) => {
    return (
        <Box 
            sx={{
                color: getColor(type),
            }}
        >
            {text}
        </Box>
    )
}

export const Terminal: FC<PropsWithChildren> = () => {
    const [log, setLog] = useState<Log[]>([]);

    useEffect(() => {
        window.api.on('console-data', (event, type: 'log' | 'error' | 'warn', ...data) => {
            console[type](...data);
            setLog((state) => [{ type, text: data[0]?.toString() }, ...state])
        });
        window.addEventListener('local-log', ({ detail: { type, msg } }: any) => {
            (console as any)[type](msg);
            setLog((state) => [{ type, text: msg }, ...state])
        })
    }, [])

    return (
        <div className="terminal-container">
            {log.map((logItem, index) => (<TerminalLogItem key={logItem.text + index} log={logItem} />))}
        </div>
    )
}