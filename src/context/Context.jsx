import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from "react";

export const Context = createContext()

export default function ContextProvider(props) {
    const [data, setData] = useState({});
    const [bcvData, setBcvData] = useState({});
    const [paraleloData, setParaleloData] = useState({});

    useEffect(() => {
        fetch('https://pydolarve.org/api/v1/dollar?page=alcambio')
            .then(response => response.json())
            .then(data => {
                setData(data);
                if (data.monitors && data.monitors.bcv) {
                    setBcvData(data.monitors.bcv);
                    setParaleloData(data.monitors.enparalelovzla);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <Context.Provider value={{
            data, setData, bcvData, setBcvData,
            paraleloData, setParaleloData
        }}>
            {props.children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};